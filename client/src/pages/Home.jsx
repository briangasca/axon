import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
    <Navbar />
      <div className="bg-page dark:bg-gray-800 w-screen min-h-screen">
        
        <div className='flex items-center justify-between px-16 py-24'>
          <div className="flex flex-col gap-6">
            <h1 className="text-blue-950 text-8xl font-cal">
              <span className="block animate-fade-up" style={{ animationDelay: '0s', opacity: 0 }}>Simple,</span>
              <span className="block animate-fade-up" style={{ animationDelay: '0.15s', opacity: 0 }}>Lightweight,</span>
              <span className="block animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>Flashcard Studying.</span>
            </h1>
            <button
              className="animate-fade-up w-fit px-8 py-3 bg-blue-950 text-white font-semibold rounded-full hover:bg-blue-800 transition-all duration-200 cursor-pointer"
              style={{ animationDelay: '0.45s', opacity: 0 }}
              onClick={() => navigate('/register')}
            >
              Register now →
            </button>
          </div>

          <div className="relative animate-fade-up flex items-center">
            <span className="absolute top-16 text-9xl rotate-45 animate-bounce-x">→</span>
            <div className="absolute -top-8 -left-24 bg-white rounded-2xl px-4 py-2 text-blue-950 font-cal text-2xl">
              Become like him.
            </div>
            <img src="https://64.media.tumblr.com/254de45f7943add4eeb144e820538b22/902670c41956764e-7c/s1280x1920/1996446d3820955b1bdce4a172c1a9dc27b2ebd9.pnj" className="w-2xl" />
          </div>
        </div>
        
      </div>
    </>
  );
}