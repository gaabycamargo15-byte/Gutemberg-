export type MoodType = 'happy' | 'good' | 'neutral' | 'sad' | 'stressed';

export interface MoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  note?: string;
}

export interface Transaction {
  id: string;
  category: 'Alimentação' | 'Delivery' | 'Mercado' | 'Transporte' | 'Lazer' | 'Outros';
  amount: number;
  description: string;
  date: string; // YYYY-MM-DD
  type: 'income' | 'expense';
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  iconName: string;
  createdAt: string;
}

export interface HabitCompletion {
  date: string; // YYYY-MM-DD
  habitId: string;
}

export interface GratitudeLog {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
}

export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  deadline: string; // YYYY-MM-DD
}

export interface AgendaItem {
  id: string;
  title: string;
  time: string; // "10:00"
  date: string; // YYYY-MM-DD
}

export interface AIInsight {
  id: string;
  type: 'habit' | 'finance' | 'mood' | 'general';
  text: string;
  createdAt: string;
}

export interface DailyRhythm {
  date: string; // YYYY-MM-DD
  // Mente
  readBook: string;
  readPagesCountCount: number;
  studyArea: 'Finanças' | 'Idiomas' | 'Tecnologia' | 'Comunicação' | '';
  thoughtsOnPaper: boolean;
  // Corpo
  workout: boolean;
  gymWeightTrainingMinutes?: number; // musculação tempo em min
  gymCardioMinutes?: number; // cardio tempo em min
  gymCardioEquipment?: 'Esteira' | 'Bicicleta' | 'Elíptico' | 'Escada' | 'Remo' | 'Nenhum' | ''; 
  bodyWeight?: number; // peso corporal em kg
  walkDuration: string; // walk duration
  stretching: boolean;
  sleepHours: number;
  waterMl: number;
  naturalFoodScale: number; // 1 to 5
}

export interface DailyDiary {
  date: string; // YYYY-MM-DD
  gratitude: string;
  improve: string;
  distraction: string;
  victory: string;
  notes: string;
}

export interface LifeOSState {
  profile: {
    name: string;
    avatarUrl: string;
    savingGoalMonthly: number;
  };
  transactions: Transaction[];
  habits: Habit[];
  completions: HabitCompletion[];
  moods: MoodLog[];
  gratitude: GratitudeLog[];
  goals: Goal[];
  insights: AIInsight[];
  agenda: AgendaItem[];
  dailyRhythms?: DailyRhythm[];
  dailyDiaries?: DailyDiary[];
}
