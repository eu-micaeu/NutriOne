export interface TMBFormData {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
}

export type SessionView = 'calculator';


export interface TMBResult {
  tmb: number;
  formula: string;
  message: string;
}

export interface APIError {
  error: string;
  details?: string;
}
