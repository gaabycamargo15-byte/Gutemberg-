import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
}

export default function PhoneContainer({ children }: PhoneContainerProps) {
  // Simple state to emulate current time in top status bar
  const [currentTime, setCurrentTime] = React.useState('09:41');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080B] flex items-center justify-center p-0 md:p-6 overflow-hidden relative font-sans text-white">
      {/* Outer Scene Decor matching "Sleek Interface" */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-[#7C3AED] rounded-full blur-[140px] opacity-15 pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-[#162a45] rounded-full blur-[140px] opacity-10 pointer-events-none"></div>

      {/* Mobile Device Mockup */}
      <div 
        id="phone_frame"
        className="relative w-full h-screen md:w-[375px] md:h-[720px] bg-[#0B0C10] md:rounded-[50px] shadow-[0_45px_120px_-20px_rgba(0,0,0,0.8)] md:border-[12px] md:border-[#1E1F24] flex flex-col overflow-hidden transition-all duration-300"
      >
        {/* Status Bar Mockup */}
        <div className="h-11 bg-[#0B0C10] flex items-center justify-between px-8 pt-4 pb-2 text-[12px] font-bold text-white select-none shrink-0 relative z-10">
          <span>{currentTime}</span>
          
          {/* iPhone Notch Decor */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1E1F24] rounded-b-2xl"></div>

          {/* Icons: Signal, Wifi, Battery */}
          <div className="flex items-center gap-1.5 text-white scale-95 origin-right">
            <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
            <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
            <div className="w-5 h-2.5 border border-white rounded-sm flex items-center p-0.5 ml-0.5">
              <div className="h-full w-full bg-white rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {/* Dynamic App Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-[#0B0C10]">
          {children}
        </div>

        {/* Bottom Interactive gesture line Indicator (Home Bar) */}
        <div className="h-4 bg-[#0B0C10] flex items-center justify-center shrink-0 border-t border-white/5 select-none relative z-10 pb-1">
          <div className="w-28 h-[4px] bg-white/20 rounded-full"></div>
        </div>
      </div>

      {/* Side Floating "Wrapped" Preview Card for 1024x768 Balance in desktop size */}
      <div className="ml-12 lg:ml-16 hidden lg:flex flex-col gap-6 w-64 select-none">
        {/* Side card 1: Month review snippet */}
        <div className="bg-[#181920] p-6 rounded-[32px] shadow-2xl border border-white/5 rotate-2 transition-transform hover:rotate-0 duration-300">
          <div className="w-8 h-8 bg-[#7C3AED] rounded-full mb-4 flex items-center justify-center">
            <span className="text-white text-xs font-bold leading-none">★</span>
          </div>
          <h3 className="text-base font-bold leading-tight text-white font-display">Seu Mês em<br/>Revisão</h3>
          <p className="text-[10px] text-purple-400 mt-2 tracking-wide uppercase font-bold">Storytelling Visual</p>
          
          <div className="mt-4 space-y-2">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-400">
              <span>ECONOMIA</span>
              <span className="text-purple-400 font-mono">+12%</span>
            </div>
          </div>
        </div>

        {/* Side card 2: Year review snippet */}
        <div className="bg-[#111218] p-6 rounded-[32px] shadow-2xl border border-white/5 text-white -rotate-1 translate-x-4 transition-transform hover:rotate-0 duration-300">
          <p className="text-[9px] uppercase tracking-widest font-bold text-purple-400 mb-2">Destaque Anual</p>
          <h3 className="text-lg font-bold font-display leading-snug">Sua Jornada de 2026</h3>
          <p className="text-[11px] mt-3 text-gray-400 leading-relaxed italic">
            Destaques marcantes registrados com gratidão e foco no bem-estar.
          </p>
        </div>
      </div>
    </div>
  );
}
