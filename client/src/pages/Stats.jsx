import { useState, useEffect } from 'react';
import api from '../api/axios';

function Heatmap({ data }) {
    const activityMap = {};
    data.forEach(({ date, count }) => { activityMap[date] = Number(count); });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    // Rewind to Sunday of that week
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days = [];
    const cursor = new Date(startDate);
    while (cursor <= today) {
        const dateStr = cursor.toISOString().split('T')[0];
        days.push({ date: dateStr, count: activityMap[dateStr] || 0, future: cursor > today });
        cursor.setDate(cursor.getDate() + 1);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    const getColor = (count, future) => {
        if (future) return 'bg-transparent';
        if (!count) return 'bg-gray-800';
        if (count >= 8) return 'bg-green-400';
        if (count >= 5) return 'bg-green-500';
        if (count >= 3) return 'bg-green-700';
        return 'bg-green-900';
    };

    const monthLabels = [];
    weeks.forEach((week, wi) => {
        const first = week[0];
        if (first) {
            const d = new Date(first.date);
            if (d.getDate() <= 7) {
                monthLabels.push({ wi, label: d.toLocaleString('default', { month: 'short' }) });
            }
        }
    });

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className='overflow-x-auto'>
            <div className='flex gap-1 mb-1 ml-6'>
                {weeks.map((_, wi) => {
                    const label = monthLabels.find(m => m.wi === wi);
                    return <div key={wi} className='w-3 text-center text-xs text-white shrink-0'>{label?.label ?? ''}</div>;
                })}
            </div>
            <div className='flex gap-1'>
                <div className='flex flex-col gap-1 mr-1'>
                    {dayLabels.map((d, i) => (
                        <div key={i} className='w-3 h-3 text-xs text-white flex items-center justify-center'>{i % 2 === 1 ? d : ''}</div>
                    ))}
                </div>
                {weeks.map((week, wi) => (
                    <div key={wi} className='flex flex-col gap-1'>
                        {week.map((day, di) => (
                            <div
                                key={di}
                                title={day.count ? `${day.date}: ${day.count} session${day.count !== 1 ? 's' : ''}` : day.date}
                                className={`w-3 h-3 rounded-sm ${getColor(day.count, day.future)} transition-colors`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className='flex items-center gap-2 mt-3 text-xs text-white'>
                <span>Less</span>
                {['bg-gray-800', 'bg-green-900', 'bg-green-700', 'bg-green-500', 'bg-green-400'].map(c => (
                    <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
                ))}
                <span>More</span>
            </div>
        </div>
    );
}

function StatCard({ label, value, sub }) {
    return (
        <div className='bg-gray-700/50 rounded-xl px-6 py-5 flex flex-col gap-1'>
            <p className='text-xs uppercase tracking-widest text-blue-400'>{label}</p>
            <p className='text-4xl font-bold text-white'>{value}</p>
            {sub && <p className='text-sm text-blue-400'>{sub}</p>}
        </div>
    );
}

export default function Stats() {
    const [summary, setSummary] = useState(null);
    const [heatmap, setHeatmap] = useState([]);
    const [decks, setDecks] = useState([]);
    const [mcq, setMcq] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [s, h, d, m] = await Promise.all([
                    api.get('/stats/summary'),
                    api.get('/stats/heatmap'),
                    api.get('/stats/decks'),
                    api.get('/stats/mcq'),
                ]);
                setSummary(s.data);
                setHeatmap(h.data.heatmap);
                setDecks(d.data.decks);
                setMcq(m.data.mcq);
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) return (
        <div className='min-h-screen text-white flex items-center justify-center'>
            <p className='text-gray-500'>Loading stats...</p>
        </div>
    );

    return (
        <div className='min-h-screen text-white px-8 py-10 max-w-5xl mx-auto'>
            <h1 className='text-3xl font-bold mb-8'>Your Stats</h1>

            {/* Summary cards */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10'>
                <StatCard label='Total Sessions' value={summary?.total_sessions ?? 0} />
                <StatCard label='Cards Studied' value={summary?.total_cards ?? 0} />
                <StatCard label='Current Streak' value={summary?.current_streak ?? 0} sub='days' />
                <StatCard label='Longest Streak' value={summary?.longest_streak ?? 0} sub='days' />
            </div>

            {/* Heatmap */}
            <div className='bg-gray-700/50 rounded-xl px-6 py-6 mb-10'>
                <h2 className='text-sm uppercase tracking-widest text-blue-400 font-semibold mb-5'>Activity</h2>
                <Heatmap data={heatmap} />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Deck activity */}
                <div className='bg-gray-700/50 rounded-xl px-6 py-6'>
                    <h2 className='text-sm uppercase tracking-widest text-blue-400 font-semibold mb-5'>Deck Activity</h2>
                    {decks.length === 0 ? (
                        <p className='text-white text-sm'>No sessions recorded yet.</p>
                    ) : (
                        <div className='flex flex-col gap-3'>
                            {decks.map((d, i) => (
                                <div key={i} className='flex items-center justify-between text-sm border-b border-gray-600/50 pb-3 last:border-0 last:pb-0'>
                                    <div>
                                        <p className='font-medium text-white'>{d.title}</p>
                                        <p className='text-gray-500 text-xs mt-0.5'>Last studied {formatDate(d.last_studied)}</p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-blue-400 font-semibold'>{d.sessions} sessions</p>
                                        <p className='text-white text-xs'>{d.cards_studied} cards</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* MCQ performance */}
                <div className='bg-gray-700/50 rounded-xl px-6 py-6'>
                    <h2 className='text-sm uppercase tracking-widest text-blue-400 font-semibold mb-5'>MCQ Performance</h2>
                    {mcq.length === 0 ? (
                        <p className='text-white text-sm'>No MCQ sessions yet.</p>
                    ) : (
                        <div className='flex flex-col gap-3'>
                            {mcq.map((m, i) => (
                                <div key={i} className='border-b border-gray-600/50 pb-3 last:border-0 last:pb-0'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <p className='font-medium text-white text-sm'>{m.title}</p>
                                        <p className='text-xs text-white'>{m.sessions} attempt{m.sessions !== 1 ? 's' : ''}</p>
                                    </div>
                                    <div className='flex gap-4'>
                                        <div>
                                            <p className='text-xs text-white mb-0.5'>Best</p>
                                            <p className='text-green-400 font-bold'>{m.best_pct}%</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-white mb-0.5'>Avg</p>
                                            <p className='text-blue-400 font-bold'>{m.avg_pct}%</p>
                                        </div>
                                        <div className='flex-1'>
                                            <p className='text-xs text-white mb-1'>Avg score</p>
                                            <div className='h-1.5 bg-gray-400 rounded-full overflow-hidden'>
                                                <div
                                                    className='h-full bg-blue-500 rounded-full'
                                                    style={{ width: `${m.avg_pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
