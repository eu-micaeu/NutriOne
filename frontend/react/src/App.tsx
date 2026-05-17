import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Dashboard } from './pages/Dashboard'
import { LandingPage } from './pages/LandingPage'
import { userService } from './services/api'
import type { SessionView, User } from './types'
import './App.css'

function App() {
  const [view, setView] = useState<SessionView>('landing')
  const [user, setUser] = useState<User | null>(null)

  const fetchProfile = async () => {
    try {
      const profile = await userService.getProfile();
      setUser(profile);
      setView('dashboard');
    } catch (err) {
      localStorage.removeItem('userId');
      setView('landing');
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchProfile();
    }
  }, []);

  const handleAuthSuccess = () => {
    fetchProfile();
  };

  const renderView = () => {
    if (view === 'landing') {
      return <LandingPage onRegister={handleAuthSuccess} />;
    }
    return <Dashboard user={user} />;
  };

  return (
    <div className="app">
      {view !== 'landing' && <Header currentView={view} onViewChange={setView} />}
      <div className="app-content">
        {renderView()}
      </div>
      <Footer />
    </div>
  )
}

export default App
