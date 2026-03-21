import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'petspt-f019f.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'petspt-f019f',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'petspt-f019f.firebasestorage.app',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
