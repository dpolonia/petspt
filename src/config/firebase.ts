import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'petspt.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'petspt',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'petspt.appspot.com',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
