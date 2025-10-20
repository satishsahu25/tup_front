import { initializeApp } from 'firebase/app';

const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "theunfoldedpassport.firebaseapp.com",
  projectId: "theunfoldedpassport",
  storageBucket: "theunfoldedpassport.firebasestorage.app",
  messagingSenderId: "153318599819",
  appId: "1:153318599819:web:577cebc2cd0563f4aab88e",
  measurementId: 'G-ZE519BLXXV'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
