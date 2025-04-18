/**
 * Enhanced Main JavaScript file for the Wellness Services Pricing Calculator
 * Connects the HTML interface with the calculation model
 * Supports multi-day/location events, multiple locations, and history feature
 */

// Constants
const CONSTANTS = {
    ANIMATION_DELAY: 100,
    DEBOUNCE_DELAY: 300,
    LOCAL_STORAGE_KEYS: {
        HISTORY: 'calculatorHistory',
        DRAFT: 'calculatorDraft',
        MULTI_DAY_DRAFT: 'multiDayDraft'
    }
};

// Utility functions
const utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    validateFormData(formData) {
        const required = ['serviceType', 'totalHours', 'appTime', 'proHourly', 'numPros'];
        const missing = required.filter(field => !formData[field]);
        
        if (missing.length) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }

        // Validate numeric fields
        const numeric = ['totalHours', 'appTime', 'proHourly', 'numPros', 'discountPercent'];
        numeric.forEach(field => {
            if (formData[field] && isNaN(formData[field])) {
                throw new Error(`${field} must be a number`);
            }
        });

        return true;
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
};

// Main Calculator Class
class Calculator {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.loadSavedState();
    }

    initializeElements() {
        // Cache DOM elements
        this.elements = {
            welcomeScreen: document.getElementById('welcome-screen'),
            calculatorForm: document.getElementById('calculator-form'),
            calculateBtn: document.getElementById('calculate-btn'),
            saveDraftBtn: document.getElementById('save-draft-btn'),
            resetBtn: document.getElementById('reset-btn'),
            resultsSection: document.querySelector('.results-section'),
            presetButtons: document.querySelectorAll('[data-preset]'),
            // Add other element references
        };

        // Initialize error handling
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handleError.bind(this));
    }

    attachEventListeners() {
        // Preset buttons
        this.elements.presetButtons.forEach(button => {
            button.addEventListener('click', this.handlePresetClick.bind(this));
        });

        // Form actions
        this.elements.calculateBtn.addEventListener('click', this.handleCalculate.bind(this));
        this.elements.saveDraftBtn.addEventListener('click', this.handleSaveDraft.bind(this));
        this.elements.resetBtn.addEventListener('click', this.handleReset.bind(this));

        // Add debounced form input handling
        this.elements.calculatorForm.addEventListener('input', 
            utils.debounce(this.handleFormInput.bind(this), CONSTANTS.DEBOUNCE_DELAY)
        );
    }

    handleError(error) {
        console.error('Application error:', error);
        // Implement proper error UI feedback
        this.showErrorMessage(error.message);
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Remove any existing error messages
        const existing = document.querySelector('.error-message');
        if (existing) existing.remove();
        
        // Insert error message
        this.elements.calculatorForm.insertBefore(errorDiv, this.elements.calculatorForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => errorDiv.remove(), 5000);
    }

    handlePresetClick(event) {
        const preset = event.target.getAttribute('data-preset');
        const [presetType, presetSize] = preset.split('-');
        
        // Hide welcome screen
        this.elements.welcomeScreen.style.display = 'none';
        document.getElementById('single-event-tab').style.display = 'block';
        
        // Apply preset
        this.applyPreset(presetType, presetSize);
        this.calculateAndDisplayResults();
    }

    handleCalculate(event) {
        event.preventDefault();
        this.calculateAndDisplayResults();
    }

    handleSaveDraft(event) {
        event.preventDefault();
        this.saveSingleEventDraft();
    }

    handleReset() {
        this.clearResults();
    }

    handleFormInput() {
        // Implement real-time validation and feedback
        try {
            const formData = this.getFormValues();
            utils.validateFormData(formData);
            // Clear any existing error messages
            const errorMsg = document.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        } catch (error) {
            this.showErrorMessage(error.message);
        }
    }

    getFormValues() {
        const form = this.elements.calculatorForm;
        return {
            serviceType: form.querySelector('[name="serviceType"]').value,
            totalHours: parseFloat(form.querySelector('[name="totalHours"]').value),
            appTime: parseInt(form.querySelector('[name="appTime"]').value),
            proHourly: parseFloat(form.querySelector('[name="proHourly"]').value),
            numPros: parseInt(form.querySelector('[name="numPros"]').value),
            discountPercent: parseFloat(form.querySelector('[name="discountPercent"]').value || 0),
            clientName: form.querySelector('[name="clientName"]')?.value || ''
        };
    }

    calculateAndDisplayResults() {
        try {
            const formData = this.getFormValues();
            utils.validateFormData(formData);
            
            const results = this.calculate(formData);
            this.displayResults(results);
            
            // Save to localStorage
            this.saveToLocalStorage(CONSTANTS.LOCAL_STORAGE_KEYS.DRAFT, formData);
            
        } catch (error) {
            this.showErrorMessage(error.message);
        }
    }

    calculate(params) {
        // Implement calculation logic
        // This should be moved to a separate calculation service
        return {
            totalAppts: Math.floor((params.totalHours * 60) / params.appTime),
            // Add other calculations
        };
    }

    displayResults(results) {
        // Update UI with results
        document.getElementById('totalAppointments').value = results.totalAppts;
        this.elements.resultsSection.classList.add('active');
        // Add other result displays
    }

    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadSavedState() {
        try {
            const savedDraft = localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.DRAFT);
            if (savedDraft) {
                const data = JSON.parse(savedDraft);
                this.populateForm(data);
            }
        } catch (error) {
            console.error('Error loading saved state:', error);
        }
    }

    populateForm(data) {
        Object.entries(data).forEach(([field, value]) => {
            const input = this.elements.calculatorForm.querySelector(`[name="${field}"]`);
            if (input) input.value = value;
        });
    }

    clearResults() {
        this.elements.calculatorForm.reset();
        this.elements.resultsSection.classList.remove('active');
        localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_KEYS.DRAFT);
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
});
