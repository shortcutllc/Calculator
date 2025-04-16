import { db } from './firebase-config.js';
import { collection, addDoc, getDoc, updateDoc, doc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export class ProposalService {
    static generateAccessCode() {
        // Generate a 6-character alphanumeric code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }

    static async createProposal(calculatorState, clientInfo) {
        try {
            const accessCode = this.generateAccessCode();
            const proposalData = {
                calculatorState,
                clientInfo,
                accessCode,
                createdAt: serverTimestamp(),
                viewCount: 0,
                lastViewed: null
            };

            const docRef = await addDoc(collection(db, 'proposals'), proposalData);
            return {
                proposalId: docRef.id,
                accessCode
            };
        } catch (error) {
            console.error('Error creating proposal:', error);
            throw error;
        }
    }

    static async getProposal(proposalId, accessCode) {
        try {
            const proposalRef = doc(db, 'proposals', proposalId);
            const proposalDoc = await getDoc(proposalRef);

            if (!proposalDoc.exists()) {
                throw new Error('Proposal not found');
            }

            const data = proposalDoc.data();
            if (data.accessCode !== accessCode) {
                throw new Error('Invalid access code');
            }

            // Update view count and last viewed timestamp
            await updateDoc(proposalRef, {
                viewCount: (data.viewCount || 0) + 1,
                lastViewed: serverTimestamp()
            });

            return {
                ...data,
                id: proposalDoc.id
            };
        } catch (error) {
            console.error('Error getting proposal:', error);
            throw error;
        }
    }
} 