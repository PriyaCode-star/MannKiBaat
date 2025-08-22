import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Chat from './components/Chat';
import Music from './components/Music';
import ThemeShop from './components/ThemeShop';
import Settings from './components/Settings';

const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'home' && <Home />}
      {activeTab === 'chat' && <Chat />}
      {activeTab === 'music' && <Music />}
      {activeTab === 'themes' && <ThemeShop />}
      {activeTab === 'settings' && <Settings />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
