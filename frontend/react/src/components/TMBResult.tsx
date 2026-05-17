import { foodService } from '../services/api';
import type { TMBResult as TMBResultType } from '../types/index';
import './TMBResult.css';

interface TMBResultProps {
  result: TMBResultType;
  onReset: () => void;
}

export function TMBResult({ result, onReset }: TMBResultProps) {
  const tmbValue = Math.round(result.tmb);

  const handleSetGoal = async (calories: number) => {
    try {
      await foodService.setCalorieGoal(calories);
      alert('Meta atualizada com sucesso! Vá para "Log Diário" para acompanhar.');
    } catch (err) {
      alert('Erro ao atualizar meta.');
    }
  };

  const activityMultipliers = {
    sedentary: {
      name: 'Sedentário',
      multiplier: 1.2,
      description: 'Pouco ou nenhum exercício. Trabalho de escritório, estilo de vida muito inativo.',
    },
    light: {
      name: 'Levemente ativo',
      multiplier: 1.375,
      description: 'Exercício 1-3 dias por semana ou atividade leve diária (caminhadas, trabalho leve).',
    },
    moderate: {
      name: 'Moderadamente ativo',
      multiplier: 1.55,
      description: 'Exercício 3-5 dias por semana ou trabalho que exige atividade física moderada.',
    },
    veryActive: {
      name: 'Muito ativo',
      multiplier: 1.725,
      description: 'Exercício intenso 6-7 dias por semana ou trabalho fisicamente exigente.',
    },
  };

  return (
    <div className="tmb-result-container">
      <div className="result-card main-result">
        
        <div className="result-value">
          <span className="tmb-number">{tmbValue}</span>
          <span className="tmb-unit">kcal/dia</span>
        </div>

        <p className="result-description">{result.message}</p>
        <button className="set-goal-btn" onClick={() => handleSetGoal(tmbValue)}>
          Definir como meta
        </button>
      </div>

      <div className="activity-multipliers">
        <h3>Necessidade Calórica Diária por Nível de Atividade</h3>
        <div className="multipliers-grid">
          {Object.entries(activityMultipliers).map(([key, { name, multiplier, description }]) => {
            const calories = Math.round(tmbValue * multiplier);
            return (
              <div key={key} className="multiplier-card" title={description}>
                <p className="activity-name">{name}</p>
                <p className="activity-description">{description}</p>
                <p className="activity-calories">{calories} kcal</p>
                <span className="multiplier-factor">×{multiplier}</span>
                <button className="set-goal-btn-small" onClick={() => handleSetGoal(calories)}>
                  Usar esta meta
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <button className="reset-button" onClick={onReset}>
        ↻ Fazer outro cálculo
      </button>
    </div>
  );
}
