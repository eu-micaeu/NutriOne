import React, { useState, useEffect } from 'react';
import { foodService } from '../services/api';
import type { DailyLog as DailyLogType, FoodEntry } from '../types';
import './DailyLog.css';

export const DailyLog: React.FC = () => {
  const [log, setLog] = useState<DailyLogType | null>(null);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLog = async () => {
    try {
      const data = await foodService.getDailyLog();
      setLog(data);
    } catch (err) {
      setError('Erro ao carregar o log diário');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
  }, []);

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !calories) return;

    try {
      await foodService.addFoodEntry(foodName, parseFloat(calories));
      setFoodName('');
      setCalories('');
      fetchLog();
    } catch (err) {
      setError('Erro ao adicionar alimento');
    }
  };

  const handleDeleteFood = async (id: string) => {
    try {
      await foodService.deleteFoodEntry(id);
      fetchLog();
    } catch (err) {
      setError('Erro ao remover alimento');
    }
  };

  const handleUpdateGoal = async () => {
    if (!newGoal) return;
    try {
      await foodService.setCalorieGoal(parseFloat(newGoal));
      setIsEditingGoal(false);
      setNewGoal('');
      fetchLog();
    } catch (err) {
      setError('Erro ao atualizar meta');
    }
  };

  if (loading) return <div className="daily-log">Carregando...</div>;

  const total = log?.total || 0;
  const goal = log?.goal || 2000;
  const percent = Math.min((total / goal) * 100, 100);
  const remaining = goal - total;

  return (
    <div className="daily-log">
      <h2>Log de Alimentação</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="goal-section">
        <div className="goal-display">
          <span>Meta Diária:</span>
          <span className="goal-value">{goal} kcal</span>
          <button className="small-btn" onClick={() => setIsEditingGoal(!isEditingGoal)}>
            {isEditingGoal ? 'Cancelar' : 'Alterar Meta'}
          </button>
        </div>

        {isEditingGoal && (
          <div className="goal-input-group">
            <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Nova meta"
            />
            <button className="small-btn" onClick={handleUpdateGoal}>Salvar</button>
          </div>
        )}

        <div className="progress-container">
          <div 
            className={`progress-bar ${total > goal ? 'over-limit' : ''}`} 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <div className="goal-summary">
          <span>Consumido: {total} kcal</span>
          <span style={{ float: 'right' }}>
            {remaining >= 0 ? `Faltam: ${remaining} kcal` : `Excedeu: ${Math.abs(remaining)} kcal`}
          </span>
        </div>
      </div>

      <form className="add-food-form" onSubmit={handleAddFood}>
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="O que você comeu?"
          required
        />
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="Kcal"
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      <div className="food-list-container">
        <h3>Alimentos de Hoje</h3>
        {(!log || !log.entries || log.entries.length === 0) ? (
          <p className="empty-state">Nenhum alimento registrado hoje.</p>
        ) : (
          <ul className="food-list">
            {log.entries.map((entry: FoodEntry) => (
              <li key={entry.id} className="food-item">
                <div className="food-info">
                  <span className="food-name">{entry.name}</span>
                  <span className="food-calories">{entry.calories} kcal</span>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteFood(entry.id)}>
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
