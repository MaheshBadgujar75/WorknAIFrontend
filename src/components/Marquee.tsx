
import React from 'react';
import { useTheme } from '../context';

const Marquee: React.FC = () => {
  const { isDarkMode } = useTheme();
  const techs = [
    "MERN Stack", "AI&ML", "Python", "Java FullStack", "UI/UX Design",
    ".NET Core", "Soft Skills","Java", "SQL",
  ];

  const rgbAccents = isDarkMode
    ? ["bg-fuchsia-500", "bg-cyan-400", "bg-blue-500"]
    : ["bg-rose-500", "bg-emerald-500", "bg-blue-500"];

  return (
    <div className={`py-12 bg-black text-white overflow-hidden select-none border-y relative z-20 transition-colors ${isDarkMode ? 'border-zinc-800' : 'border-white/5'}`}>
      <div className="marquee-container">
        <div className="marquee-content flex gap-12 md:gap-20 text-3xl md:text-7xl font-black font-syne items-center">
          {techs.concat(techs).map((tech, i) => (
            <React.Fragment key={i}>
              <span className={`flex items-center gap-8 group transition-colors cursor-default ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-blue-500'}`}>
                {tech}
                <div className={`w-4 h-4 md:w-6 md:h-6 ${rgbAccents[i % 3]} rotate-45 shadow-[0_0_15px_rgba(255,255,255,0.2)]`}></div>
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
