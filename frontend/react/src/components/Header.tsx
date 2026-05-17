import './Header.css';
import type { SessionView } from '../types/index';

interface HeaderProps {
  currentView: SessionView;
  onViewChange: (view: SessionView) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-logo-section">
            <img src="/icon.png" alt="NutriOne" className="header-logo" />
            <h1 className="header-title">NutriOne</h1>
          </div>
          <nav className="header-actions">
            <button 
              className={`session-button ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => onViewChange('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className="session-button logout-btn"
              onClick={() => {
                localStorage.removeItem('userId');
                window.location.reload();
              }}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sair</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
