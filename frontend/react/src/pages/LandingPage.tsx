import React, { useState } from 'react';
import { userService } from '../services/api';
import { Modal } from '../components/Modal';
import type { RegistrationFormData, SessionView } from '../types';
import './LandingPage.css';

interface LandingPageProps {
  onRegister: (view: SessionView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onRegister }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    password: '',
    age: 0,
    weight: 0,
    height: 0,
    gender: 'male',
    goalType: 'maintenance',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (authMode === 'register') {
        await userService.register(formData);
      } else {
        await userService.login(loginEmail, loginPassword);
      }
      onRegister('dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? parseFloat(value) : value
    }));
  };

  const setGoalType = (type: 'loss' | 'maintenance' | 'gain') => {
    setFormData(prev => ({ ...prev, goalType: type }));
  };

  const openModal = (mode: 'register' | 'login') => {
    setAuthMode(mode);
    setIsModalOpen(true);
    setError(null);
  };

  return (
    <div className="landing-page">
      <section className="hero-section">
        <img src="/icon.png" alt="NutriOne Logo" className="landing-logo" />
        <h1>Transforme sua Nutrição</h1>
        <p>Acompanhe suas calorias, calcule seu metabolismo e alcance suas metas de forma inteligente e minimalista.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem' }}>
          <button 
            className="submit-btn" 
            style={{ maxWidth: '250px' }}
            onClick={() => openModal('register')}
          >
            Começar agora
          </button>
          <button 
            className="submit-btn" 
            style={{ maxWidth: '250px', background: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            onClick={() => openModal('login')}
          >
            Entrar
          </button>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-item">
          <span className="feature-icon">📊</span>
          <h3>Cálculo Preciso</h3>
          <p>Utilizamos a fórmula de Mifflin-St Jeor para determinar sua taxa metabólica com precisão científica.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🍎</span>
          <h3>Log Inteligente</h3>
          <p>Registre suas refeições de forma rápida e acompanhe seu progresso calórico ao longo do dia.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🎯</span>
          <h3>Metas Flexíveis</h3>
          <p>Defina objetivos personalizados, seja para perda de peso, manutenção ou ganho de massa muscular.</p>
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="auth-modal-content">
          <div className="auth-toggle">
            <button 
              className={`auth-toggle-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => setAuthMode('register')}
            >
              Criar Conta
            </button>
            <button 
              className={`auth-toggle-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              Já tenho conta
            </button>
          </div>

          {error && <div className="error-message" style={{ color: 'var(--danger)', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {authMode === 'register' ? (
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nome Completo</label>
                  <input type="text" name="name" required placeholder="Seu nome" onChange={handleChange} />
                </div>
                <div className="form-group full-width">
                  <label>E-mail</label>
                  <input type="email" name="email" required placeholder="seu@email.com" onChange={handleChange} />
                </div>
                <div className="form-group full-width">
                  <label>Senha</label>
                  <input type="password" name="password" required placeholder="Mínimo 6 caracteres" onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Idade</label>
                  <input type="number" name="age" required placeholder="Ex: 25" onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Gênero</label>
                  <select name="gender" onChange={handleChange} value={formData.gender}>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Peso (kg)</label>
                  <input type="number" step="0.1" name="weight" required placeholder="Ex: 70.5" onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Altura (cm)</label>
                  <input type="number" name="height" required placeholder="Ex: 175" onChange={handleChange} />
                </div>
                <div className="form-group full-width">
                  <label>Qual é o seu objetivo?</label>
                  <div className="goal-options">
                    <div 
                      className={`goal-option ${formData.goalType === 'loss' ? 'active' : ''}`}
                      onClick={() => setGoalType('loss')}
                    >
                      Perder Peso
                    </div>
                    <div 
                      className={`goal-option ${formData.goalType === 'maintenance' ? 'active' : ''}`}
                      onClick={() => setGoalType('maintenance')}
                    >
                      Manter Peso
                    </div>
                    <div 
                      className={`goal-option ${formData.goalType === 'gain' ? 'active' : ''}`}
                      onClick={() => setGoalType('gain')}
                    >
                      Ganhar Massa
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="login-form">
                <div className="form-group">
                  <label>E-mail</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="seu@email.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)} 
                  />
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Senha</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="Sua senha" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)} 
                  />
                </div>
              </div>
            )}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (authMode === 'register' ? 'Cadastrando...' : 'Entrando...') : (authMode === 'register' ? 'Criar minha conta' : 'Acessar minha conta')}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
