import React, { useState } from 'react';
import { 
  Sparkles, X, ChevronRight, ChevronLeft, Award, TrendingUp, 
  Map, Calendar, Lightbulb, Image as ImageIcon, Heart
} from 'lucide-react';
import { LifeOSState } from '../types';

interface YearlyWrappedProps {
  state: LifeOSState;
  onClose: () => void;
}

export default function YearlyWrapped({ state, onClose }: YearlyWrappedProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = 6;

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

  // Static Annual Recap information focused heavily on stunning visual polish
  const bestMoments = [
    { text: 'Finalizei meu primeiro grande site freelance em UI Design!', date: 'Mês de Março' },
    { text: 'Consegui manter 15 dias ininterruptos de treino e me senti maravilhosa.', date: 'Mês de Abril' },
    { text: 'Uma viagem incrível no final de semana com Luana para recarregar.', date: 'Mês de Maio' },
    { text: 'Entendi a correlação do estresse e do delivery e mudei hábitos de compras.', date: 'Mês de Maio' },
    { text: 'Pequenas gratidões diárias anotadas trouxeram enorme clareza mental.', date: 'Mês de Junho' }
  ];

  return (
    <div className="absolute inset-0 bg-[#070B19] z-50 text-white flex flex-col p-6 font-sans overflow-hidden animate-in fade-in duration-350">
      
      {/* progress lines top */}
      <div className="flex gap-1.5 shrink-0 select-none">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div key={i} className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-teal-400 to-[#1E3A8A] transition-all duration-300 ${
                i <= currentSlide ? 'w-full' : 'w-0'
              }`}
            ></div>
          </div>
        ))}
      </div>

      {/* header wrap */}
      <div className="flex justify-between items-center mt-5 select-none shrink-0">
        <div className="flex items-center gap-1.5 text-teal-300">
          <Award className="w-4 h-4 text-teal-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">SUA JORNADA DO ANO</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white select-none active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main slide decks */}
      <div className="flex-1 flex flex-col justify-center my-6 relative min-h-0 select-none">
        
        {/* SLIDE 1: Intro cinematic page of year */}
        {currentSlide === 0 && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-450">
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              {/* Spinning or pulsing neon rings */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A8A] to-teal-400 rounded-full blur-2xl opacity-20 animate-soft-pulse"></div>
              <div className="w-36 h-36 rounded-full border border-teal-500/20 bg-cover bg-center flex flex-col items-center justify-center bg-teal-500/10 shadow-lg">
                <span className="text-4xl">👑</span>
                <span className="text-[10px] uppercase font-bold text-teal-300 mt-2 tracking-widest font-display">Life Odyssey</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-display font-bold text-white tracking-tight leading-tight">
                Gaby, sua Jornada Real no Ano de 2026
              </h1>
              <p className="text-sm text-blue-200 px-4 leading-relaxed font-medium">
                Consolidamos todos os picos de conquistas, resiliências emocionais e saltos de bem-estar acumulados. Prepare a pipoca!
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 2: Financial recap of year */}
        {currentSlide === 1 && (
          <div className="space-y-5 text-center animate-in slide-in-from-right duration-400">
            <span className="text-[9px] text-blue-300 font-bold uppercase tracking-widest bg-[#1E3A8A]/15 px-3 py-1 rounded-full">Progresso de Moeda</span>
            <h3 className="text-xl font-bold font-display text-white">Acúmulo Anual</h3>
            
            <div className="space-y-3 max-w-sm mx-auto">
              {/* Total saved card */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center text-left">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase block">Total Economizado</span>
                  <span className="text-2xl font-mono font-bold text-teal-400">R$ 24.300</span>
                </div>
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              {/* Total invested card */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center text-left">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase block">Total Investido</span>
                  <span className="text-2xl font-mono font-bold text-blue-400">R$ 18.520</span>
                </div>
                <div className="p-2 rounded-xl bg-[#1E3A8A]/10 text-blue-400">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 px-6 leading-relaxed">
              O mês de <span className="text-teal-400 font-bold">Maio</span> representou o seu melhor superávit absoluto com 34% a mais de ganhos de UI freelance.
            </p>
          </div>
        )}

        {/* SLIDE 3: Habits consistency */}
        {currentSlide === 2 && (
          <div className="space-y-6 text-center animate-in slide-in-from-right duration-400">
            <span className="text-[9px] font-bold text-yellow-400 bg-yellow-500/10 py-1 px-3 rounded-full uppercase tracking-widest">Rotinas & Rituais</span>
            <h3 className="text-xl font-bold font-display text-white">Inabalável Consistência</h3>
            
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 flex items-center justify-center mx-auto text-4xl shadow-inner">
              ⚡
            </div>

            <div className="space-y-1">
              <span className="text-2xl font-bold text-white block">Beber Água e Meditar</span>
              <span className="text-xs text-blue-300 font-medium block">Ocupam seu pilar principal no ano</span>
            </div>

            <p className="text-xs text-gray-400 px-6 leading-relaxed">
              Registramos impressionantes <span className="font-bold text-yellow-400">240 completions</span> acumuladas de hábitos nos últimos meses de 2026.
            </p>
          </div>
        )}

        {/* SLIDE 4: 50 Melhores Momentos (Diary snapshots polaroid) */}
        {currentSlide === 3 && (
          <div className="space-y-4 text-center animate-in slide-in-from-right duration-400 max-w-sm mx-auto font-sans">
            <span className="text-[9px] text-pink-400 font-bold uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full">Gaby's Gallery</span>
            <h3 className="text-xl font-bold font-display text-white">Destaques dos Melhores Momentos</h3>
            
            {/* Scrollable list of moments mimicking Polaroid captures */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto no-scrollbar pt-1">
              {bestMoments.map((mom, index) => (
                <div key={index} className="p-3 bg-white text-gray-900 rounded-xl text-left shadow-md flex items-start gap-2.5">
                  <span className="text-base">📸</span>
                  <div>
                    <p className="text-[11px] font-medium leading-relaxed">"{mom.text}"</p>
                    <span className="text-[9px] text-[#1E3A8A] font-bold block mt-1">{mom.date}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-[10px] text-gray-500">
              Isso consolida as melhores memórias anotadas no seu diário.
            </p>
          </div>
        )}

        {/* SLIDE 5: Emotional Timeline (Mood Wave chart) */}
        {currentSlide === 4 && (
          <div className="space-y-5 text-center animate-in slide-in-from-right duration-400">
            <span className="text-[9px] text-teal-300 font-bold uppercase tracking-widest bg-teal-500/10 px-3 py-1 rounded-full">Frequência Emocional</span>
            <h3 className="text-xl font-bold font-display text-white">Sua Linha do Tempo Emocional</h3>

            {/* Custom vector timeline representation */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-xs mx-auto">
              <div className="flex items-end justify-between h-20 px-2 mt-2">
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-xs font-bold text-gray-400">Jan</span>
                  <div className="w-3.5 bg-[#1E3A8A]/40 h-8 rounded-t"></div>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-xs font-bold text-gray-400">Fev</span>
                  <div className="w-3.5 bg-[#1E3A8A]/60 h-10 rounded-t"></div>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-xs font-bold text-gray-400">Mar</span>
                  <div className="w-3.5 bg-[#1E3A8A]/80 h-14 rounded-t"></div>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-xs font-bold text-gray-400">Abr</span>
                  <div className="w-3.5 bg-teal-400/80 h-16 rounded-t-lg shadow-sm shadow-teal-500/20"></div>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-xs font-bold text-white">Mai</span>
                  <div className="w-3.5 bg-gradient-to-t from-[#1E3A8A] to-teal-400 h-[72px] rounded-t-lg shadow-sm"></div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 text-left mt-3 pt-3 border-t border-white/5">
                📈 Você experimentou estabilidade e picos de felicidade ("Super Feliz") com maior frequência entre Abril e Maio.
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 6: Lessons Learned & Closing */}
        {currentSlide === 5 && (
          <div className="space-y-6 text-center animate-in slide-in-from-right duration-400 font-sans">
            <span className="text-[9px] text-blue-300 font-bold uppercase tracking-widest bg-[#1E3A8A]/15 py-1 px-3 rounded-full border border-[#1E3A8A]/30">Síntese de Evolução</span>
            <h3 className="text-2xl font-bold font-display text-white">Principais Aprendizados</h3>

            <div className="space-y-3 text-left max-w-sm mx-auto px-4 text-xs">
              <div className="flex gap-2 items-start">
                <span className="p-1 rounded-lg bg-teal-500/10 text-teal-400 mt-0.5">💡</span>
                <p className="text-gray-300 leading-relaxed"><span className="text-white font-bold">Autorregulação:</span> o dinheiro e o emocional caminham de mãos dadas. Dominar um é o atalho para acalmar o outro.</p>
              </div>
              <div className="flex gap-2 items-start">
                <span className="p-1 rounded-lg bg-teal-500/10 text-teal-400 mt-0.5">💡</span>
                <p className="text-gray-300 leading-relaxed"><span className="text-white font-bold">Pequenos Passos:</span> beber água, respirar e fazer diários são mais potentes a longo prazo do que mutirões desgastantes.</p>
              </div>
            </div>

            <p className="text-xs font-medium text-teal-300">"Continue escrevendo sua história!"</p>
          </div>
        )}

      </div>

      {/* Navigator footer buttons */}
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
          <div className="w-20"></div>
        )}

        <button
          onClick={next}
          className="py-2.5 px-5 bg-gradient-to-r from-teal-400 to-[#1E3A8A] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md hover:opacity-90 active:scale-95 transition-all"
        >
          <span>{currentSlide === totalSlides - 1 ? 'Concluir' : 'Próximo'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
