import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Flame, Check, BookOpen, Activity, Compass, Droplet, Moon, Award, Brain, Zap, CheckCircle2 
} from 'lucide-react';
import { LifeOSState, DailyRhythm } from '../types';

interface HabitsScreenProps {
  state: LifeOSState;
  setState: React.Dispatch<React.SetStateAction<LifeOSState>>;
}

export default function HabitsScreen({ state, setState }: HabitsScreenProps) {
  const todayStr = '2026-06-01'; // Simulated today's date

  // Get or initialize today's rhythm
  const getTodayRhythm = (): DailyRhythm => {
    const found = state.dailyRhythms?.find(r => r.date === todayStr);
    if (found) return found;

    // Find last recorded body weight for seamless continuation
    const sortedRhythms = [...(state.dailyRhythms || [])].sort((a, b) => b.date.localeCompare(a.date));
    const lastWeight = sortedRhythms.find(r => r.bodyWeight !== undefined && r.bodyWeight > 0)?.bodyWeight || 70.0;

    return {
      date: todayStr,
      readBook: 'Hábitos Atômicos',
      readPagesCountCount: 0,
      studyArea: '',
      thoughtsOnPaper: false,
      workout: false,
      gymWeightTrainingMinutes: 0,
      gymCardioMinutes: 0,
      gymCardioEquipment: '',
      bodyWeight: lastWeight,
      walkDuration: '',
      stretching: false,
      sleepHours: 7,
      waterMl: 1000,
      naturalFoodScale: 3,
    };
  };

  const [rhythm, setRhythm] = useState<DailyRhythm>(getTodayRhythm());
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync state if it changed from parent
  useEffect(() => {
    const found = state.dailyRhythms?.find(r => r.date === todayStr);
    if (found) {
      setRhythm(found);
    }
  }, [state.dailyRhythms]);

  // Handle immediate field changes
  const updateField = <K extends keyof DailyRhythm>(field: K, value: DailyRhythm[K]) => {
    const updated = { ...rhythm, [field]: value };
    setRhythm(updated);
  };

  // Submit and run analysis "nos bastidores"
  const handleSaveRhythms = async () => {
    setIsSyncing(true);
    
    // 1. Update the state
    const currentRhythms = state.dailyRhythms ? [...state.dailyRhythms] : [];
    const index = currentRhythms.findIndex(r => r.date === todayStr);
    
    if (index >= 0) {
      currentRhythms[index] = rhythm;
    } else {
      currentRhythms.push(rhythm);
    }

    // Adapt completions array for compatibility too
    let updatedCompletions = [...state.completions];
    
    // Add completions for workout if checked
    if (rhythm.workout) {
      if (!updatedCompletions.some(c => c.date === todayStr && c.habitId === 'h-3')) {
        updatedCompletions.push({ date: todayStr, habitId: 'h-3' });
      }
    } else {
      updatedCompletions = updatedCompletions.filter(c => !(c.date === todayStr && c.habitId === 'h-3'));
    }

    // Add completions for reading
    if (rhythm.readPagesCountCount > 0) {
      if (!updatedCompletions.some(c => c.date === todayStr && c.habitId === 'h-4')) {
        updatedCompletions.push({ date: todayStr, habitId: 'h-4' });
      }
    } else {
      updatedCompletions = updatedCompletions.filter(c => !(c.date === todayStr && c.habitId === 'h-4'));
    }

    // Water completion
    if (rhythm.waterMl >= 2000) {
      if (!updatedCompletions.some(c => c.date === todayStr && c.habitId === 'h-2')) {
        updatedCompletions.push({ date: todayStr, habitId: 'h-2' });
      }
    } else {
      updatedCompletions = updatedCompletions.filter(c => !(c.date === todayStr && c.habitId === 'h-2'));
    }

    setState(prev => ({
      ...prev,
      dailyRhythms: currentRhythms,
      completions: updatedCompletions
    }));

    // 2. Perform AI background analysis ("Análise nos bastidores" - results appear ONLY in Home)
    try {
      const response = await fetch('/api/ai/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.profile.name,
          transactions: state.transactions,
          habits: state.habits,
          completions: updatedCompletions,
          moods: state.moods,
          gratitude: state.gratitude,
          goals: state.goals,
          dailyRhythms: currentRhythms
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
      console.error('Erro de background insight:', err);
    } finally {
      setIsSyncing(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar bg-[#0B0C10] text-white">
      
      {/* Header Premium */}
      <div className="bg-[#181920] border border-white/5 p-5 rounded-3xl text-white select-none relative overflow-hidden shadow-2xl text-left">
        <div className="absolute right-[-10px] top-[-10px] opacity-[0.05]">
          <Brain className="w-28 h-28 text-white fill-white" />
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 px-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-[9px] font-bold uppercase tracking-widest block">
            Ritmos Diários
          </span>
        </div>
        <h2 className="text-xl font-black font-display text-white tracking-tight">Mente & Corpo</h2>
        <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">
          Sincronize as duas engrenagens de alto desempenho. Toda análise é gerada de forma invisível nos bastidores para recalibrar seu Dashboard.
        </p>
      </div>

      {/* 🧠 SECTION: MENTE */}
      <div className="bg-[#181920] border border-white/5 p-4 rounded-3xl text-left space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
          <span className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Brain className="w-4 h-4 fill-purple-400/15" />
          </span>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 leading-none">🧠 Mente</h3>
            <span className="text-[10px] text-gray-500 font-bold">Foco, leitura e clareza mental</span>
          </div>
        </div>

        {/* 1. Ler 10 a 20 páginas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-gray-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Ler 10 a 20 páginas</span>
            </label>
            <span className="text-[9px] bg-[#7C3AED]/20 text-[#A78BFA] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
              {rhythm.readPagesCountCount >= 10 ? 'Meta atingida!' : 'Em progresso'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-[#0B0C10] p-3 rounded-2xl border border-white/5">
            <div>
              <span className="text-[9px] text-gray-500 font-extrabold uppercase block mb-1">Livro</span>
              <input 
                type="text" 
                value={rhythm.readBook}
                onChange={(e) => updateField('readBook', e.target.value)}
                placeholder="Nome do livro"
                className="w-full bg-transparent text-xs text-white placeholder-gray-600 border border-white/5 focus:border-[#7C3AED]/50 rounded-xl px-2.5 py-1.5 focus:outline-none"
              />
            </div>
            <div>
              <span className="text-[9px] text-gray-500 font-extrabold uppercase block mb-1">Qtd. Páginas</span>
              <input 
                type="number" 
                value={rhythm.readPagesCountCount || ''}
                onChange={(e) => updateField('readPagesCountCount', Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="Ex: 15"
                className="w-full bg-transparent text-xs text-white placeholder-gray-650 border border-white/5 focus:border-[#7C3AED]/50 rounded-xl px-2.5 py-1.5 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Estudar algo útil */}
        <div className="space-y-2 pt-1">
          <label className="text-[11px] font-bold text-gray-200 block">
            Estudar algo útil
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['Finanças', 'Idiomas', 'Tecnologia', 'Comunicação'] as const).map((area) => {
              const isSelected = rhythm.studyArea === area;
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => updateField('studyArea', isSelected ? '' : area)}
                  className={`py-2 px-1 rounded-xl text-[10px] font-black tracking-wide text-center transition-all ${
                    isSelected 
                      ? 'bg-[#7C3AED] text-white scale-[1.03] shadow-md shadow-purple-500/10' 
                      : 'bg-[#0B0C10] text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Colocar pensamentos no papel */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-bold text-gray-200">
            Você colocou seus pensamentos no papel hoje?
          </span>
          <div className="flex bg-[#0B0C10] p-1 rounded-xl border border-white/5 shrink-0 ml-2">
            <button
              type="button"
              onClick={() => updateField('thoughtsOnPaper', true)}
              className={`px-3 py-1 text-[9.5px] font-extrabold rounded-lg transition-all ${
                rhythm.thoughtsOnPaper 
                  ? 'bg-purple-500/20 text-purple-400 font-black' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => updateField('thoughtsOnPaper', false)}
              className={`px-3 py-1 text-[9.5px] font-extrabold rounded-lg transition-all ${
                !rhythm.thoughtsOnPaper 
                  ? 'bg-rose-500/20 text-rose-400 font-solid' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              Não
            </button>
          </div>
        </div>
      </div>

      {/* 💪 SECTION: CORPO */}
      <div className="bg-[#181920] border border-white/5 p-4 rounded-3xl text-left space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
          <span className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Activity className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 leading-none">💪 Corpo</h3>
            <span className="text-[10px] text-gray-500 font-bold">Vitalidade, repouso e nutrição celular</span>
          </div>
        </div>

        {/* 1. Academia ou treino */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-200 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Academia ou treino</span>
          </span>
          <div className="flex bg-[#0B0C10] p-1 rounded-xl border border-white/5 shrink-0 ml-2">
            <button
              type="button"
              onClick={() => updateField('workout', true)}
              className={`px-3 py-1 text-[9.5px] font-extrabold rounded-lg transition-all ${
                rhythm.workout 
                  ? 'bg-purple-500/20 text-purple-400 font-black' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => updateField('workout', false)}
              className={`px-3 py-1 text-[9.5px] font-extrabold rounded-lg transition-all ${
                !rhythm.workout 
                  ? 'bg-rose-500/20 text-rose-400 font-solid' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              Não
            </button>
          </div>
        </div>

        {/* DETAILED GYM SESSION ACCORDION */}
        {rhythm.workout && (
          <div className="bg-[#0B0C10] p-3.5 rounded-2xl border border-purple-500/20 space-y-3.5 mt-2 transition-all">
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">
                🏋️ Prática na Academia
              </span>
              <span className="text-[9px] bg-purple-500/10 text-purple-300 font-mono px-2 py-0.5 rounded-full border border-purple-500/15">
                Cálculo calórico ativo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-gray-400 font-extrabold uppercase block mb-1">
                  ⏱️ Musculação (minutos)
                </label>
                <input 
                  type="number" 
                  value={rhythm.gymWeightTrainingMinutes || 0}
                  onChange={(e) => updateField('gymWeightTrainingMinutes', Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="Ex: 45"
                  className="w-full bg-[#181920] text-xs text-white placeholder-gray-650 border border-white/5 focus:border-[#7C3AED]/50 rounded-xl px-2.5 py-1.5 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] text-gray-400 font-extrabold uppercase block mb-1">
                  🏃 Cardio (minutos)
                </label>
                <input 
                  type="number" 
                  value={rhythm.gymCardioMinutes || 0}
                  onChange={(e) => updateField('gymCardioMinutes', Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="Ex: 20"
                  className="w-full bg-[#181920] text-xs text-white placeholder-gray-650 border border-white/5 focus:border-[#7C3AED]/50 rounded-xl px-2.5 py-1.5 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] text-gray-400 font-extrabold uppercase block">
                🚲 Equipamento de Cardio
              </label>
              <div className="grid grid-cols-5 gap-1">
                {(['Esteira', 'Bicicleta', 'Elíptico', 'Escada', 'Remo'] as const).map((equip) => {
                  const isSelected = rhythm.gymCardioEquipment === equip;
                  return (
                    <button
                      key={equip}
                      type="button"
                      onClick={() => updateField('gymCardioEquipment', isSelected ? '' : equip)}
                      className={`py-1.5 px-0.5 rounded-lg text-[8.5px] font-black tracking-tight text-center transition-all ${
                        isSelected 
                          ? 'bg-[#7C3AED] text-white' 
                          : 'bg-[#181920]/80 text-gray-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {equip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calculated calories preview */}
            {(() => {
              const weightsMin = rhythm.gymWeightTrainingMinutes || 0;
              const cardioMin = rhythm.gymCardioMinutes || 0;
              const equip = rhythm.gymCardioEquipment || '';
              
              const weightsFactor = 6; // ~6 kcal/min for intense weight training
              let cardioFactor = 8; // default
              if (equip === 'Esteira' || equip === 'Escada') cardioFactor = 10;
              else if (equip === 'Remo') cardioFactor = 9;
              else if (equip === 'Bicicleta' || equip === 'Elíptico') cardioFactor = 8;

              const totalBurned = (weightsMin * weightsFactor) + (cardioMin * cardioFactor);
              if (totalBurned > 0) {
                return (
                  <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 p-2.5 rounded-xl flex items-center justify-between text-[11px]">
                    <span className="text-[#A78BFA] font-bold">🔥 Queima Estimada:</span>
                    <span className="text-white font-mono font-black text-xs">
                      ~{totalBurned} kcal perdidas
                    </span>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}

        {/* 2. Caminhada */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-200">Caminhada</span>
            <span className="text-[9px] text-purple-400 font-extrabold">Minutos caminhados</span>
          </div>
          <div className="bg-[#0B0C10] p-2 rounded-2xl border border-white/5 flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-bold">Quanto tempo?</span>
            <input 
              type="text"
              value={rhythm.walkDuration}
              onChange={(e) => updateField('walkDuration', e.target.value)}
              placeholder="Ex: 40 minutos"
              className="flex-1 bg-transparent text-xs text-white placeholder-gray-650 focus:outline-none focus:ring-0 text-right pr-1"
            />
          </div>
        </div>

        {/* 3. Alongamento */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-bold text-gray-200">Alongamento</span>
          <div className="flex bg-[#0B0C10] p-1 rounded-xl border border-white/5 shrink-0 ml-2">
            <button
              type="button"
              onClick={() => updateField('stretching', true)}
              className={`px-3 py-1 text-[9.5px] font-extrabold rounded-lg transition-all ${
                rhythm.stretching 
                  ? 'bg-purple-500/20 text-purple-400 font-black' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => updateField('stretching', false)}
              className={`px-3 py-1 text-[9.5px] font-extrabold rounded-lg transition-all ${
                !rhythm.stretching 
                  ? 'bg-rose-500/20 text-rose-400 font-solid' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              Não
            </button>
          </div>
        </div>

        {/* 4 & 5. Sono e Água */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-[#0B0C10] p-3 rounded-2xl border border-white/5 space-y-1">
            <label className="text-[9px] text-gray-505 font-extrabold uppercase flex items-center gap-1">
              <Moon className="w-3 h-3 text-purple-400" />
              <span>Sono (Horas)</span>
            </label>
            <input 
              type="number"
              step="0.5"
              value={rhythm.sleepHours || ''}
              onChange={(e) => updateField('sleepHours', parseFloat(e.target.value) || 0)}
              placeholder="Ex: 8"
              className="w-full bg-transparent text-xs text-white placeholder-gray-650 focus:outline-none font-mono"
            />
          </div>
          <div className="bg-[#0B0C10] p-3 rounded-2xl border border-white/5 space-y-1">
            <label className="text-[9px] text-gray-550 font-extrabold uppercase flex items-center gap-1">
              <Droplet className="w-3 h-3 text-blue-400" />
              <span>Água (ML)</span>
            </label>
            <input 
              type="number"
              step="100"
              value={rhythm.waterMl || ''}
              onChange={(e) => updateField('waterMl', parseInt(e.target.value) || 0)}
              placeholder="Ex: 2000"
              className="w-full bg-transparent text-xs text-white placeholder-gray-650 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Weight input Section */}
        <div className="bg-[#0B0C10] p-3.5 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-200">⚖️ Peso Corporal</span>
            <span className="text-[9px] text-[#A78BFA] font-bold">Track de emagrecimento diário</span>
          </div>
          <div className="flex items-center gap-2 bg-[#181920] rounded-xl px-3 py-2 border border-white/5">
            <input 
              type="number"
              step="0.05"
              value={rhythm.bodyWeight || ''}
              onChange={(e) => updateField('bodyWeight', parseFloat(e.target.value) || 0)}
              placeholder="Ex: 72.45"
              className="flex-1 bg-transparent text-xs text-white placeholder-gray-650 focus:outline-none font-mono"
            />
            <span className="text-[10px] text-gray-500 font-extrabold shrink-0">kg</span>
          </div>
        </div>

        {/* 6. Alimentação Prioritária Natural */}
        <div className="bg-[#0B0C10] p-4 rounded-2xl border border-white/5 space-y-2.5 pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10.5px] font-bold text-gray-200">
              Você priorizou alimentos naturais hoje?
            </span>
            <span className="text-[8.5px] text-gray-500 font-semibold uppercase">Escala de 1 (Quase nada) a 5 (Totalmente limpo)</span>
          </div>

          <div className="flex justify-between items-center gap-2">
            {[1, 2, 3, 4, 5].map((level) => {
              const isSelected = rhythm.naturalFoodScale === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => updateField('naturalFoodScale', level)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-[11px] font-black transition-all ${
                    isSelected 
                      ? 'bg-purple-500 text-white scale-110 shadow-lg shadow-purple-500/25 ring-2 ring-purple-400/30' 
                      : 'bg-[#181920] border border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SYNC AND SAVE BUTTON WITH BACKGROUND FEEDBACK */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSaveRhythms}
          disabled={isSyncing}
          className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[12px] uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.35)] disabled:bg-neutral-800 disabled:text-gray-500"
        >
          {isSyncing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-purple-300" />
              <span>Analisando ritmos nos bastidores...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Salvar Ritmos do Dia</span>
            </>
          )}
        </button>
      </div>

      {/* FLOAT SAVE TOAST NOTIFICATION */}
      {showSavedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 py-2.5 px-4 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-2xl border border-emerald-400/20 flex items-center gap-1.5 animate-bounce">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Sincronizado! Análise atualizada na Home</span>
        </div>
      )}

    </div>
  );
}
