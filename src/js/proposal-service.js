import { v4 as uuidv4 } from 'uuid';

export class ProposalService {
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
            
            // Define which fields can be edited by the client
            const editableFields = ['totalHours', 'numPros'];

            // Structure the client summary fields
            const clientSummary = {
                totalHours: calculatorState.totalHours,
                apptsPerProPerHour: calculatorState.apptsPerProPerHour,
                totalApptsPerHour: calculatorState.totalApptsPerHour,
                totalAppts: calculatorState.totalAppts,
                totalCost: calculatorState.totalCost
            };
            
            const proposalData = {
                id: proposalId,
                calculatorState,
                clientInfo,
                clientSummary,
                accessCode,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                viewCount: 0,
                lastViewed: null,
                editableFields,
                isMultiDay: calculatorState.eventType === 'multi'
            };

            // Store in Firestore
            await firebase.firestore().collection('proposals').doc(proposalId).set(proposalData);

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
     * @param {string} proposalId - The ID of the proposal to retrieve
     * @param {string} accessCode - The access code for the proposal
     * @returns {Promise<Object>} The proposal data
     */
    static async getProposal(proposalId, accessCode) {
        try {
            const doc = await firebase.firestore().collection('proposals').doc(proposalId).get();

            if (!doc.exists) {
                throw new Error('Proposal not found');
            }

            const data = doc.data();
            
            if (data.accessCode !== accessCode) {
                throw new Error('Invalid access code');
            }

            return {
                ...data,
                id: doc.id
            };
        } catch (error) {
            console.error('Error getting proposal:', error);
            throw error;
        }
    }

    /**
     * Generates a 6-character alphanumeric access code
     * @returns {string} The generated access code
     */
    static generateAccessCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }
} 