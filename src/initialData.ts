import { LifeOSState } from './types';

// Helper to get past dates relative to 2026-06-01
const getPastDate = (daysAgo: number): string => {
  const date = new Date('2026-06-01');
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const initialOSState: LifeOSState = {
  profile: {
    name: "Gaby",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    savingGoalMonthly: 1500,
  },
  transactions: [
    // Income
    { id: 't-inc-1', category: 'Outros', amount: 4800, description: 'Freelance UI Design', date: getPastDate(25), type: 'income' },
    { id: 't-inc-2', category: 'Outros', amount: 5000, description: 'Salário', date: getPastDate(1), type: 'income' },
    
    // Expenses
    { id: 't-1', category: 'Alimentação', amount: 82.50, description: 'Almoço Saudável', date: getPastDate(0), type: 'expense' },
    { id: 't-2', category: 'Delivery', amount: 120.00, description: 'Japa Sushi Prime (Estresse alto)', date: getPastDate(2), type: 'expense' },
    { id: 't-3', category: 'Mercado', amount: 350.00, description: 'Compras do mês Pão de Açúcar', date: getPastDate(5), type: 'expense' },
    { id: 't-4', category: 'Transporte', amount: 45.00, description: 'Uber para o Co-working', date: getPastDate(1), type: 'expense' },
    { id: 't-5', category: 'Lazer', amount: 150.00, description: 'Ingressos de Cinema', date: getPastDate(4), type: 'expense' },
    { id: 't-6', category: 'Delivery', amount: 95.00, description: 'Hambúrguer Gourmet', date: getPastDate(7), type: 'expense' },
    { id: 't-7', category: 'Alimentação', amount: 65.00, description: 'Café da manhã especial', date: getPastDate(3), type: 'expense' },
    { id: 't-8', category: 'Lazer', amount: 200.00, description: 'Show de Stand-up', date: getPastDate(11), type: 'expense' },
    { id: 't-9', category: 'Transporte', amount: 38.00, description: 'Uber Volta', date: getPastDate(11), type: 'expense' },
    { id: 't-10', category: 'Mercado', amount: 180.00, description: 'Hortifruti Orgânicos', date: getPastDate(12), type: 'expense' },
    { id: 't-11', category: 'Delivery', amount: 78.00, description: 'Pizza Artesanal (Noite cansativa)', date: getPastDate(13), type: 'expense' },
    { id: 't-12', category: 'Alimentação', amount: 42.00, description: 'Almoço executivo', date: getPastDate(15), type: 'expense' },
    { id: 't-13', category: 'Lazer', amount: 90.00, description: 'Exposição de Arte', date: getPastDate(18), type: 'expense' },
  ],
  habits: [
    { id: 'h-1', title: 'Meditação Mindfulness', category: 'Mente', streak: 6, iconName: 'Compass', createdAt: getPastDate(30) },
    { id: 'h-2', title: 'Beber 2L de Água', category: 'Corpo', streak: 12, iconName: 'Droplet', createdAt: getPastDate(30) },
    { id: 'h-3', title: 'Treino Diário', category: 'Corpo', streak: 4, iconName: 'Activity', createdAt: getPastDate(30) },
    { id: 'h-4', title: 'Leitura antes de dormir', category: 'Intelecto', streak: 7, iconName: 'BookOpen', createdAt: getPastDate(30) },
    { id: 'h-5', title: 'Dormir 8 Horas', category: 'Mente', streak: 5, iconName: 'Moon', createdAt: getPastDate(30) },
  ],
  completions: [
    // Meditação completions
    { date: getPastDate(0), habitId: 'h-1' },
    { date: getPastDate(1), habitId: 'h-1' },
    { date: getPastDate(2), habitId: 'h-1' },
    { date: getPastDate(3), habitId: 'h-1' },
    { date: getPastDate(4), habitId: 'h-1' },
    { date: getPastDate(5), habitId: 'h-1' },
    { date: getPastDate(7), habitId: 'h-1' },
    { date: getPastDate(8), habitId: 'h-1' },
    { date: getPastDate(10), habitId: 'h-1' },
    { date: getPastDate(11), habitId: 'h-1' },
    { date: getPastDate(12), habitId: 'h-1' },
    // Beber Água completions (high frequency)
    { date: getPastDate(0), habitId: 'h-2' },
    { date: getPastDate(1), habitId: 'h-2' },
    { date: getPastDate(2), habitId: 'h-2' },
    { date: getPastDate(3), habitId: 'h-2' },
    { date: getPastDate(4), habitId: 'h-2' },
    { date: getPastDate(5), habitId: 'h-2' },
    { date: getPastDate(6), habitId: 'h-2' },
    { date: getPastDate(7), habitId: 'h-2' },
    { date: getPastDate(8), habitId: 'h-2' },
    { date: getPastDate(9), habitId: 'h-2' },
    { date: getPastDate(10), habitId: 'h-2' },
    { date: getPastDate(11), habitId: 'h-2' },
    { date: getPastDate(12), habitId: 'h-2' },
    { date: getPastDate(14), habitId: 'h-2' },
    { date: getPastDate(15), habitId: 'h-2' },
    // Treino completions
    { date: getPastDate(0), habitId: 'h-3' },
    { date: getPastDate(1), habitId: 'h-3' },
    { date: getPastDate(2), habitId: 'h-3' },
    { date: getPastDate(3), habitId: 'h-3' },
    { date: getPastDate(6), habitId: 'h-3' },
    { date: getPastDate(8), habitId: 'h-3' },
    { date: getPastDate(10), habitId: 'h-3' },
    { date: getPastDate(12), habitId: 'h-3' },
    // Leitura completions
    { date: getPastDate(0), habitId: 'h-4' },
    { date: getPastDate(1), habitId: 'h-4' },
    { date: getPastDate(2), habitId: 'h-4' },
    { date: getPastDate(3), habitId: 'h-4' },
    { date: getPastDate(4), habitId: 'h-4' },
    { date: getPastDate(5), habitId: 'h-4' },
    { date: getPastDate(6), habitId: 'h-4' },
    { date: getPastDate(9), habitId: 'h-4' },
    { date: getPastDate(11), habitId: 'h-4' },
    { date: getPastDate(12), habitId: 'h-4' },
    // Dormir completions
    { date: getPastDate(0), habitId: 'h-5' },
    { date: getPastDate(1), habitId: 'h-5' },
    { date: getPastDate(2), habitId: 'h-5' },
    { date: getPastDate(3), habitId: 'h-5' },
    { date: getPastDate(4), habitId: 'h-5' },
    { date: getPastDate(7), habitId: 'h-5' },
    { date: getPastDate(8), habitId: 'h-5' },
    { date: getPastDate(10), habitId: 'h-5' },
    { date: getPastDate(11), habitId: 'h-5' },
  ],
  moods: [
    { id: 'm-1', date: getPastDate(0), mood: 'happy', note: 'Dia incrível, treinei e fiz o design!' },
    { id: 'm-2', date: getPastDate(1), mood: 'good', note: 'Dia produtivo de trabalho.' },
    { id: 'm-3', date: getPastDate(2), mood: 'stressed', note: 'Estresse com prazos. Acabei pedindo sushi delivery.' },
    { id: 'm-4', date: getPastDate(3), mood: 'neutral', note: 'Mais calmo, descansando.' },
    { id: 'm-5', date: getPastDate(4), mood: 'happy', note: 'Fui ao cinema com os amigos.' },
    { id: 'm-6', date: getPastDate(5), mood: 'good', note: 'Dia organizado de compras.' },
    { id: 'm-7', date: getPastDate(6), mood: 'neutral', note: 'Domingo tranquilo em casa.' },
    { id: 'm-8', date: getPastDate(7), mood: 'stressed', note: 'Trânsito horrível e cansaço. Jantei hambúrguer.' },
    { id: 'm-9', date: getPastDate(8), mood: 'happy', note: 'Consegui bater a meta dos exercícios.' },
    { id: 'm-10', date: getPastDate(9), mood: 'good', note: 'Dia focado no escritório.' },
    { id: 'm-11', date: getPastDate(10), mood: 'good', note: 'Agradeci pelas pequenas vitórias.' },
    { id: 'm-12', date: getPastDate(11), mood: 'happy', note: 'Show de comédia super engraçado!' },
    { id: 'm-13', date: getPastDate(12), mood: 'neutral', note: 'Sem muitas novidades.' },
    { id: 'm-14', date: getPastDate(13), mood: 'sad', note: 'Chovendo muito e dor de cabeça.' },
  ],
  gratitude: [
    { id: 'g-1', text: 'Pela minha família e o apoio constante nos momentos de correria.', date: getPastDate(0) },
    { id: 'g-2', text: 'Por um café saboroso pela manhã que energizou o dia.', date: getPastDate(1) },
    { id: 'g-3', text: 'Pela saúde física que me permite treinar forte.', date: getPastDate(3) },
    { id: 'g-4', text: 'Pela amizade da Luana e do Henrique e o riso de ontem.', date: getPastDate(4) },
    { id: 'g-5', text: 'Por ter conseguido fechar mais um projeto freelance na semana.', date: getPastDate(6) },
    { id: 'g-6', text: 'Por poder ler livros calmos antes de dormir e desacelerar.', date: getPastDate(9) },
    { id: 'g-7', text: 'Pela minha casa aconchegante e um banho quente reconfortante.', date: getPastDate(11) },
  ],
  goals: [
    { id: 'go-1', title: 'Reserva de Emergência Premium', current: 12500, target: 15000, unit: 'R$', deadline: '2026-08-31' },
    { id: 'go-2', title: 'Nova MacBook Pro M3 Max', current: 18000, target: 24000, unit: 'R$', deadline: '2026-12-15' },
    { id: 'go-3', title: 'Férias na Itália 🇮🇹', current: 6200, target: 12000, unit: 'R$', deadline: '2026-10-10' },
  ],
  insights: [
    {
      id: 'in-1',
      type: 'habit',
      text: 'Você se sentiu visivelmente mais feliz e com humor "Super Feliz" 😀 nos dias em que concluiu a Meditação Mindfulness e o Treino Diário na mesma rotina.',
      createdAt: getPastDate(0)
    },
    {
      id: 'in-2',
      type: 'finance',
      text: 'Detectamos que seus gastos com "Delivery" costumam aumentar cerca de 45% nos dias em que o humor registrado foi "Estressado" 😫 ou cansaço alto.',
      createdAt: getPastDate(1)
    },
    {
      id: 'in-3',
      type: 'mood',
      text: 'Você mencionou sua "família" e "amigos" 14 vezes nos últimos 30 dias na gratidão, mostrando excelentes âncoras emocionais nos dias desafiadores.',
      createdAt: getPastDate(2)
    }
  ],
  agenda: [
    { id: 'ag-1', title: 'Reunião', time: '10:00', date: '2026-06-01' },
    { id: 'ag-2', title: 'Médico', time: '14:00', date: '2026-06-01' },
    { id: 'ag-3', title: 'Academia', time: '18:00', date: '2026-06-01' }
  ],
  dailyRhythms: [
    {
      date: '2026-06-01',
      readBook: 'Hábitos Atômicos',
      readPagesCountCount: 15,
      studyArea: 'Finanças',
      thoughtsOnPaper: true,
      workout: true,
      walkDuration: '35',
      stretching: true,
      sleepHours: 8,
      waterMl: 2200,
      naturalFoodScale: 5
    }
  ],
  dailyDiaries: [
    {
      date: '2026-06-01',
      gratitude: 'Agradeço por um dia maravilhoso e produtivo de trabalho.',
      improve: 'Tentar focar mais na leitura à noite.',
      distraction: 'Redes sociais por 30 minutos depois do almoço.',
      victory: 'Concluí todos os rituais de Mente e de Corpo hoje!',
      notes: 'Me senti cheia de energia positiva hoje.'
    }
  ]
};
