import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Prefer .env, fallback to provided project keys
const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAnlGPpc_H6wBzXC9oiqZmNRR9prMt8bAI',
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'mannkibaatai.firebaseapp.com',
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'mannkibaatai',
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'mannkibaatai.appspot.com',
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '282851278099',
	appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:282851278099:web:28e39dea88f1f4284e6ee6',
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-1E4C7NFC63',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore with offline cache (fallback if not supported)
let db;
try {
	db = initializeFirestore(app, {
		localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
		experimentalAutoDetectLongPolling: true,
		useFetchStreams: false
	});
} catch (e) {
	// Fallback without persistence (e.g., private mode)
	db = getFirestore(app);
}

// Initialize Firebase services
export const auth = getAuth(app);
export { db };
export const storage = getStorage(app);

export default app; 