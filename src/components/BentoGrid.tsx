import React from 'react';
import { useTheme } from '../context';

const BentoGrid: React.FC = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className="flex flex-col gap-10">
            {/* Featured Pillar: The Founding Vision - REDUCED WIDTH */}
            <div
                className={`reveal ml-6 md:ml-12 lg:ml-20 p-12 md:p-16 border rounded-sm flex flex-col justify-between group transition-all duration-500 max-w-2xl
  ${isDarkMode
                        ? "bg-zinc-950 border-zinc-800 hover:border-accent-cyan shadow-2xl"
                        : "bg-white border-zinc-200 shadow-xl hover:border-black"
                    }`}
            >
                <div>
                    <h3
                        className={`text-4xl md:text-5xl lg:text-5xl font-black font-syne leading-[0.85] tracking-tighter uppercase mb-10 ${isDarkMode ? "text-white" : "text-black"
                            }`}
                    >
                        Master <br />
                        <span
                            className={`text-outline ${isDarkMode ? "text-rose-500" : "text-rose-500"
                                }`}
                        >
                            The
                        </span>{" "}
                        <br /> Core.
                    </h3>

                    <p
                        className={`max-w-xl text-lg md:text-xl font-black leading-relaxed ${isDarkMode ? "text-zinc-100" : "text-zinc-800"
                            }`}
                    >
                        "Engineering is not about knowing the answers. It's about knowing how to
                        find them." We don't teach recipes; we teach the chemistry of the stack.
                    </p>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Card 2: Immersion */}
                <div className={`reveal p-12 border rounded-sm flex flex-col justify-between group transition-all duration-500 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 hover:border-accent-fuchsia shadow-lg' : 'bg-white border-zinc-200 shadow-xl hover:border-black'}`}>
                    <div className="w-16 h-16 border-2 flex items-center justify-center mb-10 border-accent-fuchsia text-accent-fuchsia group-hover:bg-accent-fuchsia group-hover:text-white transition-all">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
                        </svg>
                    </div>
                    <h4 className={`text-4xl font-black font-syne uppercase tracking-tighter leading-none  mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        Absolute <br /> Control.
                    </h4>
                    <p className={`text-base font-black ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        No abstractions allowed. You master the iron, the kernel, and the cloud from the root up.
                    </p>
                </div>

                {/* Card 3: Founding Incentive */}
                <div className={`reveal p-12 border rounded-sm flex flex-col justify-between group transition-all duration-500 ${isDarkMode ? 'bg-accent-fuchsia text-white border-accent-fuchsia shadow-lg' : 'bg-black text-white border-black shadow-2xl'}`}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-12 font-black opacity-90">Founding Cohort // Limited</div>
                    <h4 className="text-5xl font-black font-syne uppercase tracking-tighter leading-[0.85]  mb-8">
                        START <br /> YOUR <br /> ENGINE.
                    </h4>
                    <p className="text-sm font-black uppercase tracking-widest leading-relaxed opacity-90 ">The first 100 scholars <br /> are not just students; <br /> they are partners.</p>
                </div>
            </div>
        </div>
    );
};

export default BentoGrid;