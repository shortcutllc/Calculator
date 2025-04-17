import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../firebase-config.js';
import { ProposalService } from '../proposal-service.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const proposalService = new ProposalService(db);

// Service Rate Constants
const SERVICE_RATES = {
    massage: 135,  // Massage & Spa rate
    hair: 135,     // Hair & Nails rate
    headshots: 400 // Headshots rate
};

// Other Constants
const APPOINTMENTS_PER_PRO_PER_HOUR = 4;

// DOM Elements
const clientNameInput = document.getElementById('client-name');
const clientEmailInput = document.getElementById('client-email');
const clientPhoneInput = document.getElementById('client-phone');
const serviceTypeSelect = document.getElementById('service-type');
const customRateGroup = document.getElementById('custom-rate-group');
const customRateInput = document.getElementById('custom-rate');
const totalHoursInput = document.getElementById('total-hours');
const numProsInput = document.getElementById('num-pros');
const calculateButton = document.getElementById('calculate');
const createProposalButton = document.getElementById('create-proposal');
const proposalResult = document.getElementById('proposal-result');
const accessCodeSpan = document.getElementById('access-code');
const proposalLinkInput = document.getElementById('proposal-link');
const copyLinkButton = document.getElementById('copy-link');

// Summary Elements
const summaryTotalHours = document.getElementById('summary-total-hours');
const summaryRatePerPro = document.getElementById('summary-rate-per-pro');
const summaryApptsPerPro = document.getElementById('summary-appts-per-pro');
const summaryTotalApptsPerHour = document.getElementById('summary-total-appts-per-hour');
const summaryTotalAppts = document.getElementById('summary-total-appts');
const summaryTotalCost = document.getElementById('summary-total-cost');

// Calculator State
let calculatorState = {
    totalHours: 1,
    numPros: 1,
    serviceType: 'massage',
    ratePerProPerHour: SERVICE_RATES.massage,
    apptsPerProPerHour: APPOINTMENTS_PER_PRO_PER_HOUR,
    totalApptsPerHour: APPOINTMENTS_PER_PRO_PER_HOUR,
    totalAppts: APPOINTMENTS_PER_PRO_PER_HOUR,
    totalCost: SERVICE_RATES.massage
};

// Event Listeners
calculateButton.addEventListener('click', calculateResults);
createProposalButton.addEventListener('click', createProposal);
copyLinkButton.addEventListener('click', copyProposalLink);

// Service type change handler
serviceTypeSelect.addEventListener('change', () => {
    const selectedType = serviceTypeSelect.value;
    customRateGroup.style.display = selectedType === 'custom' ? 'block' : 'none';
    calculateResults();
});

// Custom rate change handler
customRateInput.addEventListener('input', calculateResults);

// Input validation and auto-calculation
[totalHoursInput, numProsInput].forEach(input => {
    input.addEventListener('input', () => {
        // Ensure minimum value of 1
        if (input.value < 1) input.value = 1;
        calculateResults();
    });
});

function getCurrentRate() {
    const serviceType = serviceTypeSelect.value;
    if (serviceType === 'custom') {
        return parseFloat(customRateInput.value) || SERVICE_RATES.massage;
    }
    return SERVICE_RATES[serviceType];
}

function calculateResults() {
    const totalHours = parseInt(totalHoursInput.value) || 1;
    const numPros = parseInt(numProsInput.value) || 1;
    const ratePerProPerHour = getCurrentRate();

    // Update calculator state
    calculatorState = {
        totalHours,
        numPros,
        serviceType: serviceTypeSelect.value,
        ratePerProPerHour,
        apptsPerProPerHour: APPOINTMENTS_PER_PRO_PER_HOUR,
        totalApptsPerHour: numPros * APPOINTMENTS_PER_PRO_PER_HOUR,
        totalAppts: numPros * APPOINTMENTS_PER_PRO_PER_HOUR * totalHours,
        totalCost: numPros * ratePerProPerHour * totalHours
    };

    // Update summary display
    updateSummary();
}

function updateSummary() {
    summaryTotalHours.textContent = calculatorState.totalHours;
    summaryRatePerPro.textContent = formatCurrency(calculatorState.ratePerProPerHour);
    summaryApptsPerPro.textContent = calculatorState.apptsPerProPerHour;
    summaryTotalApptsPerHour.textContent = calculatorState.totalApptsPerHour;
    summaryTotalAppts.textContent = calculatorState.totalAppts;
    summaryTotalCost.textContent = formatCurrency(calculatorState.totalCost);
}

async function createProposal() {
    // Validate required fields
    if (!clientNameInput.value || !clientEmailInput.value) {
        alert('Please fill in all required fields (Client Name and Email)');
        return;
    }

    // Prepare client info
    const clientInfo = {
        name: clientNameInput.value,
        email: clientEmailInput.value,
        phone: clientPhoneInput.value || ''
    };

    try {
        createProposalButton.disabled = true;
        createProposalButton.textContent = 'Creating...';

        // Create proposal in Firebase
        const proposal = await proposalService.createProposal({
            calculatorState,
            clientInfo,
            editableFields: ['totalHours', 'numPros']
        });

        // Show success message with access code
        proposalResult.style.display = 'block';
        accessCodeSpan.textContent = proposal.accessCode;
        
        // Generate and display proposal link
        const proposalLink = `${window.location.origin}/proposal.html?id=${proposal.id}`;
        proposalLinkInput.value = proposalLink;

        // Scroll to the result
        proposalResult.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error creating proposal:', error);
        alert('Failed to create proposal. Please try again.');
    } finally {
        createProposalButton.disabled = false;
        createProposalButton.textContent = 'Create Proposal';
    }
}

async function copyProposalLink() {
    try {
        await navigator.clipboard.writeText(proposalLinkInput.value);
        const originalText = copyLinkButton.textContent;
        copyLinkButton.textContent = 'Copied!';
        setTimeout(() => {
            copyLinkButton.textContent = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy link. Please copy it manually.');
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Initial calculation
calculateResults(); 