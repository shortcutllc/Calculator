import { collection, addDoc, getDoc, doc, serverTimestamp, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
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
                createdAt: serverTimestamp(),
                viewCount: 0,
                lastViewed: null,
                editableFields,
                isMultiDay: calculatorState.eventType === 'multi'
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
                firestoreId: proposalDoc.id // Include the Firestore document ID for future updates
            };
        } catch (error) {
            console.error('Error getting proposal:', error);
            throw error;
        }
    }

    /**
     * Updates a proposal's editable fields and recalculates results
     * @param {string} proposalId - The UUID of the proposal to update
     * @param {Object} updates - The fields to update
     * @returns {Promise<Object>} The updated proposal data
     */
    static async updateProposal(proposalId, updates) {
        try {
            // First get the document by UUID
            const proposalsRef = collection(db, 'proposals');
            const q = query(proposalsRef, where('id', '==', proposalId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error('Proposal not found');
            }

            const proposalDoc = querySnapshot.docs[0];
            const data = proposalDoc.data();
            
            // Verify only editable fields are being updated
            const invalidFields = Object.keys(updates).filter(
                field => !data.editableFields.includes(field)
            );

            if (invalidFields.length > 0) {
                throw new Error(`Cannot update non-editable fields: ${invalidFields.join(', ')}`);
            }

            // Update the calculator state with new values
            const newCalculatorState = {
                ...data.calculatorState,
                ...updates
            };

            // Recalculate the results based on the new values
            const newClientSummary = await this.recalculateResults(newCalculatorState);

            // Update using the Firestore document ID
            await updateDoc(doc(db, 'proposals', proposalDoc.id), {
                calculatorState: newCalculatorState,
                clientSummary: newClientSummary,
                lastUpdated: serverTimestamp()
            });

            return {
                ...data,
                calculatorState: newCalculatorState,
                clientSummary: newClientSummary,
                firestoreId: proposalDoc.id
            };
        } catch (error) {
            console.error('Error updating proposal:', error);
            throw error;
        }
    }

    /**
     * Recalculates results based on updated calculator state
     * @param {Object} calculatorState - The current calculator state
     * @returns {Promise<Object>} The recalculated client summary
     */
    static async recalculateResults(calculatorState) {
        const {
            isMultiDay,
            totalHours,
            numPros,
            hourlyRate,
            serviceType,
            retouchingCost,
            days // for multi-day calculations
        } = calculatorState;

        if (isMultiDay) {
            return this.calculateMultiDayResults(calculatorState);
        }

        // Single day calculations
        const apptsPerProPerHour = this.getAppointmentsPerHour(serviceType);
        const totalApptsPerHour = apptsPerProPerHour * numPros;
        const totalAppts = totalApptsPerHour * totalHours;
        
        let totalCost = totalHours * hourlyRate * numPros;
        if (serviceType === 'headshot' && retouchingCost) {
            totalCost += (totalAppts * retouchingCost);
        }

        return {
            totalHours,
            apptsPerProPerHour,
            totalApptsPerHour,
            totalAppts,
            totalCost
        };
    }

    /**
     * Calculates results for multi-day events
     * @param {Object} calculatorState - The calculator state with days data
     * @returns {Object} The calculated client summary
     */
    static calculateMultiDayResults(calculatorState) {
        const { days } = calculatorState;
        
        let totalHours = 0;
        let totalAppts = 0;
        let totalCost = 0;
        let totalApptsPerHour = 0;
        
        // Calculate totals across all days
        days.forEach(day => {
            const apptsPerProPerHour = this.getAppointmentsPerHour(day.serviceType);
            const dayTotalApptsPerHour = apptsPerProPerHour * day.numPros;
            const dayTotalAppts = dayTotalApptsPerHour * day.totalHours;
            
            let dayCost = day.totalHours * day.hourlyRate * day.numPros;
            if (day.serviceType === 'headshot' && day.retouchingCost) {
                dayCost += (dayTotalAppts * day.retouchingCost);
            }

            totalHours += day.totalHours;
            totalAppts += dayTotalAppts;
            totalCost += dayCost;
            totalApptsPerHour += dayTotalApptsPerHour;
        });

        // Average appointments per pro per hour across all days
        const avgApptsPerProPerHour = totalApptsPerHour / days.length;

        return {
            totalHours,
            apptsPerProPerHour: avgApptsPerProPerHour,
            totalApptsPerHour,
            totalAppts,
            totalCost
        };
    }

    /**
     * Gets the number of appointments possible per hour based on service type
     * @param {string} serviceType - The type of service
     * @returns {number} The number of appointments per hour
     */
    static getAppointmentsPerHour(serviceType) {
        const appointmentsPerHour = {
            'massage/spa': 1,
            'hair/nails': 2,
            'headshot': 12,
            'group-fitness': 20
        };
        return appointmentsPerHour[serviceType] || 1;
    }
} 