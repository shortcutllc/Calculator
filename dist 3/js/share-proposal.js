import { saveProposal } from '../firebase-config.js';

// Initialize all DOM elements
const elements = {
    shareProposalBtn: document.getElementById('share-proposal-btn'),
    shareMultiProposalBtn: document.getElementById('share-multi-proposal-btn'),
    shareProposalModal: document.getElementById('share-proposal-modal'),
    proposalLinkInput: document.getElementById('proposal-link'),
    accessCodeInput: document.getElementById('access-code'),
    copyLinkBtn: document.getElementById('copy-link-btn'),
    copyCodeBtn: document.getElementById('copy-code-btn'),
    closeShareModalBtn: document.getElementById('close-share-modal-btn')
};

// Share proposal functionality
const shareProposal = {
    generateAccessCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    },

    getCurrentCalculatorState() {
        return {
            serviceType: document.getElementById('serviceType').value,
            totalHours: parseFloat(document.getElementById('totalHours').value),
            appTime: parseFloat(document.getElementById('appTime').value),
            numPros: parseInt(document.getElementById('numPros').value),
            proHourly: parseFloat(document.getElementById('proHourly').value),
            hourlyRate: parseFloat(document.getElementById('hourlyRate').value),
            discountPercent: parseFloat(document.getElementById('discountPercent').value),
            eventsPerYear: parseInt(document.getElementById('eventsPerYear').value),
            results: {
                totalAppts: document.getElementById('totalAppts').textContent,
                totalCost: document.getElementById('totalCost').textContent,
                totalProRev: document.getElementById('totalProRev').textContent,
                shortcutNet: document.getElementById('shortcutNet').textContent,
                shortcutMargin: document.getElementById('shortcutMargin').textContent,
                totalAnnual: document.getElementById('totalAnnual').textContent
            }
        };
    },

    getCurrentMultiDayState() {
        const days = Array.from(document.querySelectorAll('.day-config')).map(day => {
            const dayId = day.dataset.dayId;
            return {
                location: document.getElementById(`location-${dayId}`).value,
                serviceType: document.getElementById(`serviceType-${dayId}`).value,
                totalHours: parseFloat(document.getElementById(`totalHours-${dayId}`).value),
                appTime: parseFloat(document.getElementById(`appTime-${dayId}`).value),
                numPros: parseInt(document.getElementById(`numPros-${dayId}`).value),
                proHourly: parseFloat(document.getElementById(`proHourly-${dayId}`).value),
                hourlyRate: parseFloat(document.getElementById(`hourlyRate-${dayId}`).value),
                discountPercent: parseFloat(document.getElementById(`discountPercent-${dayId}`).value)
            };
        });

        return {
            clientName: document.getElementById('multiDayClientName').value,
            days: days,
            results: {
                totalHours: document.getElementById('multi-totalHoursResult').textContent,
                totalAppts: document.getElementById('multi-totalAppts').textContent,
                totalCost: document.getElementById('multi-totalCost').textContent,
                totalProRev: document.getElementById('multi-totalProRev').textContent,
                shortcutNet: document.getElementById('multi-shortcutNet').textContent,
                shortcutMargin: document.getElementById('multi-shortcutMargin').textContent,
                totalAnnual: document.getElementById('multi-totalAnnual').textContent
            }
        };
    },

    async generateShareableProposal(isMultiDay = false) {
        try {
            const accessCode = this.generateAccessCode();
            const state = isMultiDay ? this.getCurrentMultiDayState() : this.getCurrentCalculatorState();
            
            const proposalData = {
                type: isMultiDay ? 'multi-day' : 'single',
                accessCode,
                state,
                editableFields: ['totalHours', 'numPros', 'eventsPerYear']
            };

            const proposalId = await saveProposal(proposalData);
            
            // Generate shareable URL
            const baseUrl = window.location.origin + window.location.pathname;
            const proposalUrl = `${baseUrl}?proposal=${proposalId}`;

            // Update modal inputs
            elements.proposalLinkInput.value = proposalUrl;
            elements.accessCodeInput.value = accessCode;

            // Show the modal
            elements.shareProposalModal.style.display = 'block';
        } catch (error) {
            console.error('Error generating proposal:', error);
            alert('Failed to generate proposal. Please try again.');
        }
    },

    async copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
            alert('Failed to copy text. Please try again.');
        }
    },

    init() {
        // Event Listeners
        elements.shareProposalBtn?.addEventListener('click', () => this.generateShareableProposal(false));
        elements.shareMultiProposalBtn?.addEventListener('click', () => this.generateShareableProposal(true));

        elements.copyLinkBtn?.addEventListener('click', () => {
            this.copyToClipboard(elements.proposalLinkInput.value, elements.copyLinkBtn);
        });

        elements.copyCodeBtn?.addEventListener('click', () => {
            this.copyToClipboard(elements.accessCodeInput.value, elements.copyCodeBtn);
        });

        elements.closeShareModalBtn?.addEventListener('click', () => {
            elements.shareProposalModal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === elements.shareProposalModal) {
                elements.shareProposalModal.style.display = 'none';
            }
        });
    }
};

export default shareProposal; 