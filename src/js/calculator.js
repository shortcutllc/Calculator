// Import Firebase configuration and services
import { firebaseConfig } from './firebase-config.js';
import { ProposalService } from './proposal-service.js';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
const eventTypeSelect = document.getElementById('event-type');
const singleDayGroup = document.getElementById('single-day-group');
const multiDayGroup = document.getElementById('multi-day-group');
const totalHoursInput = document.getElementById('total-hours');
const numProsInput = document.getElementById('num-pros');
const calculateButton = document.getElementById('calculate');
const createProposalButton = document.getElementById('create-proposal');
const proposalResult = document.getElementById('proposal-result');
const accessCodeSpan = document.getElementById('access-code');
const proposalLinkInput = document.getElementById('proposal-link');
const copyLinkButton = document.getElementById('copy-link');

// Multi-day specific elements
const numDaysInput = document.getElementById('num-days');
const hoursPerDayInput = document.getElementById('hours-per-day');
const locationSelect = document.getElementById('location-type');
const numLocationsInput = document.getElementById('num-locations');

// Summary Elements
const summaryTotalHours = document.getElementById('summary-total-hours');
const summaryRatePerPro = document.getElementById('summary-rate-per-pro');
const summaryApptsPerPro = document.getElementById('summary-appts-per-pro');
const summaryTotalApptsPerHour = document.getElementById('summary-total-appts-per-hour');
const summaryTotalAppts = document.getElementById('summary-total-appts');
const summaryTotalCost = document.getElementById('summary-total-cost');
const summaryNumDays = document.getElementById('summary-num-days');
const summaryNumLocations = document.getElementById('summary-num-locations');

// Calculator State
let calculatorState = {
    eventType: 'single', // 'single' or 'multi'
    totalHours: 1,
    numPros: 1,
    serviceType: 'massage',
    ratePerProPerHour: SERVICE_RATES.massage,
    apptsPerProPerHour: APPOINTMENTS_PER_PRO_PER_HOUR,
    totalApptsPerHour: APPOINTMENTS_PER_PRO_PER_HOUR,
    totalAppts: APPOINTMENTS_PER_PRO_PER_HOUR,
    totalCost: SERVICE_RATES.massage,
    numDays: 1,
    hoursPerDay: 1,
    numLocations: 1,
    locationType: 'single' // 'single' or 'multiple'
};

// Event Listeners
calculateButton.addEventListener('click', calculateResults);
createProposalButton.addEventListener('click', createProposal);
copyLinkButton.addEventListener('click', copyProposalLink);

// Event type change handler
eventTypeSelect.addEventListener('change', () => {
    const selectedType = eventTypeSelect.value;
    singleDayGroup.style.display = selectedType === 'single' ? 'block' : 'none';
    multiDayGroup.style.display = selectedType === 'multi' ? 'block' : 'none';
    calculateResults();
});

// Service type change handler
serviceTypeSelect.addEventListener('change', () => {
    const selectedType = serviceTypeSelect.value;
    customRateGroup.style.display = selectedType === 'custom' ? 'block' : 'none';
    calculateResults();
});

// Location type change handler
locationSelect.addEventListener('change', () => {
    const selectedType = locationSelect.value;
    numLocationsInput.disabled = selectedType === 'single';
    if (selectedType === 'single') {
        numLocationsInput.value = 1;
    }
    calculateResults();
});

// Custom rate change handler
customRateInput.addEventListener('input', calculateResults);

// Input validation and auto-calculation
[totalHoursInput, numProsInput, numDaysInput, hoursPerDayInput, numLocationsInput].forEach(input => {
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
    const eventType = eventTypeSelect.value;
    const numPros = parseInt(numProsInput.value) || 1;
    const ratePerProPerHour = getCurrentRate();
    let totalHours;

    if (eventType === 'single') {
        totalHours = parseInt(totalHoursInput.value) || 1;
    } else {
        const numDays = parseInt(numDaysInput.value) || 1;
        const hoursPerDay = parseInt(hoursPerDayInput.value) || 1;
        totalHours = numDays * hoursPerDay;
    }

    const numLocations = locationSelect.value === 'multiple' ? 
        (parseInt(numLocationsInput.value) || 1) : 1;

    // Calculate travel cost if multiple locations
    const travelCost = numLocations > 1 ? (numLocations - 1) * 50 : 0;

    // Update calculator state
    calculatorState = {
        eventType,
        totalHours,
        numPros,
        serviceType: serviceTypeSelect.value,
        ratePerProPerHour,
        apptsPerProPerHour: APPOINTMENTS_PER_PRO_PER_HOUR,
        totalApptsPerHour: numPros * APPOINTMENTS_PER_PRO_PER_HOUR,
        totalAppts: numPros * APPOINTMENTS_PER_PRO_PER_HOUR * totalHours,
        totalCost: (numPros * ratePerProPerHour * totalHours) + travelCost,
        numDays: eventType === 'multi' ? (parseInt(numDaysInput.value) || 1) : 1,
        hoursPerDay: eventType === 'multi' ? (parseInt(hoursPerDayInput.value) || 1) : totalHours,
        numLocations,
        locationType: locationSelect.value
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
    
    if (summaryNumDays) {
        summaryNumDays.textContent = calculatorState.numDays;
    }
    if (summaryNumLocations) {
        summaryNumLocations.textContent = calculatorState.numLocations;
    }
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

        // Create proposal in Firebase using static method
        const proposal = await ProposalService.createProposal(calculatorState, clientInfo);

        // Show success message with access code
        proposalResult.style.display = 'block';
        accessCodeSpan.textContent = proposal.accessCode;
        
        // Generate and display proposal link
        const proposalLink = `${window.location.origin}/proposal.html?id=${proposal.proposalId}`;
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