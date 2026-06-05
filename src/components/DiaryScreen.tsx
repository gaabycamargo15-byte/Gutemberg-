import React, { useState, useEffect } from 'react';
import { 
  Heart, Sparkles, Notebook, Trash2, CheckCircle2, MessageSquare, Flame, HelpCircle
} from 'lucide-react';
import { LifeOSState, DailyDiary } from '../types';

interface DiaryScreenProps {
  state: LifeOSState;
  setState: React.Dispatch<React.SetStateAction<LifeOSState>>;
}

export default function DiaryScreen({ state, setState }: DiaryScreenProps) {
  const todayStr = '2026-06-01';

  // Get or initialize today's diary
  const getTodayDiary = (): DailyDiary => {
    const found = state.dailyDiaries?.find(d => d.date === todayStr);
    if (found) return found;
    return {
      date: todayStr,
      gratitude: '',
      improve: '',
      distraction: '',
      victory: '',
      notes: ''
    };
  };

  const [diary, setDiary] = useState<DailyDiary>(getTodayDiary());
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync with state update if changed by parent
  useEffect(() => {
    const found = state.dailyDiaries?.find(d => d.date === todayStr);
    if (found) {
      setDiary(found);
    }
  }, [state.dailyDiaries]);

  const updateField = <K extends keyof DailyDiary>(field: K, value: DailyDiary[K]) => {
    setDiary(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);

    // 1. Update dailyDiary array
    const currentDiaries = state.dailyDiaries ? [...state.dailyDiaries] : [];
    const index = currentDiaries.findIndex(d => d.date === todayStr);

    if (index >= 0) {
      currentDiaries[index] = diary;
    } else {
      currentDiaries.push(diary);
    }

    // Also populate general gratitude list if gratitude is filled for backward compatibility inside wrapped or logs
    let updatedGratitude = [...state.gratitude];
    if (diary.gratitude.trim()) {
      const exists = updatedGratitude.some(g => g.date === todayStr);
      if (!exists) {
        updatedGratitude.unshift({
          id: `g-today-${Date.now()}`,
          text: diary.gratitude.trim(),
          date: todayStr
        });
      } else {
        updatedGratitude = updatedGratitude.map(g => 
          g.date === todayStr ? { ...g, text: diary.gratitude.trim() } : g
        );
      }
    }

    setState(prev => ({
      ...prev,
      dailyDiaries: currentDiaries,
      gratitude: updatedGratitude
    }));

    // 2. Perform AI background analysis ("Análise nos bastidores" - results appear ONLY on Home)
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
          gratitude: updatedGratitude,
          goals: state.goals,
          dailyDiaries: currentDiaries,
          dailyRhythms: state.dailyRhythms
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
      console.error('Erro de background insight no diário:', err);
    } finally {
      setIsSyncing(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar bg-[#0B0C10] text-white">
      
      {/* Header Premium de Tom Superior */}
      <div className="bg-[#181920] border border-white/5 p-5 rounded-3xl text-white select-none relative overflow-hidden shadow-2xl text-left">
        <div className="absolute right-[#10px] top-[-10px] opacity-[0.05]">
          <Notebook className="w-28 h-28 text-white fill-white" />
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 px-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-[9px] font-bold uppercase tracking-widest block">
            Diário Pessoal
          </span>
        </div>
        <h2 className="text-xl font-black font-display text-white tracking-tight">Registro Intencional</h2>
        <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">
          Escrever estimula a neuroplasticidade mental e melhora a clareza de suas decisões. Responda com honestidade.
        </p>
      </div>

      <form onSubmit={handleSaveDiary} className="space-y-4 text-left">
        
        {/* Questions card container */}
        <div className="bg-[#181920] border border-white/5 p-4.5 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Reflexões do dia de hoje</span>
          </div>

          {/* 1. Pelo que você é grato hoje? */}
          <div className="space-y-1.5">
            <label className="text-[11.5px] font-bold text-gray-200 block">
              1. Pelo que você é grato hoje?
            </label>
            <textarea
              value={diary.gratitude}
              onChange={(e) => updateField('gratitude', e.target.value)}
              placeholder="Agradeço hoje por..."
              rows={2}
              className="w-full p-2.5 text-xs bg-[#0B0C10] text-white border border-white/5 focus:border-[#7C3AED]/45 rounded-2xl focus:outline-none font-medium resize-none placeholder-gray-650"
            />
          </div>

          {/* 2. O que posso melhorar? */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11.5px] font-bold text-gray-200 block">
              2. O que você pode melhorar?
            </label>
            <textarea
              value={diary.improve}
              onChange={(e) => updateField('improve', e.target.value)}
              placeholder="Poderia ter agido diferente em..."
              rows={2}
              className="w-full p-2.5 text-xs bg-[#0B0C10] text-white border border-white/5 focus:border-[#7C3AED]/45 rounded-2xl focus:outline-none font-medium resize-none placeholder-gray-650"
            />
          </div>

          {/* 3. Qual foi minha maior distração? */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11.5px] font-bold text-gray-200 block">
              3. Qual foi sua maior distração?
            </label>
            <textarea
              value={diary.distraction}
              onChange={(e) => updateField('distraction', e.target.value)}
              placeholder="O que roubou seu foco hoje..."
              rows={2}
              className="w-full p-2.5 text-xs bg-[#0B0C10] text-white border border-white/5 focus:border-[#7C3AED]/45 rounded-2xl focus:outline-none font-medium resize-none placeholder-gray-650"
            />
          </div>

          {/* 4. Qual foi minha maior vitória hoje? */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11.5px] font-bold text-gray-200 block">
              4. Qual foi sua maior vitória hoje?
            </label>
            <textarea
              value={diary.victory}
              onChange={(e) => updateField('victory', e.target.value)}
              placeholder="O seu principal avanço do dia..."
              rows={2}
              className="w-full p-2.5 text-xs bg-[#0B0C10] text-white border border-white/5 focus:border-[#7C3AED]/45 rounded-2xl focus:outline-none font-medium resize-none placeholder-gray-650"
            />
          </div>

          {/* 5. Observações livres */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11.5px] font-bold text-gray-200 block">
              5. Observações livres ou notas extras
            </label>
            <textarea
              value={diary.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Qualquer outro pensamento que queira registrar..."
              rows={3}
              className="w-full p-2.5 text-xs bg-[#0B0C10] text-white border border-white/5 focus:border-[#7C3AED]/45 rounded-2xl focus:outline-none font-medium resize-none placeholder-gray-650"
            />
          </div>

        </div>

        {/* Dynamic Saving Action Row */}
        <div>
          <button
            type="submit"
            disabled={isSyncing}
            className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[12px] uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.35)] disabled:bg-neutral-800 disabled:text-gray-500"
          >
            {isSyncing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-purple-300" />
                <span>Processando diário nos bastidores...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Salvar Diário de Hoje</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* FLOAT SAVE TOAST NOTIFICATION */}
      {showSavedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 py-2.5 px-4 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-2xl border border-emerald-400/20 flex items-center gap-1.5 animate-bounce">
          <Heart className="w-3.5 h-3.5 stroke-[3] fill-white" />
          <span>Salvo! Insight recalculado na Home</span>
        </div>
      )}

    </div>
  );
}
