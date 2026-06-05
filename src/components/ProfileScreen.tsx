import React, { useState } from 'react';
import { 
  Sparkles, Award, User, Target, Play, Heart, Flame, Settings, Check, HelpCircle
} from 'lucide-react';
import { LifeOSState } from '../types';

interface ProfileScreenProps {
  state: LifeOSState;
  setState: React.Dispatch<React.SetStateAction<LifeOSState>>;
  onLaunchMonthlyWrapped: () => void;
  onLaunchYearlyWrapped: () => void;
}

export default function ProfileScreen({ 
  state, 
  setState, 
  onLaunchMonthlyWrapped, 
  onLaunchYearlyWrapped 
}: ProfileScreenProps) {
  const [name, setName] = useState(state.profile.name);
  const [monthlyGoal, setMonthlyGoal] = useState(state.profile.savingGoalMonthly.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(monthlyGoal);
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: name.trim() || prev.profile.name,
        savingGoalMonthly: isNaN(value) ? prev.profile.savingGoalMonthly : value
      }
    }));
    setIsEditing(false);
  };

  // Gamified milestones tracking badges centered on dark-glass color scheme
  const badges = [
    { name: 'Mente Inabalável', desc: 'Completou hábito de meditação por 6 dias seguidos', icon: '🧘', color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' },
    { name: 'Guerreira Orçamentária', desc: 'Manteve despesas sob controle absoluto este mês', icon: '💰', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
    { name: 'Imunidade Social', desc: 'Listou gratidão a familiares e amigos em momentos estressantes', icon: '❤️', color: 'bg-rose-500/10 border-rose-500/20 text-rose-400' },
    { name: 'Hidratação Plena', desc: 'Meta de 2L consumidos por 12 dias consecutivos', icon: '💧', color: 'bg-sky-500/10 border-sky-500/20 text-sky-400' }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar bg-[#0B0C10] text-white">
      
      {/* Profile Header card info */}
      <div className="bg-[#181920] p-5 rounded-3xl border border-white/5 shadow-2xl text-center font-sans">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <img 
            src={state.profile.avatarUrl} 
            alt={state.profile.name} 
            className="w-full h-full rounded-full object-cover border-4 border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.3)]"
          />
          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#7C3AED] text-white border border-black shadow-md">
            <Sparkles className="w-3 h-3 fill-white" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold font-display text-white">{state.profile.name}</h2>
        <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide font-semibold">Assinatura Anual Life OS Premium Ativa</p>
        <span className="inline-flex mt-1 text-[9px] bg-purple-500/15 text-purple-300 font-extrabold uppercase tracking-widest py-0.5 px-2.5 rounded-full border border-purple-500/25">Membro Elite</span>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="mt-4 p-4 border border-white/5 rounded-2xl bg-[#0B0C10] text-left space-y-3">
            <div>
              <label className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Seu Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-[#181920] text-xs text-white border border-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Meta de Economia Mensal (R$)</label>
              <input
                type="number"
                value={monthlyGoal}
                onChange={(e) => setMonthlyGoal(e.target.value)}
                className="w-full p-2 bg-[#181920] text-xs text-white border border-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#6D28D9] shadow-md transition-all active:scale-[0.98]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="mt-3 px-4 py-1.5 border border-white/5 bg-[#0B0C10] text-gray-400 hover:text-white hover:border-white/20 text-[11px] font-bold rounded-full items-center justify-center inline-flex gap-1.5 shadow-sm transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Editar perfil</span>
          </button>
        )}
      </div>

      {/* Cinematic Wrapped Launchers */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Retrospectivas Cinematográficas</h3>

        {/* Month wrapped */}
        <div 
          onClick={onLaunchMonthlyWrapped}
          className="bg-gradient-to-tr from-[#1E1233] to-[#0D081F] border border-white/10 p-5 rounded-3xl text-white shadow-2xl relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform select-none group"
        >
          {/* Subtle sparkles background */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none blur-xl"></div>
          <div className="flex justify-between items-center relative z-10 font-sans">
            <div className="space-y-1">
              <span className="text-[9px] text-purple-300 font-bold uppercase tracking-widest block">Spotify Wrapped Feel</span>
              <h4 className="text-lg font-bold font-display group-hover:text-purple-300 transition-colors">Seu Mês em Revisão</h4>
              <p className="text-[12px] text-gray-400 max-w-[220px] leading-relaxed">
                Storytelling dinâmico das suas conquistas, rituais e despesas.
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#7C3AED]/20 border border-purple-500/30 text-[#A78BFA] flex items-center justify-center shadow-md shrink-0 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Year review */}
        <div 
          onClick={onLaunchYearlyWrapped}
          className="bg-gradient-to-r from-[#0F172A] to-[#3B0764] border border-white/10 p-5 rounded-3xl text-white shadow-2xl relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform select-none group"
        >
          {/* Subtle sparkles background */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none blur-xl"></div>
          <div className="flex justify-between items-center relative z-10 font-sans">
            <div className="space-y-1">
              <span className="text-[9px] text-[#A78BFA] font-bold uppercase tracking-widest block">Duolingo recap feel</span>
              <h4 className="text-lg font-bold font-display group-hover:text-purple-300 transition-colors">Sua Jornada do Ano</h4>
              <p className="text-[12px] text-gray-400 max-w-[220px] leading-relaxed">
                Retrospectiva de alta fidelidade das suas maiores superações.
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#7C3AED]/20 border border-purple-500/30 text-[#A78BFA] flex items-center justify-center shadow-md shrink-0 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
              <Play className="w-5 h-5 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Badges and achievements */}
      <div className="space-y-3 pt-1">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Distintivos & Gamificação</h3>
        <div className="grid grid-cols-1 gap-2.5">
          {badges.map((badge, idx) => (
            <div 
              key={idx} 
              className="p-3.5 rounded-3xl border border-white/5 flex items-center gap-3 bg-[#181920] shadow-sm hover:border-purple-500/10 transition-all"
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${badge.color}`}>
                {badge.icon}
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">{badge.name}</h5>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
