
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Bootcamp', path: '/bootcamp' },
    { name: 'Contact', path: '/callback' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] p-6 pointer-events-none">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between relative">

        {/* Left Segment: Branding (Moved to flow to prevent interruption) */}
        <Link
          to="/"
          className={`flex items-center gap-3 pointer-events-auto group transition-all duration-500 ${isScrolled ? 'scale-90' : 'scale-100'
            }`}
        >
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white shadow-xl shadow-black/20'
            }`}>
            <span className="font-syne font-black text-2xl">W</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-syne font-black text-xl tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              WorknAI
            </span>
            <span className={`text-[8px] font-bold uppercase tracking-[0.3em] opacity-40 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              Technologies
            </span>
          </div>
        </Link>

        {/* Center Segment: Navigation Links */}
        <div className={`hidden lg:flex items-center gap-1 p-1 rounded-full border liquid-glass pointer-events-auto transition-all duration-500 shadow-xl ${isDarkMode
            ? 'bg-zinc-900/80 border-white/10 shadow-black/40'
            : 'bg-white/90 border-zinc-200 shadow-zinc-200/50'
          } ${isScrolled ? 'scale-95' : 'scale-100'}`}>
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${active
                    ? (isDarkMode ? 'text-white' : 'text-zinc-900')
                    : 'text-zinc-500 hover:text-zinc-400'
                  }`}
              >
                <span className="relative z-10">{link.name}</span>
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'
                      }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Segment: Utility & Actions */}
        <div className={`flex items-center gap-3 pointer-events-auto transition-all duration-500 ${isScrolled ? 'scale-95' : 'scale-100'
          }`}>
          <button
            onClick={toggleTheme}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all border ${isDarkMode
                ? 'border-white/10 text-white hover:bg-white/5'
                : 'border-zinc-200 text-zinc-900 hover:bg-zinc-100 shadow-sm'
              }`}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          <Link
            to="/signin"
            className={`px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${isDarkMode
                ? 'bg-white text-black hover:bg-zinc-200 shadow-xl shadow-black/20'
                : 'bg-black text-white hover:bg-zinc-800 shadow-xl shadow-black/20'
              }`}
          >
            Login
          </Link>

          {/* Mobile Menu Icon (Simple version) */}
          <button className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-xl border ${isDarkMode ? 'border-white/10 text-white' : 'border-zinc-200 text-black shadow-sm'
            }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </div>

      {/* Scroll Background Line */}
      <div className={`absolute top-1/2 left-0 w-full h-[1px] -z-10 transition-opacity duration-700 ${isScrolled ? 'opacity-10' : 'opacity-0'} ${isDarkMode ? 'bg-white' : 'bg-black'}`} />
    </nav>
  );
};

export default Navbar;
