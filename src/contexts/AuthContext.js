import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create or update user profile in Firestore
  const createUserProfile = async (user, isGuest = false) => {
    const userRef = doc(db, 'users', user.uid);
    let userSnap;
    try {
      userSnap = await getDoc(userRef);
    } catch (err) {
      console.warn('Firestore offline, using cached defaults');
      // Return a minimal offline profile
      return {
        uid: user.uid,
        name: isGuest ? 'Guest User' : user.displayName || 'User',
        email: isGuest ? null : user.email,
        coins: 0,
        mood: 'happy',
        favorites: [],
      };
    }
    
    if (!userSnap.exists()) {
      const userData = {
        uid: user.uid,
        name: isGuest ? 'Guest User' : user.displayName || 'User',
        email: isGuest ? null : user.email,
        coins: 0,
        mood: 'happy',
        favorites: [],
        createdAt: new Date(),
        lastMoodUpdate: null,
        moodUpdateCount: 0
      };
      
      await setDoc(userRef, userData);
      return userData;
    }
    
    return userSnap.data();
  };

  // Google Sign In with fallback to redirect
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      return result.user;
    } catch (error) {
      // Fallback to redirect for popup blockers or COOP issues
      try {
        await signInWithRedirect(auth, provider);
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult?.user) {
          await createUserProfile(redirectResult.user);
          return redirectResult.user;
        }
      } catch (e) {
        console.error('Google sign in error:', e);
        throw e;
      }
    }
  };

  // Guest Sign In
  const signInAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      await createUserProfile(result.user, true);
      return result.user;
    } catch (error) {
      console.error('Guest sign in error:', error);
      throw error;
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Update user mood
  const updateUserMood = async (mood) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    
    // Check if user can update mood (3 times per day)
    if (userData?.lastMoodUpdate) {
      const lastUpdate = userData.lastMoodUpdate.toDate();
      const lastUpdateDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());
      
      if (lastUpdateDate.getTime() === today.getTime() && userData.moodUpdateCount >= 3) {
        throw new Error('You can only update your mood 3 times per day');
      }
    }
    
    const updateData = {
      mood,
      lastMoodUpdate: now,
      moodUpdateCount: userData?.lastMoodUpdate && 
        new Date(userData.lastMoodUpdate.toDate().getFullYear(), 
                userData.lastMoodUpdate.toDate().getMonth(), 
                userData.lastMoodUpdate.toDate().getDate()).getTime() === today.getTime()
        ? (userData.moodUpdateCount || 0) + 1
        : 1
    };
    
    await updateDoc(userRef, updateData);
    
    // Update local user state
    setUser(prev => ({
      ...prev,
      ...updateData
    }));
  };

  // Add coins to user
  const addCoins = async (amount) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      coins: (user.coins || 0) + amount
    });
    
    setUser(prev => ({
      ...prev,
      coins: (prev?.coins || 0) + amount
    }));
  };

  // Spend coins
  const spendCoins = async (amount) => {
    if (!user || (user.coins || 0) < amount) {
      throw new Error('Insufficient coins');
    }
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      coins: (user.coins || 0) - amount
    });
    
    setUser(prev => ({
      ...prev,
      coins: (prev?.coins || 0) - amount
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        let userSnap;
        try {
          userSnap = await getDoc(userRef);
        } catch (err) {
          console.warn('Offline - showing cached/temporary profile');
          setUser({ uid: user.uid, name: user.displayName || 'User', coins: 0, mood: 'happy', favorites: [] });
          setLoading(false);
          return;
        }
        
        if (userSnap.exists()) {
          setUser({ uid: user.uid, ...userSnap.data() });
        } else {
          // Create and immediately use the created profile data
          const createdData = await createUserProfile(user);
          setUser({ uid: user.uid, ...createdData });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInAsGuest,
    logout,
    updateUserMood,
    addCoins,
    spendCoins
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 