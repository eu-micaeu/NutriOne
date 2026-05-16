import './Header.css';
import type { SessionView } from '../types/index';

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-logo-section">
            <img src="/icon.png" alt="NutriOne" className="header-logo" />
            <h1 className="header-title">NutriOne</h1>
          </div>
          <p className="header-subtitle">Calculadora de TMB</p>
        </div>
      </div>
    </header>
  );
}
