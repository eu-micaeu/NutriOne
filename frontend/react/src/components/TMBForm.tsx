import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TMBFormData } from '../types/index';
import './TMBForm.css';

interface TMBFormProps {
  onSubmit: (data: TMBFormData) => void;
  loading: boolean;
}

export function TMBForm({ onSubmit, loading }: TMBFormProps) {
  const [formData, setFormData] = useState<TMBFormData>({
    weight: 70,
    height: 175,
    age: 30,
    gender: 'male',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'gender' ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.weight > 0 && formData.height > 0 && formData.age > 0) {
      onSubmit(formData);
    }
  };

  return (
    <form className="tmb-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="weight" className="form-label">
          Peso (kg) <span className="required">*</span>
        </label>
        <input
          type="number"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          min="1"
          max="500"
          step="0.1"
          required
          className="form-input"
          disabled={loading}
          placeholder="Ex: 70"
        />
      </div>

      <div className="form-group">
        <label htmlFor="height" className="form-label">
          Altura (cm) <span className="required">*</span>
        </label>
        <input
          type="number"
          id="height"
          name="height"
          value={formData.height}
          onChange={handleChange}
          min="1"
          max="300"
          step="0.1"
          required
          className="form-input"
          disabled={loading}
          placeholder="Ex: 175"
        />
      </div>

      <div className="form-group">
        <label htmlFor="age" className="form-label">
          Idade (anos) <span className="required">*</span>
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min="1"
          max="150"
          required
          className="form-input"
          disabled={loading}
          placeholder="Ex: 30"
        />
      </div>

      <div className="form-group">
        <label htmlFor="gender" className="form-label">
          Sexo <span className="required">*</span>
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="form-select"
          disabled={loading}
        >
          <option value="male">Masculino</option>
          <option value="female">Feminino</option>
        </select>
      </div>

      <button
        type="submit"
        className="form-button"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Calculando...
          </>
        ) : (
          'Calcular TMB'
        )}
      </button>
    </form>
  );
}
