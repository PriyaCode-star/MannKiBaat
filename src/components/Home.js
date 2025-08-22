import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Music, 
  MessageCircle, 
  Heart, 
  Sparkles, 
  Play, 
  ChevronRight,
  Palette,
  Coins
} from 'lucide-react';

const Home = () => {
  const { user, updateUserMood, addCoins } = useAuth();
  const [selectedMood, setSelectedMood] = useState(user?.mood || 'happy');

  const moods = [
    { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-100 text-blue-800' },
    { id: 'angry', label: 'Angry', emoji: '😠', color: 'bg-red-100 text-red-800' },
    { id: 'lonely', label: 'Lonely', emoji: '😔', color: 'bg-gray-100 text-gray-800' },
    { id: 'excited', label: 'Excited', emoji: '🤩', color: 'bg-orange-100 text-orange-800' },
    { id: 'romantic', label: 'Romantic', emoji: '🥰', color: 'bg-pink-100 text-pink-800' },
    { id: 'funny', label: 'Funny', emoji: '😄', color: 'bg-green-100 text-green-800' },
    { id: 'depressed', label: 'Depressed', emoji: '😞', color: 'bg-purple-100 text-purple-800' },
  ];

  const handleMoodChange = async (mood) => {
    try {
      await updateUserMood(mood);
      setSelectedMood(mood);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleWatchAd = () => {
    // Simulate watching an ad
    alert('Ad playing... (Simulated)');
    setTimeout(() => {
      addCoins(10);
      alert('+10 coins earned!');
    }, 2000);
  };

  return (
    <div className="pb-20 px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-gray-600">How are you feeling today?</p>
      </div>

      {/* Mood Picker */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 text-red-500 mr-2" />
          Today's Mood
        </h2>
        
        <div className="grid grid-cols-4 gap-3 mb-4">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodChange(mood.id)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                selectedMood === mood.id 
                  ? 'ring-2 ring-primary-500 bg-primary-50' 
                  : mood.color
              }`}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs font-medium">{mood.label}</div>
            </button>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 text-center">
          You can change your mood 3 times per day
        </p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        
        {/* Chat Section */}
        <div className="card bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Chill Bhaiya/Didi AI Chat</h3>
                <p className="text-sm text-gray-600">Get funny roasts & emotional support</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Music Section */}
        <div className="card bg-gradient-to-r from-accent-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mood-Based Music</h3>
                <p className="text-sm text-gray-600">Songs that match your current mood</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Theme & Customization */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Palette className="w-5 h-5 text-purple-500 mr-2" />
          Theme Customization
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="font-medium text-gray-700">Current Theme</span>
            <span className="text-sm text-gray-500">Chocolate Theme</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="font-medium text-gray-700">Color Scheme</span>
            <button className="btn-secondary text-sm py-1 px-3">
              Change
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="font-medium text-gray-700">Background Music</span>
            <button className="btn-secondary text-sm py-1 px-3">
              Choose Songs
            </button>
          </div>
        </div>
      </div>

      {/* Coins & Rewards */}
      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Coins className="w-5 h-5 text-yellow-600 mr-2" />
          Earn Coins
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Watch Ads</span>
            <button 
              onClick={handleWatchAd}
              className="btn-primary text-sm py-2 px-4"
            >
              Watch Ad (+10 coins)
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>• Unlock 1 song = 30 coins</p>
            <p>• Unlock theme = 50 coins</p>
            <p>• Unlock profile photo = 100 coins</p>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
          Go Pro
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-xl">
            <div>
              <h4 className="font-semibold text-gray-900">Basic Plan</h4>
              <p className="text-sm text-gray-600">1 Month access</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">₹29</div>
              <button className="btn-primary text-sm py-1 px-3">
                Subscribe
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-xl">
            <div>
              <h4 className="font-semibold text-gray-900">Premium Plan</h4>
              <p className="text-sm text-gray-600">1 Month full access</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">₹49</div>
              <button className="btn-primary text-sm py-1 px-3">
                Subscribe
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-white">
            <div>
              <h4 className="font-semibold">Full Access Plan</h4>
              <p className="text-sm opacity-90">6 Months + Ex Roast Mode</p>
            </div>
            <div className="text-right">
              <div className="font-bold">₹69</div>
              <button className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-1 px-3 rounded-lg transition-colors">
                Go Pro!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 