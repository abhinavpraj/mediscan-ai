import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { api } from './services/api';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const [authenticated, setAuthenticated] = useState(api.isAuthenticated());
  const { dark, setDark } = useTheme();

  if (!authenticated) {
    return <Login onLogin={async (username, password) => { await api.login(username, password); setAuthenticated(true); }} />;
  }

  return <Dashboard dark={dark} setDark={setDark} onLogout={() => { api.logout(); setAuthenticated(false); }} />;
}
