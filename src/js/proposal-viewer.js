import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config.js';
import { ProposalService } from './proposal-service.js';

class ProposalViewer {
    constructor() {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        this.proposalId = this.getProposalIdFromUrl();
        this.currentProposal = null;
        this.setupEventListeners();
    }

    getProposalIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    setupEventListeners() {
        const viewProposalButton = document.getElementById('view-proposal');
        if (viewProposalButton) {
            viewProposalButton.addEventListener('click', () => this.handleViewProposal());
        }

        // Add enter key support for access code input
        const accessCodeInput = document.getElementById('access-code-input');
        if (accessCodeInput) {
            accessCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleViewProposal();
                }
            });
        }
    }

    setupEditableFields() {
        const totalHoursInput = document.getElementById('total-hours');
        const numProsInput = document.getElementById('num-pros');
        const recalculateButton = document.getElementById('recalculate');

        if (totalHoursInput && numProsInput) {
            [totalHoursInput, numProsInput].forEach(input => {
                input.addEventListener('input', (e) => {
                    if (e.target.value < 1) e.target.value = 1;
                });
            });
        }

        if (recalculateButton) {
            recalculateButton.addEventListener('click', () => this.handleRecalculate());
        }
    }

    async handleViewProposal() {
        const accessCodeInput = document.getElementById('access-code-input');
        const errorElement = document.getElementById('access-error');
        const accessCode = accessCodeInput?.value.toUpperCase();

        if (!this.proposalId || !accessCode) {
            if (errorElement) errorElement.textContent = 'Please enter an access code';
            return;
        }

        try {
            const proposal = await ProposalService.getProposal(this.proposalId, accessCode);
            
            this.currentProposal = proposal;
            this.displayProposal(proposal);
            this.setupEditableFields();
        } catch (error) {
            console.error('Error getting proposal:', error);
            if (errorElement) {
                errorElement.textContent = 'Failed to load proposal. Please try again.';
            }
        }
    }

    async handleRecalculate() {
        const totalHours = parseInt(document.getElementById('total-hours').value) || 1;
        const numPros = parseInt(document.getElementById('num-pros').value) || 1;
        const ratePerHour = this.currentProposal.calculatorState.ratePerProPerHour;

        // Calculate new total cost
        const totalCost = totalHours * numPros * ratePerHour;

        // Update the display
        document.getElementById('display-total-cost').textContent = this.formatCurrency(totalCost);
        
        try {
            // Update the proposal in Firebase
            const updatedProposal = await ProposalService.updateProposal(
                this.proposalId,
                {
                    totalHours,
                    numPros
                }
            );
            
            this.currentProposal = updatedProposal;
            document.getElementById('update-success').textContent = 'Changes saved successfully!';
            setTimeout(() => {
                document.getElementById('update-success').textContent = '';
            }, 3000);
        } catch (error) {
            console.error('Error updating proposal:', error);
            document.getElementById('update-error').textContent = 'Failed to save changes. Please try again.';
        }
    }

    displayProposal(proposal) {
        const accessForm = document.querySelector('.access-form');
        const proposalSummary = document.getElementById('proposal-summary');
        
        if (accessForm) accessForm.style.display = 'none';
        if (proposalSummary) {
            proposalSummary.style.display = 'block';
            proposalSummary.innerHTML = `
                <div class="proposal-content">
                    <h2>Proposal Details</h2>
                    <div class="client-info">
                        <p><strong>Client:</strong> ${proposal.clientInfo.name}</p>
                        <p><strong>Email:</strong> ${proposal.clientInfo.email}</p>
                        <p><strong>Phone:</strong> ${proposal.clientInfo.phone || 'Not provided'}</p>
                    </div>
                    <div class="service-details">
                        <h3>Service Configuration</h3>
                        <p><strong>Service Type:</strong> ${proposal.calculatorState.serviceType}</p>
                        <div class="editable-fields">
                            <div class="form-group">
                                <label for="total-hours">Total Hours:</label>
                                <input type="number" id="total-hours" min="1" value="${proposal.calculatorState.totalHours}">
                            </div>
                            <div class="form-group">
                                <label for="num-pros">Number of Professionals:</label>
                                <input type="number" id="num-pros" min="1" value="${proposal.calculatorState.numPros}">
                            </div>
                            <button id="recalculate" class="btn btn-secondary">Update Calculations</button>
                            <p id="update-success" class="success-message"></p>
                            <p id="update-error" class="error-message"></p>
                        </div>
                        <p><strong>Total Cost:</strong> <span id="display-total-cost">${this.formatCurrency(proposal.calculatorState.totalCost)}</span></p>
                    </div>
                </div>
            `;
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
}

// Initialize the proposal viewer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ProposalViewer();
}); 