import { useState } from 'react';
import type { TMBFormData, TMBResult } from '../types/index';
import { tmbService } from '../services/api';

interface UseTMBReturn {
  loading: boolean;
  error: string | null;
  result: TMBResult | null;
  calculateTMB: (data: TMBFormData) => Promise<void>;
  clearResult: () => void;
}

export const useTMB = (): UseTMBReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TMBResult | null>(null);

  const calculateTMB = async (data: TMBFormData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await tmbService.calculateTMB(data);
      setResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    loading,
    error,
    result,
    calculateTMB,
    clearResult,
  };
};
