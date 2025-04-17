// Import Firebase functions
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6T8-RBjs_6bOe_TSq7wOmB8GF6e-yj4s",
  authDomain: "calculatorv2-30a5e.firebaseapp.com",
  projectId: "calculatorv2-30a5e",
  storageBucket: "calculatorv2-30a5e.firebasestorage.app",
  messagingSenderId: "629280363819",
  appId: "1:629280363819:web:fd7ce2a6514b200087616e",
  measurementId: "G-1Q7CNKZYN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, db, analytics, firebaseConfig }; 