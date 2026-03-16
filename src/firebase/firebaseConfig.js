import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDYzFwUf5aRkAfXYLJR5LgcbMXCis2VjSA',
  authDomain: 'worship-playlist-844c8.firebaseapp.com',
  projectId: 'worship-playlist-844c8',
  storageBucket: 'worship-playlist-844c8.firebasestorage.app',
  messagingSenderId: '466401328985',
  appId: '1:466401328985:web:530bf821cb9ed230b4d648'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
