export interface TMBFormData {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
}

export type SessionView = 'landing' | 'dashboard';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  goalType: 'loss' | 'maintenance' | 'gain';
  dailyGoal: number;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  password?: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  goalType: 'loss' | 'maintenance' | 'gain';
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  date: string;
}

export interface DailyLog {
  entries: FoodEntry[];
  total: number;
  goal: number;
}

export interface SetGoalRequest {
  goal: number;
}


export interface TMBResult {
  tmb: number;
  formula: string;
  message: string;
}

export interface APIError {
  error: string;
  details?: string;
}
