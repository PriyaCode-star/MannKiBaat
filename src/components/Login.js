import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Music, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = () => {
  const { signInWithGoogle, signInAsGuest, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in failed:', error);
      alert('Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setLoading(true);
      await signInAsGuest();
    } catch (error) {
      console.error('Guest sign in failed:', error);
      alert('Guest sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* App Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl mb-4 shadow-glow">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mann Ki Baat AI</h1>
          <p className="text-gray-600">Your personal AI companion for every mood</p>
        </div>

        {/* Features Preview */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">What you'll get:</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-gray-700">Chill Bhaiya/Didi AI Chat</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                <Music className="w-4 h-4 text-accent-600" />
              </div>
              <span className="text-gray-700">Mood-based Music Jukebox</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700">Daily Mood Tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-700">Beautiful Themes & Rewards</span>
            </div>
          </div>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 transition-all duration-200 shadow-soft"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            onClick={handleGuestSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-soft hover:shadow-glow"
          >
            <span>Try as Guest</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>By continuing, you agree to our Terms of Service</p>
          <p className="mt-1">and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 