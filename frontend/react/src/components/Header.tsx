import './Header.css';
import type { SessionView } from '../types/index';

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <h1 className="header-title">🍎 NutriOne</h1>
          <p className="header-subtitle">Calculadora de TMB</p>
        </div>
      </div>
    </header>
  );
}
