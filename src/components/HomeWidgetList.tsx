import React, { useState } from 'react';
import { 
  Sparkles, Compass, Droplet, Activity, BookOpen, Moon, 
  TrendingUp, Target, Plus, Heart, ArrowUpRight, ArrowDownRight,
  ChevronRight, Calendar, AlertCircle, Globe, Users, Clock, Zap, Radio, Eye, Download, Info
} from 'lucide-react';
import { LifeOSState, Transaction, Habit, MoodType } from '../types';

interface HomeWidgetListProps {
  state: LifeOSState;
  setState: React.Dispatch<React.SetStateAction<LifeOSState>>;
  setView: (view: 'home' | 'finance' | 'habits' | 'diary' | 'profile') => void;
}

export default function HomeWidgetList({ state, setState, setView }: HomeWidgetListProps) {
  const [gratitudeInput, setGratitudeInput] = useState('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [insightError, setInsightError] = useState('');

  // 1. Calculations
  const todayStr = '2026-06-01'; // Simulated current date based on metadata

  // Get today's rhythm
  const todayRhythm = state.dailyRhythms?.find(r => r.date === todayStr) || {
    date: todayStr,
    readBook: 'Hábitos Atômicos',
    readPagesCountCount: 15,
    studyArea: 'Finanças' as const,
    thoughtsOnPaper: true,
    workout: true,
    walkDuration: '35',
    stretching: true,
    sleepHours: 8,
    waterMl: 2200,
    naturalFoodScale: 5,
  };

  const sleepHours = todayRhythm.sleepHours ?? 7.7;
  const walkDuration = todayRhythm.walkDuration || '35 minutos';
  const waterMl = todayRhythm.waterMl ?? 2200;
  
  // Total Income vs Expense
  const totalIncomes = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Starting base balance + delta
  const baseSavings = 8450.00;
  const currentSavings = baseSavings + totalIncomes - totalExpenses;
  
  // Monthly savings delta - target R$ 1500
  // Let's assume progress of savings is based on income/expense ratio or directly tracking savings target
  const monthlyGoal = state.profile.savingGoalMonthly;
  const monthlyProgress = Math.min(Math.round((currentSavings / 15000) * 100), 100); 

  // Real-time AI Evolution calculation based on: Hábitos, Sono, Humor, Finanças, Gratidão
  const todayCompletions = state.completions.filter(c => c.date === todayStr);
  const habitsCount = state.habits.length || 1;
  const habitsScore = Math.min((todayCompletions.length / habitsCount) * 100, 100);

  const todayExpenses = state.transactions
    .filter(t => t.date === todayStr && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const financeScore = Math.max(20, Math.min(100, (1 - (todayExpenses / 250)) * 100)); // limit R$ 250

  const todayMood = state.moods.find(m => m.date === todayStr)?.mood;
  let moodScore = 75; // baseline
  if (todayMood === 'happy') moodScore = 100;
  else if (todayMood === 'good') moodScore = 85;
  else if (todayMood === 'neutral') moodScore = 65;
  else if (todayMood === 'sad') moodScore = 40;
  else if (todayMood === 'stressed') moodScore = 30;

  const todayGratitudeCount = state.gratitude.filter(g => g.date === todayStr).length;
  const gratitudeScore = todayGratitudeCount > 0 ? 100 : 40;

  const sleepScore = Math.min(Math.round((sleepHours / 8) * 100), 100);

  const evolutionScore = Math.round((habitsScore + financeScore + moodScore + gratitudeScore + sleepScore) / 5);

  // Recent Mood list
  const moodEmojiMap: Record<MoodType, string> = {
    happy: '😀',
    good: '🙂',
    neutral: '😐',
    sad: '😔',
    stressed: '😫'
  };

  const moodColorMap: Record<MoodType, string> = {
    happy: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    good: 'bg-teal-50 text-teal-600 border-teal-100',
    neutral: 'bg-amber-50 text-amber-600 border-amber-100',
    sad: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    stressed: 'bg-rose-50 text-rose-600 border-rose-100'
  };

  const moodLabelMap: Record<MoodType, string> = {
    happy: 'Excelente',
    good: 'Feliz',
    neutral: 'Normal',
    sad: 'Triste',
    stressed: 'Estressado'
  };

  // Log today's mood
  const handleSelectMood = (selectedMood: MoodType) => {
    const existingLog = state.moods.find(m => m.date === todayStr);
    let updatedMoods = [...state.moods];
    
    if (existingLog) {
      updatedMoods = state.moods.map(m => 
        m.date === todayStr ? { ...m, mood: selectedMood } : m
      );
    } else {
      updatedMoods.unshift({
        id: `mood-${Date.now()}`,
        date: todayStr,
        mood: selectedMood,
        note: 'Registrado via painel rápido'
      });
    }

    setState(prev => ({
      ...prev,
      moods: updatedMoods
    }));
  };

  // Add Gratitude logs
  const handleAddGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitudeInput.trim()) return;

    const newLog = {
      id: `g-${Date.now()}`,
      text: gratitudeInput.trim(),
      date: todayStr
    };

    setState(prev => ({
      ...prev,
      gratitude: [newLog, ...prev.gratitude]
    }));
    setGratitudeInput('');
  };

  // Calculate dynamic streaks and GitHub habit grid colors
  // We will build a matrix representing 35 days (last 5 weeks)
  const getHabitCompletionsCount = (dateStr: string) => {
    return state.completions.filter(c => c.date === dateStr).length;
  };

  // Generate date array for the github style habit grid
  const gridDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date('2026-06-01');
    d.setDate(d.getDate() - (27 - i));
    return d.toISOString().split('T')[0];
  });

  // Calculate comparative progress vs yesterday
  const getPastDateLocal = (daysAgo: number) => {
    const d = new Date(todayStr);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  const todayCompletesCount = state.completions.filter(c => c.date === todayStr).length;
  const yesterdayCompletesCount = state.completions.filter(c => c.date === getPastDateLocal(1)).length;
  let habitDelta = 12; // default fallback matching prompt
  if (yesterdayCompletesCount > 0) {
    habitDelta = Math.round(((todayCompletesCount - yesterdayCompletesCount) / yesterdayCompletesCount) * 100);
  } else if (todayCompletesCount > 0) {
    habitDelta = todayCompletesCount * 12;
  } else {
    habitDelta = -4; // fallback negative if zero today
  }

  // Calculate today's expenses and highest category
  const todayExpensesVal = state.transactions
    .filter(t => t.date === todayStr && t.type === 'expense')
    .reduce((sum, val) => sum + val.amount, 0);

  const todayExpenseTx = state.transactions.filter(t => t.date === todayStr && t.type === 'expense');
  let highestExpensesCategory = 'Alimentação';
  if (todayExpenseTx.length > 0) {
    const categoryTotals: Record<string, number> = {};
    todayExpenseTx.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    let maxNum = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > maxNum) {
        maxNum = amt;
        highestExpensesCategory = cat;
      }
    });
  }

  // Expense grouping for donut chart
  const categories = ['Alimentação', 'Delivery', 'Mercado', 'Transporte', 'Lazer'] as const;
  const expenseSummary = categories.map(cat => {
    const total = state.transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, value: total };
  });

  const totalGroupedExpenses = expenseSummary.reduce((sum, item) => sum + item.value, 0) || 1;

  // Premium interactive color palette for graphs
  const categoryColors: Record<string, string> = {
    Alimentação: '#2DD4BF', // Teal
    Delivery: '#1E3A8A',   // Navy blue anchor
    Mercado: '#38BDF8',    // Light blue
    Transporte: '#FB923C', // Orange
    Lazer: '#F472B6'       // Pink
  };

  // Dynamic Insight Generator
  const triggerAIInsight = async () => {
    setIsGeneratingInsight(true);
    setInsightError('');
    try {
      const response = await fetch('/api/ai/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.profile.name,
          transactions: state.transactions,
          habits: state.habits,
          completions: state.completions,
          moods: state.moods,
          gratitude: state.gratitude,
          goals: state.goals
        })
      });
      const data = await response.json();
      
      const newInsight = {
        id: `in-${Date.now()}`,
        type: 'general' as const,
        text: data.text,
        createdAt: todayStr
      };

      setState(prev => ({
        ...prev,
        insights: [newInsight, ...prev.insights]
      }));
    } catch (err) {
      setInsightError('Falha temporária ao sincronizar inteligências. Tente novamente.');
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar bg-[#0B0C10] text-white">
      
      {/* 📌 HOJE COMPROMISSOS AT THE TOP OF HOME */}
      <div className="bg-[#181920] border border-white/5 p-4.5 rounded-3xl select-none text-left relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-1.5 text-purple-400 mb-2.5">
          <span className="text-sm">📌</span>
          <h3 className="text-xs font-black font-sans uppercase tracking-wider text-white">Hoje</h3>
        </div>
        
        {state.agenda && state.agenda.filter(item => item.date === todayStr).length > 0 ? (
          <div className="space-y-2">
            {[...state.agenda]
              .filter(item => item.date === todayStr)
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 px-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-xs font-bold text-white leading-none">{item.title}</span>
                  <span className="font-mono text-[9px] font-extrabold text-[#A78BFA] bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">{item.time}</span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-[11px] text-gray-500 italic">Nenhum compromisso agendado para hoje.</p>
        )}
      </div>

      {/* INSIGHT DA IA - LOGO ACIMA DO GRID COORDENADO */}
      <div id="ai-insight-top-card" className="bg-[#181920] border border-white/10 p-4 rounded-3xl select-none space-y-2.5 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
            <span>Insight da IA</span>
          </span>
          <span className="text-[8px] bg-purple-500/10 text-purple-400 font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-full border border-purple-500/10">
            Real-time
          </span>
        </div>

        <div className="text-[11.5px] text-gray-200 leading-relaxed italic">
          {state.insights && state.insights.length > 0 ? (
            <p>"{state.insights[0].text}"</p>
          ) : (
            <p>Você dormiu melhor nos dias que caminhou mais de 30 minutos.</p>
          )}
        </div>

        {insightError && (
          <div className="text-[9px] text-rose-400 bg-rose-500/10 p-1.5 rounded-lg border border-rose-500/20">
            {insightError}
          </div>
        )}

        <button
          onClick={triggerAIInsight}
          disabled={isGeneratingInsight}
          type="button"
          className="w-full py-2 bg-[#7C3AED]/80 hover:bg-[#7C3AED] text-white disabled:bg-neutral-800 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1.5 tracking-wide active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 fill-white/10" />
          <span>{isGeneratingInsight ? 'Analisando rituais...' : 'Calibrar Copilot AI'}</span>
        </button>
      </div>

      {/* 2x2 TWITCH STAT ANALYTICS GRID FROM THE PRINT */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* WIDGET 1: GEO (97%) */}
        <div className="bg-[#181920] border border-white/5 p-4 rounded-3xl flex flex-col justify-between min-h-[165px] relative overflow-hidden select-none">
          {/* Subtle World Map Silhouette background exactly like the map in the print */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none scale-105">
            <svg viewBox="0 0 1000 600" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M150,150 Q280,100 380,180 T600,120 T800,220 T950,130 L950,500 Q780,550 600,480 T300,520 T150,450 Z" />
              <circle cx="280" cy="200" r="14" />
              <circle cx="550" cy="300" r="24" />
              <circle cx="780" cy="240" r="18" />
            </svg>
          </div>

          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider font-sans">Geo</span>
            </div>
            
            {/* Round Mini US Flag avatar badge from the mockup */}
            <div className="w-4.5 h-4.5 rounded-full overflow-hidden border border-white/10 flex flex-col shrink-0">
              <div className="h-[40%] bg-blue-700 flex flex-wrap p-0.5 leading-none">
                <div className="text-[3px] text-white">*</div>
              </div>
              <div className="h-[60%] bg-white flex flex-col justify-around">
                <div className="h-[1px] bg-red-600"></div>
                <div className="h-[1px] bg-red-600"></div>
              </div>
            </div>
          </div>

          <div className="my-1.5 relative z-10">
            <h2 className="text-4xl font-black font-display text-white tracking-tight">
              97%
            </h2>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mt-0.5">
              Foco Financeiro
            </p>
          </div>

          <p className="text-[10px] text-gray-400 leading-tight relative z-10 pt-1 border-t border-white/5 font-sans">
            Grande parte do orçamento e da economia está segura no seu índice de metas.
          </p>
        </div>

        {/* WIDGET 2: SUA EVOLUÇÃO (CARD PRINCIPAL) */}
        <div className="bg-[#181920] border border-white/5 p-4 rounded-3xl flex flex-col justify-between min-h-[165px] relative overflow-hidden select-none">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Sua Evolução</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
          </div>

          {/* Curved progress arc representation for the dynamic evolution score */}
          <div className="my-2 flex flex-col items-center justify-center relative">
            {/* Beautiful SVG representation of progress arc */}
            <svg className="w-16 h-12 rotate-180" viewBox="0 0 64 36">
              <path 
                d="M 12 30 A 20 20 0 0 1 52 30" 
                fill="none" 
                stroke="#292A33" 
                strokeWidth="5.5" 
                strokeLinecap="round" 
              />
              <path 
                d="M 12 30 A 20 20 0 0 1 52 30" 
                fill="none" 
                stroke="url(#purpleGradient)" 
                strokeWidth="5.5" 
                strokeLinecap="round" 
                strokeDasharray="125"
                strokeDashoffset={125 * (1 - evolutionScore / 100)} 
              />
              <defs>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-[22px] flex flex-col items-center">
              <span className="text-[17px] font-black text-white font-mono leading-none">{evolutionScore}%</span>
            </div>
          </div>

          <div className="flex flex-col text-left pt-1 border-t border-white/5 font-sans">
            <span className="text-[10px] text-gray-300 font-extrabold">Você está em {evolutionScore}%</span>
            <span className="text-[8px] text-gray-500 font-medium">Auto-calculado pela IA</span>
          </div>
        </div>

        {/* WIDGET 3: CARD SONO */}
        <div className="bg-[#181920] border border-white/5 p-4 rounded-3xl flex flex-col justify-between min-h-[165px] select-none text-left">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Sono</span>
          </div>

          <div className="my-1">
            <h2 
              className="font-black font-display text-white tracking-tight text-[26px] leading-[35px]"
            >
              {Math.floor(sleepHours)}h{Math.round((sleepHours % 1) * 60) > 0 ? `${Math.round((sleepHours % 1) * 60)}min` : ''}
            </h2>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mt-0.5">
              Dormi hoje
            </p>
          </div>

          {/* Dynamic timeline progress tracker */}
          <div className="py-2">
            <div className="h-1.5 w-full bg-[#292A33] rounded-full relative">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${Math.min(Math.round((sleepHours / 8) * 100), 100)}%` }}
              ></div>
              <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] border border-indigo-500"
                style={{ left: `${Math.min(Math.round((sleepHours / 8) * 100), 100)}%` }}
              ></div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 leading-tight">
            Meta: <span className="text-indigo-300 font-bold">8 horas</span> ({Math.min(Math.round((sleepHours / 8) * 100), 100)}%)
          </p>
        </div>

        {/* WIDGET 4: CARD ENERGIA CORPORAL */}
        <div className="bg-[#181920] border border-white/5 p-4 rounded-3xl flex flex-col justify-between min-h-[165px] relative overflow-hidden select-none text-left">
          <div className="flex items-center gap-1.5 text-gray-400 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Energia Corporal</span>
          </div>

          <div className="my-0.5 relative z-10 space-y-1">
            <h2 className="text-[16px] font-black font-display text-white tracking-tight leading-snug">
              {todayRhythm.workout ? "Treino Feito! 💪" : "Atividade Ativa"}
            </h2>
            
            {todayRhythm.workout ? (
              <div className="text-[10px] text-gray-300 font-semibold space-y-0.5">
                {todayRhythm.gymWeightTrainingMinutes ? (
                  <p>🏋️ Musculação: <span className="text-[#A78BFA]">{todayRhythm.gymWeightTrainingMinutes} min</span></p>
                ) : null}
                {todayRhythm.gymCardioMinutes ? (
                  <p>🏃 Cardio: <span className="text-[#A78BFA]">{todayRhythm.gymCardioMinutes} min {todayRhythm.gymCardioEquipment ? `(${todayRhythm.gymCardioEquipment})` : ''}</span></p>
                ) : null}
                {(() => {
                  const weightsMin = todayRhythm.gymWeightTrainingMinutes || 0;
                  const cardioMin = todayRhythm.gymCardioMinutes || 0;
                  const equip = todayRhythm.gymCardioEquipment || '';
                  
                  const weightsFactor = 6;
                  let cardioFactor = 8;
                  if (equip === 'Esteira' || equip === 'Escada') cardioFactor = 10;
                  else if (equip === 'Remo') cardioFactor = 9;
                  
                  const totalBurned = (weightsMin * weightsFactor) + (cardioMin * cardioFactor);
                  if (totalBurned > 0) {
                    return (
                      <span className="inline-block mt-0.5 py-0.5 px-2 bg-purple-500/15 border border-purple-500/25 text-purple-300 text-[8.5px] font-black rounded-lg">
                        🔥 ~{totalBurned} kcal perdidas
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
            ) : (
              <div className="text-[10px] text-gray-300 font-semibold">
                <p>Caminhada: {walkDuration || "Não registrada"}</p>
                <p className="text-[9px] text-[#A78BFA] font-medium mt-0.5">
                  Alongamento: {todayRhythm.stretching ? "Sim 🧘" : "Não"}
                </p>
              </div>
            )}
          </div>

          {/* Custom smooth graph wave curve with point focus */}
          <div className="h-6 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 140 40">
              {/* Gradient below line */}
              <path 
                d="M 5 35 Q 35 10 70 25 T 135 15 L 135 40 L 5 40 Z" 
                fill="url(#waveGradient)" 
                opacity="0.15" 
              />
              {/* Highlight line */}
              <path 
                d="M 5 35 Q 35 10 70 25 T 135 15" 
                fill="none" 
                stroke="#8B5CF6" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
              {/* Dot focus highlights from mockup */}
              <circle cx="103" cy="18" r="3.5" fill="white" stroke="#8B5CF6" strokeWidth="1.5" />
              <circle cx="68" cy="24" r="2.5" fill="white" />
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#181920" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <p className="text-[9px] text-gray-400 leading-tight pt-1 relative z-10 border-t border-white/5">
            Alimentação limpa: <span className="text-emerald-400 font-black">{todayRhythm.naturalFoodScale}/5</span>
          </p>
        </div>

      </div>

      {/* QUICK ACTIONS ROW: HUMOR & METAS DETECTED */}
      <div className="grid grid-cols-2 gap-4">
        {/* Rapid Mood logger optimized for new Twitch styling */}
        <div className="bg-[#181920] border border-white/5 p-4 rounded-3xl flex flex-col justify-between min-h-[145px]">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Humor Hoje</span>
            <span className="text-[10px] font-bold text-purple-400">Rápido</span>
          </div>
          
          <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-2xl py-2 px-1 my-1.5">
            {(Object.keys(moodEmojiMap) as MoodType[]).map((mood) => {
              const isSelected = state.moods.find(m => m.date === todayStr)?.mood === mood;
              return (
                <button
                  type="button"
                  key={mood}
                  onClick={() => handleSelectMood(mood)}
                  className={`transition-all duration-200 active:scale-125 ${
                    isSelected ? 'text-2xl scale-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'opacity-30 text-base hover:opacity-60'
                  }`}
                  title={moodLabelMap[mood]}
                >
                  {moodEmojiMap[mood]}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between text-[9px] text-[#A78BFA] font-medium">
            <span>Último: {state.moods[0] ? moodLabelMap[state.moods[0].mood] : 'Equilibrado'}</span>
            <span>Estável</span>
          </div>
        </div>

        {/* Dynamic Habit complete status check tracker */}
        <div 
          onClick={() => setView('habits')}
          className="bg-[#181920] border border-white/5 p-4 rounded-3xl flex flex-col justify-between min-h-[145px] cursor-pointer hover:bg-neutral-800 transition-all"
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Consistência</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
          </div>

          <div className="grid grid-cols-4 gap-1.5 px-0.5 my-1">
            {gridDays.slice(-8).map((dateStr) => {
              const count = getHabitCompletionsCount(dateStr);
              // Starts translucent white, turns premium purple when completed
              const fillAndShadow = count > 0 
                ? 'bg-[#7C3AED] shadow-[0_0_12px_rgba(124,58,237,0.5)] text-white border border-[#A78BFA]/30' 
                : 'bg-white/5 border border-white/5 text-gray-500';
              
              return (
                <div
                  key={dateStr}
                  className={`w-full aspect-square rounded-md flex items-center justify-center text-[8px] font-black ${fillAndShadow} transition-all`}
                  title={`${dateStr}: ${count} rituais`}
                >
                  {count > 0 ? '✓' : ''}
                </div>
              );
            })}
          </div>

          <p className="text-[9px] text-center text-gray-400">
            Dias consecutivos: <span className="text-[#A78BFA] font-bold">6 dias seguidos 🔥</span>
          </p>
        </div>
      </div>

      {/* CARD DE EVOLUÇÃO DE PESO CORPORAL DIÁRIO */}
      {(() => {
        const todayWeight = todayRhythm.bodyWeight;
        const otherWeights = (state.dailyRhythms || [])
          .filter(r => r.date !== todayStr && r.bodyWeight !== undefined && r.bodyWeight > 0)
          .sort((a, b) => b.date.localeCompare(a.date)); // sorted from newest to oldest
        
        const previousWeight = otherWeights[0]?.bodyWeight;

        if (todayWeight && todayWeight > 0) {
          const hasPastData = previousWeight !== undefined && previousWeight > 0;
          const diff = hasPastData ? todayWeight - previousWeight : 0;
          const diffAbs = Math.abs(diff).toFixed(2);
          const hasChanged = diff !== 0;

          return (
            <div className="bg-[#181920] border border-white/5 p-4.5 rounded-3xl select-none text-left relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <span className="text-sm">⚖️</span>
                  <h3 className="text-xs font-black font-sans uppercase tracking-wider text-white">Evolução de Peso</h3>
                </div>
                {hasPastData ? (
                  <span className="text-[8.5px] bg-white/5 text-purple-300 font-extrabold uppercase px-2 py-0.5 rounded-full border border-purple-500/10">
                    Último: {previousWeight} kg
                  </span>
                ) : (
                  <span className="text-[8.5px] bg-white/5 text-gray-500 font-extrabold uppercase px-2 py-0.5 rounded-full border border-white/5">
                    Histórico inicial
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2.5">
                <span className="text-[26px] font-black font-display text-white tracking-tight leading-none">
                  {todayWeight.toFixed(2)} <span className="text-xs text-gray-400 font-medium font-sans">kg</span>
                </span>
                {hasPastData && hasChanged && (
                  <div className={`flex items-center gap-1 py-1 px-2.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider ${
                    diff < 0 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {diff < 0 ? (
                      <>
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        <span>Emagreceu -{diffAbs} kg</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Engordou +{diffAbs} kg</span>
                      </>
                    )}
                  </div>
                )}
                {hasPastData && !hasChanged && (
                  <span className="text-[10px] font-extrabold text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg">
                    PESO ESTÁVEL ⚖️
                  </span>
                )}
              </div>

              {hasPastData && (
                <p className="text-[10.5px] mt-2 text-gray-400 leading-relaxed font-sans">
                  {diff < 0 ? (
                    <span>Incrível! Você emagreceu <strong>-{diffAbs} kg</strong> comparado ao último registro. Continue focando em alimentação limpa e persistência! 🥦</span>
                  ) : diff > 0 ? (
                    <span>Registrado aumento de <strong>+{diffAbs} kg</strong>. Pode ser retenção hídrica temporária ou ganho lean. Siga em frente sem desanimar! 💪</span>
                  ) : (
                    <span>Seu peso está exatamente estabilizado comparado ao registro anterior. Lembre-se, consistência gera resultados! 🎯</span>
                  )}
                </p>
              )}
              
              {!hasPastData && (
                <p className="text-[10.5px] mt-2 text-gray-400 leading-relaxed font-sans italic">
                  Defina o seu peso diário na aba de Ritmos Diários ("Mente & Corpo"). A partir do segundo dia, este painel calculará automaticamente as variações de emagrecimento ou ganho!
                </p>
              )}
            </div>
          );
        }
        return null;
      })()}

      {/* SEGMENT 2: COMPARADO A ONTEM TITLE HEADER + 3 STATS COLS */}
      <div className="pt-2 select-none text-left">
        <h3 className="text-sm font-bold tracking-wide text-white uppercase mb-2.5 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-[#7C3AED]" />
          <span>Comparado a ontem</span>
        </h3>

        {/* Three column stat metric row exactly matching the statistics values of the print */}
        <div className="grid grid-cols-3 gap-3">
          
          {/* STAT 1: CARD COMPARAÇÃO (Calculado automaticamente) */}
          <div className="bg-[#181920] border border-white/5 p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3 text-[#A78BFA] fill-[#A78BFA]/20" />
              <span>Hábitos</span>
            </div>
            <div className="mt-1.5">
              <span className={`text-[19px] font-black font-sans block leading-none ${habitDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {habitDelta >= 0 ? '+' : ''}{habitDelta}%
              </span>
              <span className={`text-[9px] font-bold flex items-center gap-0.5 mt-1 leading-none ${habitDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {habitDelta >= 0 ? '▲' : '▼'} {Math.abs(habitDelta)}%
              </span>
            </div>
          </div>

          {/* STAT 2: AUXILIARY SAVINGS SCORE */}
          <div className="bg-[#181920] border border-white/5 p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              <Radio className="w-3 h-3 text-cyan-400" />
              <span className="truncate">Meta</span>
            </div>
            <div className="mt-1.5">
              <span className="text-[19px] font-black font-sans text-white block leading-none">
                +4%
              </span>
              <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1 leading-none">
                ▲ Saudável
              </span>
            </div>
          </div>

          {/* STAT 3: CARD GASTOS HOJE (Substituindo Visualizações) */}
          <div className="bg-[#181920] border border-white/5 p-3 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              <Eye className="w-3 h-3 text-pink-400" />
              <span className="truncate">Gastos</span>
            </div>
            <div className="mt-1.5">
              <span className="text-[10px] text-gray-400 block font-semibold leading-none scale-[0.9] origin-left truncate">
                R$ {todayExpensesVal.toFixed(2)}
              </span>
              <span className="text-[8px] text-pink-400 font-extrabold block mt-1 truncate">
                {highestExpensesCategory}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* GRATITUDE LOG WRITER */}
      <div className="bg-[#181920] border border-white/5 p-4 rounded-3xl space-y-3 text-left">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gratidão</p>
        <form onSubmit={handleAddGratitude} className="space-y-2">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <textarea
              value={gratitudeInput}
              onChange={(e) => setGratitudeInput(e.target.value)}
              placeholder="Pelo que você é grato(a) hoje?"
              rows={2}
              className="w-full text-xs text-white bg-transparent focus:outline-none resize-none border-none p-0 placeholder-gray-500"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9.5px] text-gray-400 italic">Promove relaxamento mental</span>
            <button
              type="submit"
              disabled={!gratitudeInput.trim()}
              className="py-1 px-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-white/10 disabled:text-gray-500 text-white rounded-xl text-[10.5px] font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Gravar</span>
            </button>
          </div>
        </form>

        {state.gratitude.length > 0 && (
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
            <p className="text-[9px] text-[#A78BFA] uppercase font-bold tracking-wider mb-0.5">Última de hoje:</p>
            <p className="text-xs text-gray-300 italic">"{state.gratitude[0].text}"</p>
          </div>
        )}
      </div>

      {/* SEGMENT 3: DOWNLOAD INSIGHT REPORT / AI INTEGRATION BANNER */}
      <div className="bg-gradient-to-tr from-[#1E1233] to-[#0D081F] p-4.5 rounded-[2rem] border border-white/10 relative overflow-hidden select-none space-y-3">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#7C3AED]/10 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3.5">
          {/* File paper layout visual exactly like in the mockup */}
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div className="flex-1">
            <h4 className="text-xs font-bold text-white tracking-wide">Relatório de Insights</h4>
            <p className="text-[10px] text-gray-400 leading-snug mt-0.5">
              Baixe e compartilhe seu relatório de evolução com parceiros ou anunciantes.
            </p>
          </div>

          {/* Purple circle Action Down Arrow inside report banner */}
          <button 
            type="button"
            onClick={() => {
              alert("Exportando relatório completo de evolução em formato .CSV!");
            }}
            className="w-8.5 h-8.5 rounded-full bg-[#7C3AED]/20 border border-purple-500/30 text-purple-300 flex items-center justify-center hover:bg-[#7C3AED] hover:text-white transition-all shadow-sm shrink-0"
            title="Download CSV Report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
