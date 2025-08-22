import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  MessageCircle, 
  Music, 
  Palette, 
  Settings, 
  Coins, 
  User,
  Menu,
  X
} from 'lucide-react';

const Navigation = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Menu and User Info */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {showProfile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-gray-900">
                Hii {user?.name?.split(' ')[0] || 'User'}
              </span>
            </div>
          </div>

          {/* Right: Coins and Profile */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="font-semibold text-yellow-700">{user?.coins || 0}</span>
            </div>
            
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Ad Counter */}
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-500">
            AD LEFT TODAY: 0/50
          </span>
        </div>
      </div>

      {/* Profile Sidebar */}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowProfile(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="card mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email || 'Guest User'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-gray-900">{user?.coins || 0} Coins</span>
                </div>
                <button className="btn-primary text-sm py-2 px-3">
                  Watch Ads
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 mb-6">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <span className="font-medium text-gray-700">Edit Profile</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <span className="font-medium text-gray-700">Privacy Settings</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <span className="font-medium text-gray-700">Help & Support</span>
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-primary-600' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation; 