// Import the functions you need from the SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCC1gUxtUx8uVRiEP-ABSvhBVQB3uybDfQ",
    authDomain: "shortcut-calculator.firebaseapp.com",
    projectId: "shortcut-calculator",
    storageBucket: "shortcut-calculator.firebasestorage.app",
    messagingSenderId: "96817517648",
    appId: "1:96817517648:web:3cc778f0ac0b9963973702",
    measurementId: "G-9E44SK75DW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Proposal Functions
export async function saveProposal(proposalData) {
    try {
        const docRef = await addDoc(collection(db, "proposals"), {
            ...proposalData,
            createdAt: new Date().toISOString(),
            status: 'pending'
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving proposal: ", error);
        throw error;
    }
}

export async function getProposal(proposalId, accessCode) {
    try {
        const docRef = doc(db, "proposals", proposalId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().accessCode === accessCode) {
            return docSnap.data();
        } else {
            throw new Error("Invalid proposal ID or access code");
        }
    } catch (error) {
        console.error("Error getting proposal: ", error);
        throw error;
    }
}

export { db }; 