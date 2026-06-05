import React, { useState } from 'react';
import { 
  Clock, Plus, Trash2, Sparkles, ChevronLeft, ChevronRight, Calendar as CalendarIcon 
} from 'lucide-react';
import { LifeOSState, AgendaItem } from '../types';

interface AgendaScreenProps {
  state: LifeOSState;
  setState: React.Dispatch<React.SetStateAction<LifeOSState>>;
}

export default function AgendaScreen({ state, setState }: AgendaScreenProps) {
  const todayStr = '2026-06-01';

  // State for active calendar date view
  const [selectedDateStr, setSelectedDateStr] = useState('2026-06-01');

  // Month navigation state: June 2026 (6th month, 0-indexed as 5)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); 

  // Form states for new event
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('12:00');

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekdayHeaders = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Helper helper to get total days in a month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper helper to get first day offset (0 = Sunday, 1 = Monday ...)
  const getFirstDayOffset = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: AgendaItem = {
      id: `ag-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime,
      date: selectedDateStr,
    };

    setState(prev => ({
      ...prev,
      agenda: [...(prev.agenda || []), newItem]
    }));

    setNewTitle('');
  };

  const handleDeleteAppointment = (id: string) => {
    setState(prev => ({
      ...prev,
      agenda: (prev.agenda || []).filter(item => item.id !== id)
    }));
  };

  const formatFriendlyDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    } catch {
      return dateStr;
    }
  };

  const formatFriendlyDateShort = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      return `${parts[2]}/${parts[1]}`;
    } catch {
      return dateStr;
    }
  };

  const appointments = state.agenda || [];
  const daysCount = getDaysInMonth(currentYear, currentMonth);
  const offset = getFirstDayOffset(currentYear, currentMonth);

  // Appointments for currently selected day
  const selectedDayAppointments = [...appointments]
    .filter(item => item.date === selectedDateStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar bg-[#0B0C10] text-white">
      
      {/* Premium Header */}
      <div className="bg-[#181920] border border-white/5 p-4.5 rounded-3xl shadow-2xl relative overflow-hidden select-none">
        <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-purple-500/5 rounded-full blur-xl"></div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1.5 rounded-xl bg-[#7C3AED]/10 text-purple-400 border border-[#7C3AED]/20">
            <CalendarIcon className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-black font-display text-white tracking-tight text-left">Minha Agenda</h3>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed text-left">
          Toque em qualquer data no calendário para registrar ou ver seus compromissos. Eventos de hoje aparecem no topo da página inicial.
        </p>
      </div>

      {/* Interactive Month Selector Header */}
      <div className="flex items-center justify-between bg-[#181920] border border-white/5 px-4 py-2.5 rounded-2xl">
        <button 
          onClick={goToPrevMonth}
          className="p-1.5 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
          type="button"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-black font-sans uppercase tracking-widest text-[#A78BFA]">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <button 
          onClick={goToNextMonth}
          className="p-1.5 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
          type="button"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Month Grid */}
      <div className="bg-[#181920] border border-white/5 p-4.5 rounded-3xl shadow-md">
        {/* Days of the Week headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-3">
          {weekdayHeaders.map((day, idx) => (
            <span key={idx} className="text-[9.5px] font-black text-gray-500 uppercase tracking-wider">
              {day}
            </span>
          ))}
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Calendar padding offset */}
          {Array.from({ length: offset }).map((_, idx) => (
            <div key={`offset-${idx}`} className="w-full aspect-square" />
          ))}

          {/* Calendar day grids */}
          {Array.from({ length: daysCount }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDateStr;
            const isToday = dateStr === todayStr;

            // Events count for this cell date
            const count = appointments.filter(e => e.date === dateStr).length;

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                onClick={() => setSelectedDateStr(dateStr)}
                className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                  isSelected 
                    ? 'bg-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.6)] text-white border border-[#A78BFA]/45 font-black scale-102' 
                    : isToday
                      ? 'bg-purple-900/45 text-purple-200 border border-purple-500/40 font-bold'
                      : 'bg-white/5 text-gray-200 hover:bg-white/10 font-medium'
                }`}
              >
                <span className="text-[11px] leading-none mb-0.5">{dayNum}</span>
                
                {/* Event count indicators badge */}
                {count > 0 && (
                  <div className="absolute bottom-1.5 flex gap-0.5 justify-center">
                    {Array.from({ length: Math.min(count, 3) }).map((_, dIdx) => (
                      <span 
                        key={dIdx} 
                        className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-400'}`} 
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Information */}
      <div className="space-y-3.5 text-left pt-1">
        
        {/* Selected date day badge description */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-wider text-purple-400">
              Compromissos do Dia
            </h3>
            <p className="text-[11px] text-gray-400 font-bold mt-0.5 first-letter:uppercase">
              {formatFriendlyDate(selectedDateStr)}
            </p>
          </div>
          
          <span className="text-[9px] font-extrabold bg-[#7C3AED]/20 text-[#A78BFA] px-2.5 py-0.5 rounded-full border border-purple-500/20">
            {selectedDayAppointments.length} {selectedDayAppointments.length === 1 ? 'evento' : 'eventos'}
          </span>
        </div>

        {/* Selected day events list */}
        {selectedDayAppointments.length === 0 ? (
          <div className="bg-[#181920] border border-white/5 p-6 rounded-3xl text-center select-none">
            <CalendarIcon className="w-6 h-6 mx-auto text-gray-650 opacity-40 mb-1.5 stroke-[1.5]" />
            <p className="text-[11.5px] text-gray-500">Nenhum compromisso para este dia.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayAppointments.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#181920]/80 border border-white/5 p-3.5 rounded-2.5xl flex items-center justify-between hover:border-purple-500/10 transition-colors"
                id={`agenda-item-${item.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300 font-mono text-[9px] font-black leading-none">
                    {item.time}
                  </div>
                  <span className="text-xs font-bold text-white select-text truncate leading-none">
                    {item.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAppointment(item.id)}
                  className="p-1 px-1.5 text-gray-500 hover:text-rose-400 transition-colors shrink-0"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic event inline creator - embedded seamlessly within context */}
        <form onSubmit={handleAddAppointment} className="bg-[#181920] border border-white/5 p-4 rounded-3xl space-y-3 shadow-sm">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Adicionar a este dia</span>
          </p>

          <div className="flex gap-2.5">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Novo compromisso (ex. Dentista...)"
              className="flex-1 px-3 py-2 text-[11px] bg-[#0B0C10] border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#7C3AED] text-white font-medium placeholder-gray-500"
            />
            <input
              type="time"
              required
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-20 px-2 py-2 text-[11px] bg-[#0B0C10] border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#7C3AED] text-white font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[10.5px] font-bold rounded-2xl flex items-center justify-center gap-1 active:scale-[0.98] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agendar para {formatFriendlyDateShort(selectedDateStr)}</span>
          </button>
        </form>

      </div>

    </div>
  );
}
