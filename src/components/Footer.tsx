
import React from 'react';
import { useTheme } from '../context';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <footer className={`relative overflow-hidden pt-20 pb-10 px-6 md:px-12 border-t transition-colors ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-zinc-100'}`}>
      {/* RGB Background Glows */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isDarkMode ? 'from-cyan-400 via-blue-500 to-fuchsia-500' : 'from-rose-500 via-emerald-500 to-blue-500'} opacity-50`}></div>
      <div className={`absolute -bottom-20 -left-20 w-80 h-80 blur-[120px] rounded-full opacity-10 pointer-events-none ${isDarkMode ? 'bg-cyan-500' : 'bg-rose-500'}`}></div>
      <div className={`absolute -bottom-20 -right-20 w-80 h-80 blur-[120px] rounded-full opacity-10 pointer-events-none ${isDarkMode ? 'bg-fuchsia-500' : 'bg-blue-500'}`}></div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Logo & About */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-zinc-900/10 dark:bg-zinc-100/10 p-2">
                <img 
                  src="/logo.png" 
                  alt="WorknAI Official Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className={`font-syne font-black text-4xl tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>WorknAI</span>
            </Link>
            <p className="text-xl text-zinc-500 leading-relaxed font-medium">
              Empowering technical literacy through verified mentorship and industry-aligned curricula.
            </p>
            <div className="flex gap-4">
              {['twitter', 'linkedin', 'github', 'youtube'].map((social) => (
                <a key={social} href={`#${social}`} className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all hover:scale-110 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800 hover:border-cyan-400 shadow-cyan-950/20' : 'bg-zinc-50 border-zinc-100 hover:border-black shadow-black/5'}`}>
                  <span className="sr-only">{social}</span>
                  <div className={`w-5 h-5 ${isDarkMode ? 'bg-white' : 'bg-black'} opacity-80`} style={{ maskImage: `url(https://simpleicons.org/icons/${social}.svg)`, maskSize: 'contain', WebkitMaskImage: `url(https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${social}.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat' }}></div>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">Specializations</h4>
              <ul className={`space-y-4 font-bold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                <li><Link to="/courses" className={`transition-colors ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-500'}`}>MERN Ecosystem</Link></li>
                <li><Link to="/courses" className={`transition-colors ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-emerald-500'}`}>Pythonic Logic</Link></li>
                <li><Link to="/courses" className={`transition-colors ${isDarkMode ? 'hover:text-fuchsia-500' : 'hover:text-rose-500'}`}>Design Systems</Link></li>
                <li><Link to="/courses" className={`transition-colors ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-500'}`}>Java Architecture</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">Academy</h4>
              <ul className={`space-y-4 font-bold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                <li><Link to="/bootcamp" className={`transition-colors ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-500'}`}>Intensive Bootcamps</Link></li>
                <li><Link to="/callback" className={`transition-colors ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-500'}`}>Career Counselling</Link></li>
                <li><Link to="/signin" className={`transition-colors ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-500'}`}>LMS Login</Link></li>
                <li><Link to="/" className={`transition-colors ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-500'}`}>Alumni Network</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">Academic Insights</h4>
              <div className="flex flex-col gap-4">
                <input 
                  type="email" 
                  placeholder="Student email" 
                  className={`w-full p-4 rounded-xl border outline-none transition-all ${isDarkMode ? 'bg-zinc-900 border-zinc-800 focus:border-cyan-500 text-white' : 'bg-zinc-50 border-zinc-100 focus:border-black'}`}
                />
                <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${isDarkMode ? 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-900/20' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  Join Newsletter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Big Bottom Text */}
        <div className={`py-10 border-t border-dashed flex flex-col md:flex-row justify-between items-center gap-6 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
            © {new Date().getFullYear()} WorknAI Technologies Pvt Ltd.
          </p>
          <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-zinc-500">
             <a href="#privacy" className={`transition-colors ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-500'}`}>Privacy</a>
             <a href="#terms" className={`transition-colors ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-500'}`}>Terms</a>
             <a href="#cookies" className={`transition-colors ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-500'}`}>Cookies</a>
          </div>
        </div>
        
        {/* Massive Brand Watermark */}
        <div className={`massive-text pointer-events-none select-none text-center font-syne font-black mt-10 transition-colors duration-500 ${isDarkMode ? 'text-white/[0.05]' : 'text-black/[0.07]'}`}>
          WorknAi
        </div>
      </div>
    </footer>
  );
};

export default Footer;
