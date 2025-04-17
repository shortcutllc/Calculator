import { db } from '../services/firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';

// Test function to verify Firebase connection
export async function testFirebaseConnection() {
    console.log('Starting Firebase connection test...');
    try {
        // Log the db object to verify initialization
        console.log('Firestore db object:', db);

        // Try to create a test document
        const testData = {
            id: 'test-' + Date.now(),
            accessCode: 'TEST123',
            calculatorState: { test: true },
            clientSummary: { test: true },
            editableFields: ['totalHours', 'numPros'],
            createdAt: new Date()
        };

        console.log('Attempting to create test document with data:', testData);

        // Add test document
        const docRef = await addDoc(collection(db, 'proposals'), testData);
        console.log('Test document created with ID:', docRef.id);

        // Try to read it back
        const docSnap = await getDoc(doc(db, 'proposals', docRef.id));
        if (docSnap.exists()) {
            console.log('Test document read successfully:', docSnap.data());
            return true;
        } else {
            console.log('Document does not exist after creation');
            return false;
        }

    } catch (error) {
        console.error('Firebase connection test failed with error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        return false;
    }
} 