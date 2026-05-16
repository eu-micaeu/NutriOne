import type { APIError, TMBFormData, TMBResult } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
