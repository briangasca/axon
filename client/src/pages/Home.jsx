import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function FadeInSection({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 40) setScrolled(true); };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 w-screen min-h-screen">

        <div className='flex items-center justify-between px-16 py-24'>
          <div className="flex flex-col gap-6 rounded-2xl px-12 py-16">
            <h1 className="text-8xl font-cal -top-40 relative text-blue-500 animate-fade-up">axon.</h1>
            <h1 className="hachi-text text-8xl font-cal">
              <span className="block animate-fade-up" style={{ animationDelay: '0.15s', opacity: 0 }}>Simple,</span>
              <span className="block animate-fade-up" style={{ animationDelay: '0.30s', opacity: 0 }}>Lightweight,</span>
              <span className="block animate-fade-up" style={{ animationDelay: '0.45s', opacity: 0 }}>Flashcard Studying.</span>
            </h1>
            <button
              className="animate-fade-up w-fit px-16 text-lg py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-800 transition-all duration-200 cursor-pointer"
              style={{ animationDelay: '0.60s', opacity: 0 }}
              onClick={() => navigate(user ? '/dashboard' : '/register')}
            >
              {user ? 'Continue to Dashboard →' : 'Sign Up Now →'}
            </button>
          </div>

          <div className="relative animate-fade-up flex items-center" style={{ animationDelay: '0.6s', opacity: 0 }}>
            <span className="absolute top-16 left-32 text-9xl rotate-45 animate-bounce-x text-white">→</span>
            <div className="absolute top-4 left-2  bg-white  rounded-2xl px-4 py-2 text-blue-950 font-cal text-3xl border-2 border-blue-400 animate-fade-up" style={{ animationDelay: '0.75s', opacity: 0 }}>
              Become like him.
            </div>
            <img src="https://64.media.tumblr.com/254de45f7943add4eeb144e820538b22/902670c41956764e-7c/s1280x1920/1996446d3820955b1bdce4a172c1a9dc27b2ebd9.pnj" className="w-3xl" />
          </div>
        </div>

        <div className={`flex flex-col items-center gap-1 -mt-16 pb-16 transition-opacity duration-500 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <span className="text-blue-300 text-sm tracking-wide">Scroll for more</span>
          <span className="text-blue-300 text-xl animate-bounce">↓</span>
        </div>

        {/* How it works */}
        <FadeInSection className="px-16 py-24 border-t border-white/10">
          <h2 className="text-4xl font-cal text-white mb-2">How it works.</h2>
          <p className="text-blue-300 mb-16 text-lg">It's that easy.</p>
          <div className="flex items-center gap-6">
            {[
              { step: '01', title: 'Make an Account', desc: 'Sign up quick, no credit card required' },
              { step: '02', title: 'Create Decks', desc: 'Build flashcard decks around any topic you want to master.' },
              { step: '03', title: 'Study', desc: 'Flip through cards at your own pace and lock in what you know.' },
            ].map(({ step, title, desc }, i, arr) => (
              <div key={step} className="flex items-center gap-6 flex-1">
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-8 border border-white/10">
                  <span className="text-blue-400 text-sm font-semibold tracking-widest">{step}</span>
                  <h3 className="text-xl font-semibold text-white mt-2 mb-2">{title}</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
                </div>
                {i < arr.length - 1 && <span className="text-3xl text-blue-400 shrink-0">→</span>}
              </div>
            ))}
          </div>
        </FadeInSection>

        {/* Quiz feature */}
        <FadeInSection className="px-16 py-24 border-t border-white/10 flex items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-cal text-white mb-4">Quiz yourself.</h2>
            <p className="text-blue-200 text-lg leading-relaxed max-w-md">Generate multiple choice questions directly from your deck. axon turns your flashcards into a real quiz so you can test your knowledge.</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-8 border border-white/10 flex flex-col gap-4">
            <p className="text-white font-semibold">What is the powerhouse of the cell?</p>
            {['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'].map((opt, i) => (
              <div key={opt} className={`rounded-lg px-4 py-2.5 text-sm border cursor-pointer transition ${i === 1 ? 'bg-blue-500/30 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-blue-200 hover:bg-white/10'}`}>
                {opt}
              </div>
            ))}
          </div>
        </FadeInSection>

        {/* AI feature */}
        <FadeInSection className="px-16 py-24 border-t border-white/10 flex items-center gap-16">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-8 border border-white/10 flex flex-col gap-4">
            <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase">Your notes</p>
            <div className="flex flex-col gap-2">
              {[
                'Chapter 4: The Cell Cycle and Mitosis',
                'Interphase — cell grows and duplicates DNA',
                'Prophase — chromatin condenses into chromosomes',
                'Metaphase — chromosomes align at the cell plate',
                'Anaphase — sister chromatids pulled to opposite poles',
              ].map((line, i) => (
                <div key={i} className={`rounded-lg px-4 py-2 text-sm border bg-white/5 border-white/10 text-blue-200 ${i === 0 ? 'font-semibold text-white' : ''}`}>
                  {line}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-blue-400 text-xs tracking-widest">→ 20 flashcards generated</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </div>
          <div className="flex-1">
            <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">AI-Powered</span>
            <h2 className="text-4xl font-cal text-white mt-2 mb-4">Turn your notes into flashcards.</h2>
            <p className="text-blue-200 text-lg leading-relaxed max-w-md">Upload a PDF, DOCX, or TXT file and let axon do the work. Our AI reads your notes and generates a full deck of flashcards with terms, questions, fill-in-the-blanks, or a mix of all three.</p>
          </div>
        </FadeInSection>

        {/* CTA section */}
        <FadeInSection className="px-16 py-24 border-t border-white/10 flex flex-col items-center text-center gap-6">
          <h2 className="text-5xl font-cal text-white">Ready to start?</h2>
          <p className="text-blue-300 text-lg max-w-md">Join axon and start building decks that actually stick.</p>
          <button
            className="px-12 py-3 bg-white text-blue-950 font-semibold rounded-full hover:bg-blue-100 transition-all duration-200 cursor-pointer text-lg"
            onClick={() => navigate('/register')}
          >
            Get started for free →
          </button>
        </FadeInSection>

      </div>
    </>
  );
}
