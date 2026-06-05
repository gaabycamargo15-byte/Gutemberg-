import React, { useState } from 'react';
import { 
  Plus, DollarSign, ArrowUpRight, ArrowDownRight, Tag, Clock,
  TrendingDown, TrendingUp, Sparkles, Check, Trash2, Calendar
} from 'lucide-react';
import { LifeOSState, Transaction } from '../types';

interface FinancesScreenProps {
  state: LifeOSState;
  setState: React.Dispatch<React.SetStateAction<LifeOSState>>;
}

export default function FinancesScreen({ state, setState }: FinancesScreenProps) {
  // Filter state
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  
  // Transaction creation state
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Alimentação' | 'Delivery' | 'Mercado' | 'Transporte' | 'Lazer' | 'Outros'>('Alimentação');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  // Calculations
  const todayStr = '2026-06-01';

  const totalIncomes = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const baseSavings = 8450.00;
  const currentSavings = baseSavings + totalIncomes - totalExpenses;

  // Filter lists
  const filteredTransactions = state.transactions
    .filter(t => {
      if (filter === 'all') return true;
      return t.type === filter;
    })
    // Sort youngest first
    .sort((a, b) => new Date(b.date + 'T12:00:00').getTime() - new Date(a.date + 'T12:00:00').getTime());  // Category markers in Twitch-inspired dark neon theme
  const categoryBg: Record<string, string> = {
    Alimentação: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    Delivery: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    Mercado: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    Transporte: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    Lazer: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
    Outros: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
  };

  const categorySymbol: Record<string, string> = {
    Alimentação: '🥗',
    Delivery: '🍕',
    Mercado: '🛒',
    Transporte: '🚗',
    Lazer: '🍿',
    Outros: '💼'
  };

  // Submit handler
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;

    const newTx: Transaction = {
      id: `t-new-${Date.now()}`,
      category,
      amount: value,
      description: description.trim() || `${type === 'income' ? 'Entrada' : 'Saída'} em ${category}`,
      date: todayStr,
      type
    };

    setState(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions]
    }));

    // Reset fields
    setAmount('');
    setDescription('');
    setCategory('Alimentação');
    setType('expense');
    setIsAdding(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar bg-[#0B0C10] text-white">
      
      {/* Finance Header status card */}
      <div className="bg-[#181920] border border-white/5 p-5 rounded-3xl text-white shadow-2xl relative overflow-hidden select-none">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full pointer-events-none blur-3xl"></div>
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-purple-500/5 rounded-full animate-soft-pulse pointer-events-none"></div>

        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest block">Resumo Financeiro</span>
        <h2 className="text-2xl font-display font-extrabold mt-1 text-white">Saldo: R$ {currentSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block">Ganhos</span>
            <span className="text-sm font-extrabold font-mono block mt-0.5 text-emerald-400">R$ {totalIncomes.toLocaleString('pt-BR')}</span>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block">Saídas</span>
            <span className="text-sm font-extrabold font-mono block mt-0.5 text-rose-400">R$ {totalExpenses.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Filter and Create trigger Row */}
      <div className="flex items-center justify-between gap-1.5 pt-1">
        {/* Toggle filters */}
        <div className="flex bg-[#181920] p-1 rounded-2xl border border-white/5 shadow-inner">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              filter === 'all' 
                ? 'bg-purple-900/40 text-purple-300 border border-[#A78BFA]/10 shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              filter === 'income' 
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10 shadow-sm' 
                : 'text-gray-400 hover:text-emerald-400'
            }`}
          >
            Ganhos
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              filter === 'expense' 
                ? 'bg-rose-955/40 text-rose-400 border border-rose-500/10 shadow-sm' 
                : 'text-gray-400 hover:text-rose-400'
            }`}
          >
            Saídas
          </button>
        </div>

        {/* Add Transaction Button */}
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all ${
            isAdding 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
              : 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-md shadow-purple-500/10'
          }`}
        >
          {isAdding ? <Clock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Fechar' : 'Lançar'}</span>
        </button>
      </div>

      {/* Interactive Quick Add Panel */}
      {isAdding && (
        <form onSubmit={handleAddTransaction} className="bg-[#181920] p-4 rounded-3xl border border-white/5 shadow-2xl space-y-3.5 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2 pb-1 border-b border-white/5">
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-400">
              <DollarSign className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wide">Novo Lançamento Rápido</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-[#0B0C10] text-gray-400 border-white/5'
              }`}
            >
              Saída (Despesa)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-[#0B0C10] text-gray-400 border-white/5'
              }`}
            >
              Ganho (Entrada)
            </button>
          </div>

          <div>
            <label className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Valor do Lançamento (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2.5 font-mono font-bold text-white bg-[#0B0C10] border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 text-xs bg-[#0B0C10] border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Alimentação">Alimentação</option>
                <option value="Delivery">Delivery</option>
                <option value="Mercado">Mercado</option>
                <option value="Transporte">Transporte</option>
                <option value="Lazer">Lazer</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Almoço, Sushi..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 text-xs bg-[#0B0C10] border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Gravar no Saldo</span>
          </button>
        </form>
      )}

      {/* Transaction List (Modern visual cards) */}
      <div className="space-y-2.5">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Atividade Consolidada</h3>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 bg-[#181920] rounded-3xl border border-white/5 text-gray-400 mt-2">
            <p className="text-xs">Nenhum registro com esses critérios.</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div 
              key={tx.id} 
              className="bg-[#181920] p-3.5 rounded-3xl border border-white/5 flex items-center justify-between group shadow-sm hover:border-purple-500/20 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 ${categoryBg[tx.category] || categoryBg.Outros}`}>
                  {categorySymbol[tx.category] || '💼'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{tx.description}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400 font-medium">
                    <span className="text-purple-400 font-semibold">{tx.category}</span>
                    <span>•</span>
                    <span>{new Date(tx.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`font-mono text-xs font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </span>
                <button
                  onClick={() => handleDeleteTransaction(tx.id)}
                  className="p-1 text-gray-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-opacity md:opacity-0 group-hover:opacity-100"
                  title="Apagar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
