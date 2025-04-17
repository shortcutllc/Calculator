import { collection, addDoc, getDoc, doc, serverTimestamp, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase-config.js';
import { v4 as uuidv4 } from 'uuid';

export class ProposalService {
    /**
     * Generates a 6-character alphanumeric access code
     * @returns {string} The generated access code
     */
    static generateAccessCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }

    /**
     * Creates a new proposal in Firestore
     * @param {Object} calculatorState - The current state of the calculator
     * @param {Object} clientInfo - Information about the client
     * @returns {Promise<Object>} The created proposal's ID and access code
     */
    static async createProposal(calculatorState, clientInfo) {
        try {
            const accessCode = this.generateAccessCode();
            const proposalId = uuidv4();
            
            // Structure the client summary fields
            const clientSummary = {
                totalHours: calculatorState.totalHours,
                apptsPerProPerHour: calculatorState.apptsPerProPerHour,
                totalApptsPerHour: calculatorState.totalApptsPerHour,
                totalAppts: calculatorState.totalAppts,
                totalCost: calculatorState.totalCost,
                totalProRev: calculatorState.totalProRev,
                shortcutNet: calculatorState.shortcutNet,
                shortcutMargin: calculatorState.shortcutMargin
            };
            
            const proposalData = {
                id: proposalId,
                calculatorState,
                clientInfo,
                clientSummary,
                accessCode,
                createdAt: serverTimestamp(),
                viewCount: 0,
                lastViewed: null,
                editableFields: ['totalHours', 'numPros']
            };

            // Store in Firestore using the UUID as the document ID
            await addDoc(collection(db, 'proposals'), proposalData);

            return {
                proposalId,
                accessCode
            };
        } catch (error) {
            console.error('Error creating proposal:', error);
            throw error;
        }
    }

    /**
     * Retrieves a proposal from Firestore
     * @param {string} proposalId - The UUID of the proposal to retrieve
     * @param {string} accessCode - The access code for the proposal
     * @returns {Promise<Object>} The proposal data
     */
    static async getProposal(proposalId, accessCode) {
        try {
            // Query for the document with matching UUID
            const proposalsRef = collection(db, 'proposals');
            const q = query(proposalsRef, where('id', '==', proposalId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error('Proposal not found');
            }

            // Get the first (and should be only) matching document
            const proposalDoc = querySnapshot.docs[0];
            const data = proposalDoc.data();
            
            if (data.accessCode !== accessCode) {
                throw new Error('Invalid access code');
            }

            return {
                ...data,
                firestoreId: proposalDoc.id
            };
        } catch (error) {
            console.error('Error getting proposal:', error);
            throw error;
        }
    }
} 