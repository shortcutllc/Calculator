/**
 * Enhanced Main JavaScript file for the Wellness Services Pricing Calculator
 * Connects the HTML interface with the calculation model
 * Supports multi-day/location events, multiple locations, and history feature
 */

// Initialize the calculator
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calculator model
    const calculator = new PricingCalculator();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Set default hourly rate for massage and hair/nails services
    const serviceTypeSelect = document.getElementById('serviceType');
    if (serviceTypeSelect) {
        const serviceType = serviceTypeSelect.value;
        const hourlyRateInput = document.getElementById('hourlyRate');
        if ((serviceType === 'massage/spa' || serviceType === 'hair/nails') && hourlyRateInput) {
            hourlyRateInput.value = '135';
        }
    }
    
    // Get welcome screen elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const createSingleEventBtn = document.getElementById('create-single-event-btn');
    const createMultiDayLocationEventBtn = document.getElementById('create-multi-day-event-btn');
    const viewHistoryBtn = document.getElementById('view-history-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    
    // Get form and result elements
    const calculatorForm = document.getElementById('calculator-form');
    const calculateBtn = document.getElementById('calculate-btn');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const resetBtn = document.getElementById('reset-btn');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // Get tab elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Get preset tab elements
    const presetTabButtons = document.querySelectorAll('.preset-tab-btn');
    const presetTabContents = document.querySelectorAll('.preset-tab-content');
    
    // Get results tab elements
    const resultsTabButtons = document.querySelectorAll('.results-tab-btn');
    const resultsTabContents = document.querySelectorAll('.results-tab-content');
    
    // Get multi-day elements
    const addDayBtn = document.getElementById('add-day-btn');
    const calculateMultiBtn = document.getElementById('calculate-multi-btn');
    const saveMultiDraftBtn = document.getElementById('save-multi-draft-btn');
    const resetMultiBtn = document.getElementById('reset-multi-btn');
    const daysContainer = document.getElementById('days-container');
    
    // Get history elements
    const historyContainer = document.getElementById('history-container');
    const saveCalculationBtn = document.getElementById('save-calculation-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    
    // Initialize history array from localStorage
    let calculationHistory = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    let draftCalculations = JSON.parse(localStorage.getItem('draftCalculations') || '[]');
    
    // Track day counter
    let dayCounter = 1;
    
    // Handle welcome screen navigation
    createSingleEventBtn.addEventListener('click', function() {
        welcomeScreen.style.display = 'none';
        document.getElementById('single-event-tab').style.display = 'block';
    });
    
    createMultiDayLocationEventBtn.addEventListener('click', function() {
        welcomeScreen.style.display = 'none';
        document.getElementById('multi-day-tab').style.display = 'block';
        
        // Initialize Day 1 form fields if they're empty
        const day1Form = document.querySelector('.day-config[data-day-id="1"] .day-form');
        if (day1Form && day1Form.children.length === 0) {
            initializeDay1Form();
        }
    });
    
    viewHistoryBtn.addEventListener('click', function() {
        welcomeScreen.style.display = 'none';
        document.getElementById('history-tab').style.display = 'block';
    });
    
    // Handle back button clicks
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show welcome screen
            welcomeScreen.style.display = 'block';
        });
    });
    
    // Handle tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected tab content, hide others
            tabContents.forEach(content => {
                if (content.id === tabId + '-tab') {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });
    
    // Handle preset tab switching
    presetTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-preset-tab');
            
            // Update active preset tab button
            presetTabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected preset tab content, hide others
            presetTabContents.forEach(content => {
                if (content.id === tabId + '-presets') {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });
    
    // Handle results tab switching
    resultsTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-results-tab');
            
            // Update active results tab button
            resultsTabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected results tab content, hide others
            resultsTabContents.forEach(content => {
                if (content.id === tabId + '-results') {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });
    
    // Handle preset button clicks
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const presetType = this.getAttribute('data-preset-type');
            const presetSize = this.getAttribute('data-preset-size');
            
            // Navigate to single event tab from welcome screen
            welcomeScreen.style.display = 'none';
            document.getElementById('single-event-tab').style.display = 'block';
            
            // Apply preset with a slight delay to ensure all fields are updated
            setTimeout(() => {
                applyPreset(presetType, presetSize);
                // Calculate results after applying preset
                calculateAndDisplayResults();
            }, 100);
        });
    });
    
    // Add event listeners for single event calculator
    calculateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        calculateAndDisplayResults();
    });
    
    saveDraftBtn.addEventListener('click', function(e) {
        e.preventDefault();
        saveSingleEventDraft();
    });
    
    resetBtn.addEventListener('click', function() {
        clearResults();
    });
    
    // Add event listeners for multi-day calculator
    addDayBtn.addEventListener('click', function() {
        addNewDay();
    });
    
    calculateMultiBtn.addEventListener('click', function() {
        calculateMultiDayResults();
    });
    
    saveMultiDraftBtn.addEventListener('click', function() {
        saveMultiDayDraft();
    });
    
    resetMultiBtn.addEventListener('click', function() {
        resetMultiDayCalculator();
    });
    
    // Add event listeners for history
    saveCalculationBtn.addEventListener('click', function() {
        saveCalculationToHistory();
    });
    
    clearHistoryBtn.addEventListener('click', function() {
        clearHistory();
    });
    
    // Initialize service type change handler
    document.getElementById('serviceType').addEventListener('change', function() {
        handleServiceTypeChange(this);
    });
    
    // Trigger service type change event to initialize UI
    const event = new Event('change');
    document.getElementById('serviceType').dispatchEvent(event);
    
    // Load history on page load
    loadHistory();
    
    // Apply preset based on type and size
    function applyPreset(type, size) {
        console.log(`Applying preset: ${type}, size: ${size}`);
        
        // Define preset values
        const presets = {
            'massage/spa': {
                small: { totalHours: 3, appTime: 20, numPros: 2, proHourly: 50, hourlyRate: 135 },
                medium: { totalHours: 4, appTime: 20, numPros: 3, proHourly: 50, hourlyRate: 135 },
                large: { totalHours: 6, appTime: 20, numPros: 5, proHourly: 50, hourlyRate: 135 }
            },
            'hair/nails': {
                small: { totalHours: 3, appTime: 30, numPros: 2, proHourly: 50, hourlyRate: 135 },
                medium: { totalHours: 4, appTime: 30, numPros: 3, proHourly: 50, hourlyRate: 135 },
                large: { totalHours: 6, appTime: 30, numPros: 5, proHourly: 50, hourlyRate: 135 }
            },
            'headshot': {
                small: { totalHours: 3, appTime: 12, numPros: 1, proHourly: 60, retouchingCost: 40 },
                medium: { totalHours: 4, appTime: 12, numPros: 2, proHourly: 60, retouchingCost: 40 },
                large: { totalHours: 6, appTime: 12, numPros: 3, proHourly: 60, retouchingCost: 40 }
            }
        };
        
        // Get preset values
        const preset = presets[type][size];
        if (!preset) {
            console.error('Invalid preset type or size');
            return;
        }
        
        // Set service type
        if (document.getElementById('serviceType')) {
            document.getElementById('serviceType').value = type;
            // Trigger change event to update UI
            const event = new Event('change');
            document.getElementById('serviceType').dispatchEvent(event);
        }
        
        // Set common fields
        if (document.getElementById('totalHours')) {
            document.getElementById('totalHours').value = preset.totalHours || 4;
        }
        if (document.getElementById('appTime')) {
            document.getElementById('appTime').value = preset.appTime || 20;
        }
        if (document.getElementById('numPros')) {
            document.getElementById('numPros').value = preset.numPros || 3;
        }
        if (document.getElementById('proHourly')) {
            document.getElementById('proHourly').value = preset.proHourly || 50;
        }
        
        // Set service-specific fields
        if (preset.serviceType === 'headshot') {
            if (document.getElementById('retouchingCost')) {
                document.getElementById('retouchingCost').value = preset.retouchingCost || 40;
            }
        } else {
            if (document.getElementById('hourlyRate')) {
                document.getElementById('hourlyRate').value = preset.hourlyRate || 135;
            }
            if (document.getElementById('earlyArrival')) {
                document.getElementById('earlyArrival').value = preset.earlyArrival || 75;
            }
        }
        
        // Reset discount to 0
        document.getElementById('discountPercent').value = 0;
        
        // Set events per year if available
        if (document.getElementById('eventsPerYear')) {
            document.getElementById('eventsPerYear').value = 12;
        }
        
        console.log("Preset values applied successfully");
    }
    
    // Calculate and display results for single event
    function calculateAndDisplayResults() {
        console.log("Calculating and displaying results");
        
        // Get form values
        const params = getFormValues(calculatorForm);
        console.log("Form values:", params);
        
        // Calculate results
        const results = calculator.calculate(params);
        console.log("Calculation results:", results);
        
        // Update total appointments field
        document.getElementById('totalAppointments').value = results.totalAppts;
        
        // Display results
        displaySingleResults(results);
    }
    
    // Get form values from a form element
    function getFormValues(form) {
        const serviceType = form.querySelector('[name="serviceType"]').value;
        const totalHours = parseFloat(form.querySelector('[name="totalHours"]').value);
        const appTime = parseInt(form.querySelector('[name="appTime"]').value);
        const proHourly = parseFloat(form.querySelector('[name="proHourly"]').value);
        const numPros = parseInt(form.querySelector('[name="numPros"]').value);
        const discountPercent = parseFloat(form.querySelector('[name="discountPercent"]').value || 0);
        
        // Get client name if available
        const clientNameInput = form.querySelector('[name="clientName"]');
        const clientName = clientNameInput ? clientNameInput.value : '';
        
        // Get service-specific values
        let params = {
            serviceType,
            totalHours,
            appTime,
            proHourly,
            numPros,
            discountPercent,
            clientName
        };
        
        // Add service-specific parameters
        if (serviceType === 'headshot') {
            params.retouchingCost = parseFloat(form.querySelector('[name="retouchingCost"]').value || 40);
        } else {
            params.hourlyRate = parseFloat(form.querySelector('[name="hourlyRate"]').value);
            params.earlyArrival = parseFloat(form.querySelector('[name="earlyArrival"]').value || 0);
        }
        
        // Add events per year if available
        const eventsPerYearInput = form.querySelector('[name="eventsPerYear"]');
        if (eventsPerYearInput) {
            params.eventsPerYear = parseInt(eventsPerYearInput.value || 12);
        }
        
        return params;
    }
    
    // Display results for single event
    function displaySingleResults(results) {
        // Client Details
        document.getElementById('totalHoursResult').textContent = results.totalHours;
        document.getElementById('apptsPerProPerHour').textContent = results.apptsPerProPerHour;
        document.getElementById('apptsPerHour').textContent = results.apptsPerHour;
        document.getElementById('totalAppts').textContent = results.totalAppts;
        document.getElementById('totalCost').textContent = calculator.formatCurrency(results.totalCost);
        
        // Shortcut Details
        document.getElementById('totalProRev').textContent = calculator.formatCurrency(results.totalProRev);
        document.getElementById('shortcutNet').textContent = calculator.formatCurrency(results.shortcutNet);
        document.getElementById('shortcutMargin').textContent = calculator.formatPercentage(results.shortcutMargin);
        document.getElementById('totalAnnual').textContent = calculator.formatCurrency(results.totalAnnual);
        
        // Highlight results section
        document.querySelector('.results-section').classList.add('active');
    }
    
    // Clear results for single event
    function clearResults() {
        // Client Details
        document.getElementById('totalHoursResult').textContent = '-';
        document.getElementById('apptsPerProPerHour').textContent = '-';
        document.getElementById('apptsPerHour').textContent = '-';
        document.getElementById('totalAppts').textContent = '-';
        document.getElementById('totalCost').textContent = '-';
        
        // Shortcut Details
        document.getElementById('totalProRev').textContent = '-';
        document.getElementById('shortcutNet').textContent = '-';
        document.getElementById('shortcutMargin').textContent = '-';
        document.getElementById('totalAnnual').textContent = '-';
        
        // Remove highlight from results section
        document.querySelector('.results-section').classList.remove('active');
    }
    
    // Initialize Day 1 form fields by cloning from single event form
    function initializeDay1Form() {
        const day1Form = document.querySelector('.day-config[data-day-id="1"] .day-form');
        if (!day1Form) return;
        
        // Clone the form fields from the single event form
        const formGroups = calculatorForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const clonedGroup = group.cloneNode(true);
            
            // Update IDs and names to be unique for day 1
            const input = clonedGroup.querySelector('input, select');
            if (input) {
                const originalId = input.id;
                const originalName = input.name;
                input.id = `${originalId}-day1`;
                input.name = `${originalName}-day1`;
                
                // Update label's for attribute
                const label = clonedGroup.querySelector('label');
                if (label) {
                    label.setAttribute('for', input.id);
                }
                
                // Add event listener for service type change
                if (originalId === 'serviceType') {
                    input.addEventListener('change', function() {
                        handleServiceTypeChange(this, 1);
                    });
                }
                
                // Make total appointments field readonly
                if (originalId === 'totalAppointments') {
                    input.readOnly = true;
                }
            }
            
            day1Form.appendChild(clonedGroup);
        });
        
        // Remove form actions (buttons) from the cloned form
        const formActions = day1Form.querySelector('.form-actions');
        if (formActions) {
            day1Form.removeChild(formActions);
        }
        
        // Trigger service type change event to update UI
        const serviceTypeSelect = day1Form.querySelector('[name="serviceType-day1"]');
        if (serviceTypeSelect) {
            const event = new Event('change');
            serviceTypeSelect.dispatchEvent(event);
        }
    }
    
    // Add a new day to the multi-day configuration
    function addNewDay() {
        dayCounter++;
        
        // Create new day element
        const newDay = document.createElement('div');
        newDay.className = 'day-config';
        newDay.setAttribute('data-day-id', dayCounter);
        
        // Create day header
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.innerHTML = `
            <h3>Day ${dayCounter}</h3>
            <div class="day-actions">
                <button class="remove-day-btn" data-day-id="${dayCounter}">Remove</button>
            </div>
        `;
        
        // Create location input
        const locationInput = document.createElement('div');
        locationInput.className = 'location-input';
        locationInput.innerHTML = `
            <label for="location-${dayCounter}">Location:</label>
            <input type="text" id="location-${dayCounter}" placeholder="Location ${dayCounter}" value="Location ${dayCounter}">
        `;
        
        // Create day form by cloning the single event form
        const dayForm = document.createElement('div');
        dayForm.className = 'day-form';
        
        // Clone the form fields from the single event form
        const formGroups = calculatorForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const clonedGroup = group.cloneNode(true);
            
            // Update IDs and names to be unique for this day
            const input = clonedGroup.querySelector('input, select');
            if (input) {
                const originalId = input.id;
                const originalName = input.name;
                input.id = `${originalId}-day${dayCounter}`;
                input.name = `${originalName}-day${dayCounter}`;
                
                // Update label's for attribute
                const label = clonedGroup.querySelector('label');
                if (label) {
                    label.setAttribute('for', input.id);
                }
                
                // Add event listener for service type change
                if (originalId === 'serviceType') {
                    input.addEventListener('change', function() {
                        handleServiceTypeChange(this, dayCounter);
                    });
                }
                
                // Make total appointments field readonly
                if (originalId === 'totalAppointments') {
                    input.readOnly = true;
                }
            }
            
            dayForm.appendChild(clonedGroup);
        });
        
        // Remove form actions (buttons) from the cloned form
        const formActions = dayForm.querySelector('.form-actions');
        if (formActions) {
            dayForm.removeChild(formActions);
        }
        
        // Assemble the new day
        newDay.appendChild(dayHeader);
        newDay.appendChild(locationInput);
        newDay.appendChild(dayForm);
        
        // Add the new day to the container
        daysContainer.appendChild(newDay);
        
        // Add event listener to remove button
        const removeBtn = newDay.querySelector('.remove-day-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                const dayId = this.getAttribute('data-day-id');
                removeDay(dayId);
            });
        }
        
        // Trigger service type change event to update UI
        const serviceTypeSelect = newDay.querySelector(`[name="serviceType-day${dayCounter}"]`);
        if (serviceTypeSelect) {
            const event = new Event('change');
            serviceTypeSelect.dispatchEvent(event);
        }
    }
    
    // Remove a day from the multi-day configuration
    function removeDay(dayId) {
        const dayElement = document.querySelector(`.day-config[data-day-id="${dayId}"]`);
        if (dayElement) {
            dayElement.remove();
        }
    }
    
    // Handle service type change for multi-day event
    function handleServiceTypeChange(selectElement, dayNumber) {
        const serviceType = selectElement.value;
        const dayConfig = document.querySelector(`.day-config[data-day-id="${dayNumber}"]`);
        const hourlyRateInput = dayConfig.querySelector(`input[name="hourlyRate-day${dayNumber}"]`);
        
        if (dayConfig) {
            const appTimeInput = dayConfig.querySelector(`[name="appTime-day${dayNumber}"]`);
            const proHourlyInput = dayConfig.querySelector(`[name="proHourly-day${dayNumber}"]`);
            const headshotFields = dayConfig.querySelectorAll(`.form-group:has([name="retouchingCost-day${dayNumber}"])`);
            const nonHeadshotFields = dayConfig.querySelectorAll(`.form-group:has([name="hourlyRate-day${dayNumber}"]), .form-group:has([name="earlyArrival-day${dayNumber}"])`);
            
            // Set appointment time based on service type
            if (serviceType === 'hair/nails') {
                if (appTimeInput) appTimeInput.value = 30;
                // Show non-headshot fields, hide headshot fields
                headshotFields.forEach(field => field.style.display = 'none');
                nonHeadshotFields.forEach(field => field.style.display = 'block');
                // Set default hourly rate
                hourlyRateInput.value = '135';
            } else if (serviceType === 'massage/spa') {
                // Default for massage is 20 minutes if not already set
                if (appTimeInput && (appTimeInput.value == 30 || appTimeInput.value == 12)) {
                    appTimeInput.value = 20;
                }
                // Show non-headshot fields, hide headshot fields
                headshotFields.forEach(field => field.style.display = 'none');
                nonHeadshotFields.forEach(field => field.style.display = 'block');
                // Set default hourly rate
                hourlyRateInput.value = '135';
            } else if (serviceType === 'headshot') {
                if (appTimeInput) appTimeInput.value = 12;
                if (proHourlyInput) proHourlyInput.value = 60;
                // Show headshot fields, hide non-headshot fields
                headshotFields.forEach(field => field.style.display = 'block');
                nonHeadshotFields.forEach(field => field.style.display = 'none');
            }
        }
        
        // Update preset options based on service type
        updatePresetOptions(serviceType, dayNumber);
    }
    
    // Handle service type change for single event
    function handleServiceTypeChange(selectElement) {
        const serviceType = selectElement.value;
        const headshotFields = document.querySelectorAll('.headshot-field');
        const nonHeadshotFields = document.querySelectorAll('.non-headshot-field');
        const hourlyRateInput = selectElement.closest('.calculator-form').querySelector('input[name="hourlyRate"]');
        
        // Set appointment time based on service type
        if (serviceType === 'hair/nails') {
            document.getElementById('appTime').value = 30;
            // Show non-headshot fields, hide headshot fields
            headshotFields.forEach(field => field.style.display = 'none');
            nonHeadshotFields.forEach(field => field.style.display = 'block');
            // Set default hourly rate
            hourlyRateInput.value = '135';
        } else if (serviceType === 'massage/spa') {
            // Default for massage is 20 minutes if not already set
            if (document.getElementById('appTime').value == 30 || document.getElementById('appTime').value == 12) {
                document.getElementById('appTime').value = 20;
            }
            // Show non-headshot fields, hide headshot fields
            headshotFields.forEach(field => field.style.display = 'none');
            nonHeadshotFields.forEach(field => field.style.display = 'block');
            // Set default hourly rate
            hourlyRateInput.value = '135';
        } else if (serviceType === 'headshot') {
            document.getElementById('appTime').value = 12;
            document.getElementById('proHourly').value = 60;
            // Show headshot fields, hide non-headshot fields
            headshotFields.forEach(field => field.style.display = 'block');
            nonHeadshotFields.forEach(field => field.style.display = 'none');
        }
        
        // Update preset options based on service type
        updatePresetOptions(serviceType);
    }
    
    // Calculate and display results for multi-day event
    function calculateMultiDayResults() {
        // Get all day configurations
        const dayConfigs = document.querySelectorAll('.day-config');
        
        // Initialize results
        let totalAppts = 0;
        let totalCost = 0;
        let totalProRev = 0;
        let totalShortcutNet = 0;
        let totalAnnual = 0;
        
        // Results by day and location
        const dayResults = [];
        const locationResults = {};
        
        // Get client name
        const clientName = document.getElementById('multiDayClientName').value;
        
        // Process each day
        dayConfigs.forEach(dayConfig => {
            const dayId = dayConfig.getAttribute('data-day-id');
            const location = dayConfig.querySelector(`#location-${dayId}`).value;
            
            // Get form values for this day
            const dayForm = dayConfig.querySelector('.day-form');
            const params = getMultiDayFormValues(dayForm, dayId);
            params.clientName = clientName;
            
            // Calculate results for this day
            const results = calculator.calculate(params);
            
            // Update total appointments field for this day
            const totalApptsInput = dayForm.querySelector(`[name="totalAppointments-day${dayId}"]`);
            if (totalApptsInput) {
                totalApptsInput.value = results.totalAppts;
            }
            
            // Add to totals
            totalAppts += results.totalAppts;
            totalCost += results.totalCost;
            totalProRev += results.totalProRev;
            totalShortcutNet += results.shortcutNet;
            totalAnnual += results.totalAnnual;
            
            // Store day results
            dayResults.push({
                dayId,
                location,
                results
            });
            
            // Store location results
            if (!locationResults[location]) {
                locationResults[location] = {
                    totalAppts: 0,
                    totalCost: 0,
                    totalProRev: 0,
                    shortcutNet: 0,
                    totalAnnual: 0
                };
            }
            
            locationResults[location].totalAppts += results.totalAppts;
            locationResults[location].totalCost += results.totalCost;
            locationResults[location].totalProRev += results.totalProRev;
            locationResults[location].shortcutNet += results.shortcutNet;
            locationResults[location].totalAnnual += results.totalAnnual;
        });
        
        // Calculate overall margin
        const overallMargin = totalCost > 0 ? (totalShortcutNet / totalCost) : 0;
        
        // Display summary results
        document.getElementById('multi-totalAppts').textContent = totalAppts;
        document.getElementById('multi-totalCost').textContent = calculator.formatCurrency(totalCost);
        document.getElementById('multi-totalProRev').textContent = calculator.formatCurrency(totalProRev);
        document.getElementById('multi-shortcutNet').textContent = calculator.formatCurrency(totalShortcutNet);
        document.getElementById('multi-shortcutMargin').textContent = calculator.formatPercentage(overallMargin);
        document.getElementById('multi-totalAnnual').textContent = calculator.formatCurrency(totalAnnual);
        
        // Display day-by-day results
        displayDayByDayResults(dayResults);
        
        // Display location-by-location results
        displayLocationResults(locationResults);
    }
    
    // Get form values for multi-day event
    function getMultiDayFormValues(form, dayId) {
        const serviceType = form.querySelector(`[name="serviceType-day${dayId}"]`).value;
        const totalHours = parseFloat(form.querySelector(`[name="totalHours-day${dayId}"]`).value);
        const appTime = parseInt(form.querySelector(`[name="appTime-day${dayId}"]`).value);
        const proHourly = parseFloat(form.querySelector(`[name="proHourly-day${dayId}"]`).value);
        const numPros = parseInt(form.querySelector(`[name="numPros-day${dayId}"]`).value);
        const discountPercent = parseFloat(form.querySelector(`[name="discountPercent-day${dayId}"]`).value || 0);
        
        // Get service-specific values
        let params = {
            serviceType,
            totalHours,
            appTime,
            proHourly,
            numPros,
            discountPercent
        };
        
        // Add service-specific parameters
        if (serviceType === 'headshot') {
            params.retouchingCost = parseFloat(form.querySelector(`[name="retouchingCost-day${dayId}"]`).value || 40);
        } else {
            params.hourlyRate = parseFloat(form.querySelector(`[name="hourlyRate-day${dayId}"]`).value);
            params.earlyArrival = parseFloat(form.querySelector(`[name="earlyArrival-day${dayId}"]`).value || 0);
        }
        
        // Add events per year if available
        const eventsPerYearInput = form.querySelector(`[name="eventsPerYear-day${dayId}"]`);
        if (eventsPerYearInput) {
            params.eventsPerYear = parseInt(eventsPerYearInput.value || 12);
        }
        
        return params;
    }
    
    // Display day-by-day results
    function displayDayByDayResults(dayResults) {
        const byDayResultsContainer = document.getElementById('by-day-results');
        byDayResultsContainer.innerHTML = '';
        
        dayResults.forEach(day => {
            const dayCard = document.createElement('div');
            dayCard.className = 'result-card';
            dayCard.innerHTML = `
                <h3>Day ${day.dayId} - ${day.location}</h3>
                <div class="result-item">
                    <span class="result-label">Total Appointments:</span>
                    <span class="result-value">${day.results.totalAppts}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Cost to Customer:</span>
                    <span class="result-value">${calculator.formatCurrency(day.results.totalCost)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Professional Revenue:</span>
                    <span class="result-value">${calculator.formatCurrency(day.results.totalProRev)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Shortcut Net:</span>
                    <span class="result-value">${calculator.formatCurrency(day.results.shortcutNet)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Profit Margin:</span>
                    <span class="result-value">${calculator.formatPercentage(day.results.shortcutMargin)}</span>
                </div>
            `;
            
            byDayResultsContainer.appendChild(dayCard);
        });
    }
    
    // Display location-by-location results
    function displayLocationResults(locationResults) {
        const byLocationResultsContainer = document.getElementById('by-location-results');
        byLocationResultsContainer.innerHTML = '';
        
        for (const location in locationResults) {
            const results = locationResults[location];
            const margin = results.totalCost > 0 ? (results.shortcutNet / results.totalCost) : 0;
            
            const locationCard = document.createElement('div');
            locationCard.className = 'result-card';
            locationCard.innerHTML = `
                <h3>${location}</h3>
                <div class="result-item">
                    <span class="result-label">Total Appointments:</span>
                    <span class="result-value">${results.totalAppts}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Cost to Customer:</span>
                    <span class="result-value">${calculator.formatCurrency(results.totalCost)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Professional Revenue:</span>
                    <span class="result-value">${calculator.formatCurrency(results.totalProRev)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Shortcut Net:</span>
                    <span class="result-value">${calculator.formatCurrency(results.shortcutNet)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Profit Margin:</span>
                    <span class="result-value">${calculator.formatPercentage(margin)}</span>
                </div>
            `;
            
            byLocationResultsContainer.appendChild(locationCard);
        }
    }
    
    // Reset multi-day calculator
    function resetMultiDayCalculator() {
        // Clear all day configurations except the first one
        const dayConfigs = document.querySelectorAll('.day-config');
        dayConfigs.forEach(dayConfig => {
            const dayId = dayConfig.getAttribute('data-day-id');
            if (dayId !== '1') {
                dayConfig.remove();
            }
        });
        
        // Reset day counter
        dayCounter = 1;
        
        // Reset first day form
        const day1Form = document.querySelector('.day-config[data-day-id="1"] .day-form');
        if (day1Form) {
            // Reset service type to default
            const serviceTypeSelect = day1Form.querySelector('[name="serviceType-day1"]');
            if (serviceTypeSelect) {
                serviceTypeSelect.value = 'massage/spa';
                const event = new Event('change');
                serviceTypeSelect.dispatchEvent(event);
            }
            
            // Reset other fields to default values
            const inputs = day1Form.querySelectorAll('input');
            inputs.forEach(input => {
                const name = input.getAttribute('name');
                if (name === 'totalHours-day1') input.value = 4;
                else if (name === 'appTime-day1') input.value = 20;
                else if (name === 'numPros-day1') input.value = 3;
                else if (name === 'proHourly-day1') input.value = 50;
                else if (name === 'retouchingCost-day1') input.value = 40;
                else if (name === 'hourlyRate-day1') input.value = 135;
                else if (name === 'earlyArrival-day1') input.value = 75;
                else if (name === 'discountPercent-day1') input.value = 0;
                else if (name === 'eventsPerYear-day1') input.value = 12;
                else if (name === 'totalAppointments-day1') input.value = '';
            });
        }
        
        // Reset location input
        const locationInput = document.querySelector('#location-1');
        if (locationInput) {
            locationInput.value = 'Location 1';
        }
        
        // Reset client name
        const clientNameInput = document.querySelector('#multiDayClientName');
        if (clientNameInput) {
            clientNameInput.value = '';
        }
        
        // Clear results
        document.getElementById('multi-totalAppts').textContent = '-';
        document.getElementById('multi-totalCost').textContent = '-';
        document.getElementById('multi-totalProRev').textContent = '-';
        document.getElementById('multi-shortcutNet').textContent = '-';
        document.getElementById('multi-shortcutMargin').textContent = '-';
        document.getElementById('multi-totalAnnual').textContent = '-';
        
        // Clear day-by-day and location results
        document.getElementById('by-day-results').innerHTML = '';
        document.getElementById('by-location-results').innerHTML = '';
    }
    
    // Save calculation to history
    function saveCalculationToHistory() {
        const calculationTitle = document.getElementById('calculation-title').value;
        if (!calculationTitle) {
            alert('Please enter a title for this calculation');
            return;
        }
        
        // Get current tab
        const activeTab = document.querySelector('.tab-btn.active');
        const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'single-event';
        
        let calculation = {
            id: Date.now(),
            title: calculationTitle,
            date: new Date().toLocaleString(),
            type: tabId,
            isDraft: false
        };
        
        if (tabId === 'single-event') {
            // Get form values and results for single event
            const params = getFormValues(calculatorForm);
            const results = calculator.calculate(params);
            
            calculation.params = params;
            calculation.results = results;
        } else if (tabId === 'multi-day') {
            // Get all day configurations for multi-day event
            const dayConfigs = document.querySelectorAll('.day-config');
            const days = [];
            
            // Get client name
            const clientName = document.getElementById('multiDayClientName').value;
            calculation.clientName = clientName;
            
            // Process each day
            dayConfigs.forEach(dayConfig => {
                const dayId = dayConfig.getAttribute('data-day-id');
                const location = dayConfig.querySelector(`#location-${dayId}`).value;
                
                // Get form values for this day
                const dayForm = dayConfig.querySelector('.day-form');
                const params = getMultiDayFormValues(dayForm, dayId);
                
                days.push({
                    dayId,
                    location,
                    params
                });
            });
            
            calculation.days = days;
        }
        
        // Add to history
        calculationHistory.push(calculation);
        
        // Save to localStorage
        localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
        
        // Reload history
        loadHistory();
        
        // Clear title input
        document.getElementById('calculation-title').value = '';
        
        alert('Calculation saved to history');
    }
    
    // Save single event as draft
    function saveSingleEventDraft() {
        // Get client name
        const clientName = document.getElementById('clientName').value || 'Unnamed Client';
        
        // Create draft object
        const draft = {
            id: Date.now(),
            title: `${clientName} - Draft`,
            date: new Date().toLocaleString(),
            type: 'single-event',
            isDraft: true,
            params: getFormValues(calculatorForm)
        };
        
        // Add to drafts
        draftCalculations.push(draft);
        
        // Save to localStorage
        localStorage.setItem('draftCalculations', JSON.stringify(draftCalculations));
        
        // Reload history
        loadHistory();
        
        alert('Draft saved successfully');
    }
    
    // Save multi-day event as draft
    function saveMultiDayDraft() {
        // Get client name
        const clientName = document.getElementById('multiDayClientName').value || 'Unnamed Client';
        
        // Create draft object
        const draft = {
            id: Date.now(),
            title: `${clientName} - Multi-Day Draft`,
            date: new Date().toLocaleString(),
            type: 'multi-day',
            isDraft: true,
            clientName: clientName,
            days: []
        };
        
        // Get all day configurations
        const dayConfigs = document.querySelectorAll('.day-config');
        
        // Process each day
        dayConfigs.forEach(dayConfig => {
            const dayId = dayConfig.getAttribute('data-day-id');
            const location = dayConfig.querySelector(`#location-${dayId}`).value;
            
            // Get form values for this day
            const dayForm = dayConfig.querySelector('.day-form');
            const params = getMultiDayFormValues(dayForm, dayId);
            
            draft.days.push({
                dayId,
                location,
                params
            });
        });
        
        // Add to drafts
        draftCalculations.push(draft);
        
        // Save to localStorage
        localStorage.setItem('draftCalculations', JSON.stringify(draftCalculations));
        
        // Reload history
        loadHistory();
        
        alert('Draft saved successfully');
    }
    
    // Load calculation history
    function loadHistory() {
        historyContainer.innerHTML = '';
        
        // Combine history and drafts for display
        const combinedHistory = [...calculationHistory, ...draftCalculations];
        
        // Sort by date (newest first)
        combinedHistory.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        if (combinedHistory.length === 0) {
            historyContainer.innerHTML = '<div class="no-history">No saved calculations yet</div>';
            return;
        }
        
        combinedHistory.forEach(calculation => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            // Create header with title and date
            const historyHeader = document.createElement('div');
            historyHeader.className = 'history-header';
            historyHeader.innerHTML = `
                <h3>${calculation.title} ${calculation.isDraft ? '(Draft)' : ''}</h3>
                <span class="history-date">${calculation.date}</span>
            `;
            
            // Create summary
            const historySummary = document.createElement('div');
            historySummary.className = 'history-summary';
            
            if (calculation.type === 'single-event' && calculation.results) {
                historySummary.innerHTML = `
                    <div class="history-summary-item">
                        <span class="summary-label">Client:</span>
                        <span>${calculation.params.clientName || 'Not specified'}</span>
                    </div>
                    <div class="history-summary-item">
                        <span class="summary-label">Service Type:</span>
                        <span>${calculation.params.serviceType}</span>
                    </div>
                    <div class="history-summary-item">
                        <span class="summary-label">Total Appointments:</span>
                        <span>${calculation.results.totalAppts}</span>
                    </div>
                    <div class="history-summary-item">
                        <span class="summary-label">Total Cost:</span>
                        <span>${calculator.formatCurrency(calculation.results.totalCost)}</span>
                    </div>
                    <div class="history-summary-item">
                        <span class="summary-label">Shortcut Net:</span>
                        <span>${calculator.formatCurrency(calculation.results.shortcutNet)}</span>
                    </div>
                `;
            } else if (calculation.type === 'single-event' && calculation.isDraft) {
                historySummary.innerHTML = `
                    <div class="history-summary-item">
                        <span class="summary-label">Client:</span>
                        <span>${calculation.params.clientName || 'Not specified'}</span>
                    </div>
                    <div class="history-summary-item">
                        <span class="summary-label">Service Type:</span>
                        <span>${calculation.params.serviceType}</span>
                    </div>
                    <div class="history-summary-item">
                        <span class="summary-label">Status:</span>
                        <span>Draft - Calculation not complete</span>
                    </div>
                `;
            } else if (calculation.type === 'multi-day') {
                const dayCount = calculation.days ? calculation.days.length : 0;
                historySummary.innerHTML = `
                    <div class="history-summary-item">
                        <span class="summary-label">Client:</span>
                        <span>${calculation.clientName || 'Not specified'}</span>
                    </div>
                    <div class="history-summary-item">
                        <span class="summary-label">Type:</span>
                        <span>Multi-Day/Location Event</span>
                    </div>
                    <div class="history-summary-item">
                        <span class="summary-label">Number of Days:</span>
                        <span>${dayCount}</span>
                    </div>
                    <div class="history-summary-item">
                        <span class="summary-label">Status:</span>
                        <span>${calculation.isDraft ? 'Draft - Calculation not complete' : 'Complete'}</span>
                    </div>
                `;
            }
            
            // Create actions
            const historyActions = document.createElement('div');
            historyActions.className = 'history-actions';
            
            // Load button
            const loadBtn = document.createElement('button');
            loadBtn.className = 'load-history-btn';
            loadBtn.textContent = calculation.isDraft ? 'Continue Editing' : 'Load';
            loadBtn.addEventListener('click', function() {
                loadCalculation(calculation);
            });
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-history-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                deleteCalculation(calculation.id, calculation.isDraft);
            });
            
            historyActions.appendChild(loadBtn);
            historyActions.appendChild(deleteBtn);
            
            // Assemble history item
            historyItem.appendChild(historyHeader);
            historyItem.appendChild(historySummary);
            historyItem.appendChild(historyActions);
            
            historyContainer.appendChild(historyItem);
        });
    }
    
    // Load a calculation from history
    function loadCalculation(calculation) {
        // Switch to appropriate tab
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === calculation.type) {
                btn.click();
            }
        });
        
        // Hide welcome screen
        welcomeScreen.style.display = 'none';
        
        if (calculation.type === 'single-event') {
            // Load single event calculation
            const params = calculation.params;
            
            // Set client name
            if (document.getElementById('clientName')) {
                document.getElementById('clientName').value = params.clientName || '';
            }
            
            // Set service type
            document.getElementById('serviceType').value = params.serviceType;
            
            // Trigger change event to update UI
            const event = new Event('change');
            document.getElementById('serviceType').dispatchEvent(event);
            
            // Set other fields
            document.getElementById('totalHours').value = params.totalHours;
            document.getElementById('appTime').value = params.appTime;
            document.getElementById('numPros').value = params.numPros;
            document.getElementById('proHourly').value = params.proHourly;
            document.getElementById('discountPercent').value = params.discountPercent;
            
            // Set service-specific fields
            if (params.serviceType === 'headshot') {
                document.getElementById('retouchingCost').value = params.retouchingCost;
            } else {
                document.getElementById('hourlyRate').value = params.hourlyRate;
                document.getElementById('earlyArrival').value = params.earlyArrival;
            }
            
            // Set events per year
            document.getElementById('eventsPerYear').value = params.eventsPerYear || 12;
            
            // Calculate results if not a draft
            if (!calculation.isDraft) {
                calculateAndDisplayResults();
            }
        } else if (calculation.type === 'multi-day') {
            // Reset multi-day calculator first
            resetMultiDayCalculator();
            
            // Set client name
            if (document.getElementById('multiDayClientName')) {
                document.getElementById('multiDayClientName').value = calculation.clientName || '';
            }
            
            // Load multi-day calculation
            const days = calculation.days || [];
            
            // Initialize day counter
            dayCounter = 1;
            
            // Load first day if it exists
            if (days.length > 0) {
                const day1 = days[0];
                const day1Config = document.querySelector('.day-config[data-day-id="1"]');
                
                // Initialize Day 1 form if needed
                const day1Form = day1Config.querySelector('.day-form');
                if (day1Form && day1Form.children.length === 0) {
                    initializeDay1Form();
                }
                
                // Set location
                day1Config.querySelector('#location-1').value = day1.location;
                
                // Set form values
                const params = day1.params;
                day1Form.querySelector('[name="serviceType-day1"]').value = params.serviceType;
                
                // Trigger change event to update UI
                const event = new Event('change');
                day1Form.querySelector('[name="serviceType-day1"]').dispatchEvent(event);
                
                // Set other fields
                day1Form.querySelector('[name="totalHours-day1"]').value = params.totalHours;
                day1Form.querySelector('[name="appTime-day1"]').value = params.appTime;
                day1Form.querySelector('[name="numPros-day1"]').value = params.numPros;
                day1Form.querySelector('[name="proHourly-day1"]').value = params.proHourly;
                day1Form.querySelector('[name="discountPercent-day1"]').value = params.discountPercent;
                
                // Set service-specific fields
                if (params.serviceType === 'headshot') {
                    day1Form.querySelector('[name="retouchingCost-day1"]').value = params.retouchingCost;
                } else {
                    day1Form.querySelector('[name="hourlyRate-day1"]').value = params.hourlyRate;
                    day1Form.querySelector('[name="earlyArrival-day1"]').value = params.earlyArrival;
                }
                
                // Set events per year
                day1Form.querySelector('[name="eventsPerYear-day1"]').value = params.eventsPerYear || 12;
            }
            
            // Add additional days
            for (let i = 1; i < days.length; i++) {
                addNewDay();
                
                const day = days[i];
                const dayConfig = document.querySelector(`.day-config[data-day-id="${dayCounter}"]`);
                
                // Set location
                dayConfig.querySelector(`#location-${dayCounter}`).value = day.location;
                
                // Set form values
                const dayForm = dayConfig.querySelector('.day-form');
                const params = day.params;
                
                dayForm.querySelector(`[name="serviceType-day${dayCounter}"]`).value = params.serviceType;
                
                // Trigger change event to update UI
                const event = new Event('change');
                dayForm.querySelector(`[name="serviceType-day${dayCounter}"]`).dispatchEvent(event);
                
                // Set other fields
                dayForm.querySelector(`[name="totalHours-day${dayCounter}"]`).value = params.totalHours;
                dayForm.querySelector(`[name="appTime-day${dayCounter}"]`).value = params.appTime;
                dayForm.querySelector(`[name="numPros-day${dayCounter}"]`).value = params.numPros;
                dayForm.querySelector(`[name="proHourly-day${dayCounter}"]`).value = params.proHourly;
                dayForm.querySelector(`[name="discountPercent-day${dayCounter}"]`).value = params.discountPercent;
                
                // Set service-specific fields
                if (params.serviceType === 'headshot') {
                    dayForm.querySelector(`[name="retouchingCost-day${dayCounter}"]`).value = params.retouchingCost;
                } else {
                    dayForm.querySelector(`[name="hourlyRate-day${dayCounter}"]`).value = params.hourlyRate;
                    dayForm.querySelector(`[name="earlyArrival-day${dayCounter}"]`).value = params.earlyArrival;
                }
                
                // Set events per year
                dayForm.querySelector(`[name="eventsPerYear-day${dayCounter}"]`).value = params.eventsPerYear || 12;
            }
            
            // Calculate results if not a draft
            if (!calculation.isDraft) {
                calculateMultiDayResults();
            }
        }
        
        // If it's a draft, remove it from drafts after loading
        if (calculation.isDraft) {
            deleteCalculation(calculation.id, true);
        }
    }
    
    // Delete a calculation from history
    function deleteCalculation(id, isDraft) {
        if (confirm('Are you sure you want to delete this calculation?')) {
            if (isDraft) {
                // Remove from drafts
                draftCalculations = draftCalculations.filter(calc => calc.id !== id);
                localStorage.setItem('draftCalculations', JSON.stringify(draftCalculations));
            } else {
                // Remove from history
                calculationHistory = calculationHistory.filter(calc => calc.id !== id);
                localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
            }
            
            // Reload history
            loadHistory();
        }
    }
    
    // Clear all history
    function clearHistory() {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            calculationHistory = [];
            draftCalculations = [];
            localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
            localStorage.setItem('draftCalculations', JSON.stringify(draftCalculations));
            loadHistory();
        }
    }
});
