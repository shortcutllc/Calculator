import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';

export class ProposalService {
    constructor(db) {
        if (!db) {
            throw new Error('Firestore database instance is required');
        }
        this.db = db;
    }

    generateAccessCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    async createProposal({ calculatorState, clientInfo, editableFields = [] }) {
        try {
            const accessCode = this.generateAccessCode();
            const createdAt = new Date();
            
            // Create a reference to the proposals collection
            const proposalsCollectionRef = collection(this.db, 'proposals');
            
            // Add the document to the collection
            const docRef = await addDoc(proposalsCollectionRef, {
                calculatorState,
                clientInfo,
                accessCode,
                editableFields,
                createdAt,
                updatedAt: createdAt
            });

            return {
                id: docRef.id,
                accessCode
            };
        } catch (error) {
            console.error('Error creating proposal:', error);
            throw error;
        }
    }

    async getProposal(proposalId) {
        try {
            const docRef = doc(this.db, 'proposals', proposalId);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                throw new Error('Proposal not found');
            }

            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } catch (error) {
            console.error('Error getting proposal:', error);
            throw error;
        }
    }

    async updateProposal(proposalId, accessCode, updates) {
        try {
            const docRef = doc(this.db, 'proposals', proposalId);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                throw new Error('Proposal not found');
            }

            const proposal = docSnap.data();
            if (proposal.accessCode !== accessCode) {
                throw new Error('Invalid access code');
            }

            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date()
            });

            const updatedDocSnap = await getDoc(docRef);
            return {
                id: updatedDocSnap.id,
                ...updatedDocSnap.data()
            };
        } catch (error) {
            console.error('Error updating proposal:', error);
            throw error;
        }
    }
} 