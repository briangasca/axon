import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
    <Navbar />
      <div className="bg-blue-950 dark:bg-gray-800 w-screen min-h-screen">
        
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
              onClick={() => navigate('/register')}
            >
              Sign Up Now →
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
        
      </div>
    </>
  );
}