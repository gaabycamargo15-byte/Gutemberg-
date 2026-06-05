import React, { useState, useEffect } from 'react';
import { 
  Sparkles, X, ChevronRight, ChevronLeft, TrendingUp, 
  Wallet, Trophy, Heart, Smile, Flame, Play, Music, MessageCircle
} from 'lucide-react';
import { LifeOSState, MoodType } from '../types';

interface SpotifyWrappedProps {
  state: LifeOSState;
  onClose: () => void;
}

export default function SpotifyWrapped({ state, onClose }: SpotifyWrappedProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [aiMessage, setAiMessage] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // 1. DYNAMIC CALCULATIONS FOR THE STORY
  // A. Savings total
  const totalIncomes = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const baseSavings = 8450.00;
  const currentSavings = baseSavings + totalIncomes - totalExpenses;

  // B. Highest Expense Category
  const categories = ['Alimentação', 'Delivery', 'Mercado', 'Transporte', 'Lazer'] as const;
  const totals = categories.map(cat => ({
    name: cat,
    total: state.transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  }));
  const sortedExpenses = [...totals].sort((a, b) => b.total - a.total);
  const highestExpense = sortedExpenses[0] || { name: 'Lazer', total: 0 };

  // C. Best Habit
  const habitCompletionsCount = state.habits.map(h => ({
    habit: h,
    count: state.completions.filter(c => c.habitId === h.id).length
  }));
  const sortedHabits = [...habitCompletionsCount].sort((a, b) => b.count - a.count);
  const bestHabit = sortedHabits[0] || { habit: { title: 'Rotinas diárias' }, count: 12 };

  // D. Dominant Mood
  const moodCounts: Record<MoodType, number> = {
    happy: 0, good: 0, neutral: 0, sad: 0, stressed: 0
  };
  state.moods.forEach(m => {
    if (moodCounts[m.mood] !== undefined) {
      moodCounts[m.mood]++;
    }
  });
  const moodList = Object.entries(moodCounts) as [MoodType, number][];
  const sortedMoods = moodList.sort((a, b) => b[1] - a[1]);
  const dominantMood = sortedMoods[0]?.[0] || 'happy';

  const moodEmojiMap: Record<MoodType, string> = {
    happy: '😀', good: '🙂', neutral: '😐', sad: '😔', stressed: '😫'
  };

  const moodLabelMap: Record<MoodType, string> = {
    happy: 'Super Radiante',
    good: 'Estável e Focada',
    neutral: 'Serena e Calma',
    sad: 'Sensível e Reflexiva',
    stressed: 'Desafiada / Produtiva'
  };

  // E. Words/Themes in Gratitude
  const gratitudeThemes = [
    { text: 'Família', icon: '❤️' },
    { text: 'Amizade Luana/Henrique', icon: '👭' },
    { text: 'Trabalho Freelance', icon: '💼' },
    { text: 'Autocuidado', icon: '🧘' }
  ];

  // Fetch AI message on load
  useEffect(() => {
    const fetchAiWrappedMsg = async () => {
      setIsLoadingAi(true);
      try {
        const response = await fetch('/api/ai/wrapped', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: state.profile.name,
            topCategory: highestExpense.name,
            savedAmount: currentSavings.toFixed(0),
            bestHabit: bestHabit.habit.title,
            mainMood: moodLabelMap[dominantMood]
          })
        });
        const data = await response.json();
        setAiMessage(data.message);
      } catch (err) {
        setAiMessage(`${state.profile.name}, este mês foi marcado por um equilíbrio primoroso. Economizar e manter rituais como ${bestHabit.habit.title} provou sua meta de valor pessoal!`);
      } finally {
        setIsLoadingAi(false);
      }
    };

    fetchAiWrappedMsg();
  }, []);

  const totalSlides = 7;

  const next = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const prev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#070913] z-50 text-white flex flex-col p-6 font-sans overflow-hidden animate-in fade-in duration-300">
      
      {/* 1. TOP PROGRESS INDICATORS (Spotify style) */}
      <div className="flex gap-1.5 shrink-0 select-none">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div key={i} className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-blue-400 to-[#1E3A8A] transition-all duration-300 ${
                i <= currentSlide ? 'w-full' : 'w-0'
              }`}
            ></div>
          </div>
        ))}
      </div>

      {/* 2. HEADER CONTAINER WITH CLOSE BUTTON */}
      <div className="flex justify-between items-center mt-4 select-none shrink-0">
        <div className="flex items-center gap-1.5 text-blue-300">
          <Sparkles className="w-4 h-4 fill-blue-300" />
          <span className="text-[10px] font-bold uppercase tracking-widest">O SEU MÊS EM REVISÃO</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 3. DYNAMIC CONTENT CONTAINER (Different vibe, very cinematic) */}
      <div className="flex-1 flex flex-col justify-center my-6 relative min-h-0 select-none">
        
        {/* SLIDE 1: Welcome Intro */}
        {currentSlide === 0 && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-500">
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-[#1E3A8A]/20 rounded-full blur-xl animate-soft-pulse"></div>
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#1E3A8A] to-[#0A0F1D] flex items-center justify-center text-5xl">
                ✨
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold tracking-tight text-white leading-tight">
                Oi, {state.profile.name}.
              </h1>
              <p className="text-sm text-blue-200 px-4 leading-relaxed">
                Preparamos uma retrospectiva de alta fidelidade para você analisar como evoluiu financeiramente e emocionalmente este mês.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-blue-300 bg-white/10 px-3 py-1 rounded-full font-medium">
              <Music className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gaby's Wrapped OS</span>
            </span>
          </div>
        )}

        {/* SLIDE 2: Savings total amount */}
        {currentSlide === 1 && (
          <div className="space-y-6 text-center animate-in slide-in-from-right duration-500">
            <div className="w-20 h-20 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center mx-auto text-3xl shadow-lg">
              <Wallet className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest bg-teal-500/10 px-2.5 py-1 rounded-full">Sua Poupança</span>
              <h2 className="text-5xl font-mono font-bold text-white tracking-tight pt-2">
                R$ {currentSavings.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </h2>
              <p className="text-sm text-gray-300 px-6 leading-relaxed">
                Este é seu montante acumulado consolidado no aplicativo. Você está trilhando o ápice do seu autocontrole financeiro.
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 3: Mayor Gasto */}
        {currentSlide === 2 && (
          <div className="space-y-6 text-center animate-in slide-in-from-right duration-500">
            <div className="w-20 h-20 rounded-2xl bg-[#1E3A8A]/20 text-blue-300 border border-[#1E3A8A]/30 flex items-center justify-center mx-auto text-3xl shadow-lg">
              🍕
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest bg-[#1E3A8A]/10 px-2.5 py-1 rounded-full">O Maior Desafio</span>
              <p className="text-xl font-medium text-blue-200 mt-2">Seu maior centro de custo financeiro foi</p>
              <h2 className="text-4xl font-display font-bold text-rose-400 tracking-tight">
                {highestExpense.name}
              </h2>
              <p className="text-xs text-gray-400 pt-1 font-mono">
                Total registrado acumulado: R$ {highestExpense.total.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 4: Best Habit */}
        {currentSlide === 3 && (
          <div className="space-y-6 text-center animate-in slide-in-from-right duration-500">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/20 text-yellow-400 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl shadow-lg">
              <Flame className="w-10 h-10 fill-yellow-500 text-yellow-500" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest bg-yellow-500/10 px-2.5 py-1 rounded-full">Ritual Sagrado</span>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight mt-3">
                {bestHabit.habit.title}
              </h2>
              <p className="text-sm text-gray-300 px-6 leading-relaxed">
                Você persistiu bravamente neste hábito, batendo seu recorde de regularidade com <span className="font-bold text-yellow-400">{bestHabit.count} conclusões</span> este mês!
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 5: Humor Predominante */}
        {currentSlide === 4 && (
          <div className="space-y-6 text-center animate-in slide-in-from-right duration-500">
            <div className="text-7xl animate-bounce">
              {moodEmojiMap[dominantMood]}
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full">Sintonia Mental</span>
              <p className="text-lg text-blue-200 font-semibold mt-2">Seu estado emocional predominante:</p>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                {moodLabelMap[dominantMood]}
              </h2>
              <p className="text-xs text-gray-400 px-8 leading-relaxed mt-2">
                Consciência gera tranquilidade. Reconhecer as nuances do humor ajuda a mitigar impulsos involuntários de escape financeiro.
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 6: Gratidão - Themes Word Map */}
        {currentSlide === 5 && (
          <div className="space-y-6 text-center animate-in slide-in-from-right duration-500">
            <div className="w-20 h-20 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto text-3xl shadow-lg">
              <Heart className="w-10 h-10 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded-full">Âncoras de Ouro</span>
              <h3 className="text-xl font-bold font-display text-white mt-3">Quem e o que mais fez diferença:</h3>
              
              <div className="flex flex-wrap justify-center gap-2 mt-4 px-4">
                {gratitudeThemes.map((theme, i) => (
                  <span 
                    key={i} 
                    className="px-3.5 py-2 bg-white/5 border border-white/10 rounded-full font-medium text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{theme.icon}</span>
                    <span>{theme.text}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 7: AI Generative custom wrap-up msg */}
        {currentSlide === 6 && (
          <div className="space-y-6 text-center animate-in slide-in-from-right duration-500">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-[#1E3A8A] rounded-full blur opacity-25 animate-soft-pulse"></div>
              <Sparkles className="w-8 h-8 text-blue-300 fill-white/10" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest bg-[#1E3A8A]/20 px-2.5 py-1 rounded-full border border-[#1E3A8A]/30">Carta da IA</span>
              <h3 className="text-xl font-display font-bold text-white leading-tight">Genuíno Conselho do seu Assistente</h3>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl text-sm leading-relaxed text-blue-100 max-w-sm mx-auto text-left font-medium relative">
              {isLoadingAi ? (
                <div className="space-y-2.5 py-4">
                  <div className="h-3 bg-white/10 rounded animate-pulse w-full"></div>
                  <div className="h-3 bg-white/10 rounded animate-pulse w-5/6"></div>
                  <div className="h-3 bg-white/10 rounded animate-pulse w-2/3"></div>
                </div>
              ) : (
                <p>"{aiMessage}"</p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* 4. BOTTOM INTERACTIVE NAVIGATOR BAR */}
      <div className="flex items-center justify-between mt-auto select-none shrink-0 border-t border-white/5 pt-4">
        {currentSlide > 0 ? (
          <button
            onClick={prev}
            className="py-2.5 px-4 bg-white/5 rounded-xl text-xs font-semibold hover:bg-white/10 flex items-center gap-1 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        ) : (
          <div className="w-20"></div> // Placeholder
        )}

        <button
          onClick={next}
          className="py-2.5 px-5 bg-gradient-to-r from-[#1E3A8A] to-[#0A0F1D] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md hover:opacity-90 active:scale-95 transition-all"
        >
          <span>{currentSlide === totalSlides - 1 ? 'Concluir' : 'Próximo'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
