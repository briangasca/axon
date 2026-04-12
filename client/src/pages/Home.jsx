import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108, 160, 245, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108, 160, 245, ${p.alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen dark:bg-gray-900 overflow-hidden flex flex-col items-center justify-center">
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo */}
        <div className="mb-2">
          <span
            className="text-7xl font-black tracking-tighter"
            style={{
              color: '#6ca0f5',
              fontFamily: "'Georgia', serif",
              letterSpacing: '-4px',
            }}
          >
            axon
          </span>
        </div>

        <p
          className="text-lg mb-12 tracking-widest uppercase"
          style={{ color: '#6ca0f5', fontFamily: 'monospace', opacity: 0.7 }}
        >
          sogas study app
        </p>

        {user ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-gray-500 text-sm">Welcome back, <span className="font-semibold" style={{ color: '#6ca0f5' }}>{user.username}</span></p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-10 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
              style={{ backgroundColor: '#6ca0f5' }}
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 rounded-full font-semibold border-2 transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{ borderColor: '#6ca0f5', color: '#6ca0f5' }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
              style={{ backgroundColor: '#6ca0f5' }}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}