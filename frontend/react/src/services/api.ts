import type { APIError, TMBFormData, TMBResult, DailyLog, FoodEntry, User, RegistrationFormData } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const userId = localStorage.getItem('userId');
  return {
    'Content-Type': 'application/json',
    ...(userId ? { 'X-User-ID': userId } : {}),
  };
};

export const userService = {
  async register(data: RegistrationFormData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao registrar usuário');
    const user: User = await response.json();
    localStorage.setItem('userId', user.id);
    return user;
  },

  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao realizar login');
    }
    const user: User = await response.json();
    localStorage.setItem('userId', user.id);
    return user;
  },

  async getProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar perfil');
    return await response.json();
  },
};

export const foodService = {
  async getDailyLog(date?: string): Promise<DailyLog> {
    const url = date ? `${API_BASE_URL}/food/log?date=${date}` : `${API_BASE_URL}/food/log`;
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Erro ao buscar log diário');
    return await response.json();
  },

  async addFoodEntry(name: string, calories: number): Promise<FoodEntry> {
    const response = await fetch(`${API_BASE_URL}/food/log`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, calories }),
    });
    if (!response.ok) throw new Error('Erro ao adicionar alimento');
    return await response.json();
  },

  async deleteFoodEntry(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/food/log/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao excluir alimento');
  },

  async setCalorieGoal(goal: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/food/goal`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ goal }),
    });
    if (!response.ok) throw new Error('Erro ao definir meta');
  },
};

export const tmbService = {
  async calculateTMB(data: TMBFormData): Promise<TMBResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/tmb/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: APIError = await response.json();
        throw new Error(error.error || 'Erro ao calcular TMB');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro na comunicação com o servidor');
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};
