import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useIdentity } from './hooks/useIdentity';
import Welcome from './pages/Welcome';
import CreateIdentity from './pages/CreateIdentity';
import RestoreIdentity from './pages/RestoreIdentity';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import './styles/global.css';

export default function App() {
  const { identity, loading, register, logout } = useIdentity();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#5a5a64' }}>
        Инициализация узла...
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {!identity ? (
          <>
            <Route path="/" element={<Welcome />} />
            <Route path="/create" element={<CreateIdentity onRegister={register} />} />
            <Route path="/restore" element={<RestoreIdentity onRegister={register} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/chat" element={<ChatList identity={identity} onLogout={logout} />} />
            <Route path="/chat/:contactId" element={<ChatRoom identity={identity} />} />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </>
        )}
      </Routes>
    </HashRouter>
  );
}
