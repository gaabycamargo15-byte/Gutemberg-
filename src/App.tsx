import React, { useState, useEffect } from 'react';
import { 
  Home, DollarSign, CheckCircle2, Heart, User, Compass, Sprout, Calendar
} from 'lucide-react';
import PhoneContainer from './components/PhoneContainer';
import HomeWidgetList from './components/HomeWidgetList';
import FinancesScreen from './components/FinancesScreen';
import HabitsScreen from './components/HabitsScreen';
import DiaryScreen from './components/DiaryScreen';
import ProfileScreen from './components/ProfileScreen';
import AgendaScreen from './components/AgendaScreen';
import SpotifyWrapped from './components/SpotifyWrapped';
import YearlyWrapped from './components/YearlyWrapped';
import { initialOSState } from './initialData';
import { LifeOSState } from './types';

export default function App() {
  const [state, setState] = useState<LifeOSState>(() => {
    const saved = localStorage.getItem('life_os_premium_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return initialOSState;
  });

  const [activeView, setActiveView] = useState<'home' | 'finance' | 'habits' | 'diary' | 'profile' | 'agenda'>('home');
  const [isMonthlyWrapped, setIsMonthlyWrapped] = useState(false);
  const [isYearlyWrapped, setIsYearlyWrapped] = useState(false);

  const [activeUserHandle, setActiveUserHandle] = useState<'gabycamargo' | 'thainavonancken'>(() => {
    return (localStorage.getItem('life_os_active_handle') as any) || 'gabycamargo';
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleSwitchUser = (handle: 'gabycamargo' | 'thainavonancken') => {
    setActiveUserHandle(handle);
    localStorage.setItem('life_os_active_handle', handle);
    
    const profiles = {
      gabycamargo: {
        name: "gabycamargo",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
      },
      thainavonancken: {
        name: "thainavonancken",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256"
      }
    };
    
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: profiles[handle].name,
        avatarUrl: profiles[handle].avatarUrl
      }
    }));
  };

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('life_os_premium_state', JSON.stringify(state));
  }, [state]);

  return (
    <PhoneContainer>
      {/* Twitch layout in-app header bar */}
      <div className="bg-[#0B0C10] pt-4 px-5 pb-3 select-none shrink-0 relative z-40 flex flex-col gap-3 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Glowing Twitch style avatar halo */}
            <div className="relative">
              <img 
                src={state.profile.avatarUrl} 
                alt={state.profile.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-[#7C3AED] shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#7C3AED] rounded-full border border-black flex items-center justify-center text-[10px]">
                ⚡
              </div>
            </div>
            
            {/* twitch selector dropdown markup */}
            <div className="relative">
              <div 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1 cursor-pointer hover:opacity-85 select-none py-1"
              >
                <span className="text-sm font-black text-white tracking-tight lowercase">
                  {activeUserHandle}
                </span>
                <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Dropdown overlay & menu */}
              {showUserDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserDropdown(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-48 bg-[#181920] border border-white/10 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.6)] z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={() => {
                        handleSwitchUser('gabycamargo');
                        setShowUserDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-black font-sans flex items-center justify-between transition-colors ${
                        activeUserHandle === 'gabycamargo'
                          ? 'bg-[#7C3AED]/20 text-purple-300'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>gabycamargo</span>
                      {activeUserHandle === 'gabycamargo' && <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>}
                    </button>
                    <button
                      onClick={() => {
                        handleSwitchUser('thainavonancken');
                        setShowUserDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-black font-sans flex items-center justify-between transition-colors ${
                        activeUserHandle === 'thainavonancken'
                          ? 'bg-[#7C3AED]/20 text-purple-300'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>thainavonancken</span>
                      {activeUserHandle === 'thainavonancken' && <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Header items: Calendar Date token & Notification Bell */}
          <div className="flex items-center gap-3">
            {/* Calendar icon with date badge "14" or simulated today day */}
            <div className="relative w-8 h-8 rounded-lg bg-[#181920] border border-white/5 flex flex-col items-center justify-center shadow-sm cursor-pointer hover:bg-neutral-800">
              <span className="text-[7.5px] font-bold text-purple-400 uppercase tracking-tighter leading-none pt-0.5">JUN</span>
              <span className="text-[11px] font-extrabold text-white leading-none pb-0.5">01</span>
            </div>

            {/* Bell icon with dynamic notification light */}
            <div className="w-8 h-8 rounded-lg bg-[#181920] border border-white/5 flex items-center justify-center relative cursor-pointer hover:bg-neutral-800">
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Page viewport contents with Twitch deep background */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#0B0C10] pb-[5.5rem]">
        {activeView === 'home' && (
          <HomeWidgetList 
            state={state} 
            setState={setState} 
            setView={setActiveView} 
          />
        )}
        {activeView === 'finance' && (
          <FinancesScreen 
            state={state} 
            setState={setState} 
          />
        )}
        {activeView === 'habits' && (
          <HabitsScreen 
            state={state} 
            setState={setState} 
          />
        )}
        {activeView === 'diary' && (
          <DiaryScreen 
            state={state} 
            setState={setState} 
          />
        )}
        {activeView === 'agenda' && (
          <AgendaScreen 
            state={state} 
            setState={setState} 
          />
        )}
        {activeView === 'profile' && (
          <ProfileScreen 
            state={state} 
            setState={setState} 
            onLaunchMonthlyWrapped={() => setIsMonthlyWrapped(true)} 
            onLaunchYearlyWrapped={() => setIsYearlyWrapped(true)}
          />
        )}
      </div>

      {/* FLOATING iOS STYLE premium navigation bar: Home, Finanças, Hábitos, Diário, Agenda */}
      <div className="absolute bottom-4 left-4 right-4 h-16 bg-[#181920]/90 backdrop-blur-xl border border-white/10 rounded-[28px] flex items-center justify-around px-2 select-none z-30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* HOME TAB */}
        <button
          onClick={() => setActiveView('home')}
          className="flex flex-col items-center justify-center h-12 transition-all relative text-center flex-1"
        >
          <div className={`w-11 h-8 rounded-xl flex items-center justify-center transition-all ${
            activeView === 'home' 
              ? 'bg-[#7C3AED] shadow-[0_0_12px_rgba(124,58,237,0.5)] text-white scale-105' 
              : 'bg-transparent text-gray-400 hover:text-white'
          }`}>
            <Home className="w-4.5 h-4.5" />
          </div>
          <span className="text-[8px] mt-1 text-gray-400 font-bold">Home</span>
        </button>

        {/* FINANÇAS TAB */}
        <button
          onClick={() => setActiveView('finance')}
          className="flex flex-col items-center justify-center h-12 transition-all relative text-center flex-1"
        >
          <div className={`w-11 h-8 rounded-xl flex items-center justify-center transition-all ${
            activeView === 'finance' 
              ? 'bg-[#7C3AED] shadow-[0_0_12px_rgba(124,58,237,0.5)] text-white scale-105' 
              : 'bg-transparent text-gray-400 hover:text-white'
          }`}>
            <DollarSign className="w-4.5 h-4.5" />
          </div>
          <span className="text-[8px] mt-1 text-gray-400 font-bold">Finanças</span>
        </button>

        {/* HÁBITOS TAB */}
        <button
          onClick={() => setActiveView('habits')}
          className="flex flex-col items-center justify-center h-12 transition-all relative text-center flex-1"
        >
          <div className={`w-11 h-8 rounded-xl flex items-center justify-center transition-all ${
            activeView === 'habits' 
              ? 'bg-[#7C3AED] shadow-[0_0_12px_rgba(124,58,237,0.5)] text-white scale-105' 
              : 'bg-transparent text-gray-400 hover:text-white'
          }`}>
            <CheckCircle2 className="w-4.5 h-4.5" />
          </div>
          <span className="text-[8px] mt-1 text-gray-400 font-bold">Hábitos</span>
        </button>

        {/* DIÁRIO TAB */}
        <button
          onClick={() => setActiveView('diary')}
          className="flex flex-col items-center justify-center h-12 transition-all relative text-center flex-1"
        >
          <div className={`w-11 h-8 rounded-xl flex items-center justify-center transition-all ${
            activeView === 'diary' 
              ? 'bg-[#7C3AED] shadow-[0_0_12px_rgba(124,58,237,0.5)] text-white scale-105' 
              : 'bg-transparent text-gray-400 hover:text-white'
          }`}>
            <Sprout className="w-4.5 h-4.5" />
          </div>
          <span className="text-[8px] mt-1 text-gray-400 font-bold">Diário</span>
        </button>

        {/* AGENDA TAB */}
        <button
          onClick={() => setActiveView('agenda')}
          className="flex flex-col items-center justify-center h-12 transition-all relative text-center flex-1"
        >
          <div className={`w-11 h-8 rounded-xl flex items-center justify-center transition-all ${
            activeView === 'agenda' 
              ? 'bg-[#7C3AED] shadow-[0_0_12px_rgba(124,58,237,0.5)] text-white scale-105' 
              : 'bg-transparent text-gray-400 hover:text-white'
          }`}>
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <span className="text-[8px] mt-1 text-gray-400 font-bold">Agenda</span>
        </button>

      </div>

      {/* FLOATING OVERLAY DECKS FOR THE CINEMATIC WRAPPEDS */}
      {isMonthlyWrapped && (
        <SpotifyWrapped 
          state={state} 
          onClose={() => setIsMonthlyWrapped(false)} 
        />
      )}

      {isYearlyWrapped && (
        <YearlyWrapped 
          state={state} 
          onClose={() => setIsYearlyWrapped(false)} 
        />
      )}

    </PhoneContainer>
  );
}
