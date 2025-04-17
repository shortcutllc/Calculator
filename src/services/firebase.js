// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firestore (needed for proposal service)
const db = getFirestore(app);

// Initialize Analytics
const analytics = getAnalytics(app);

export { app, analytics, db, firebaseConfig }; 