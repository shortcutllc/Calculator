function loadPreset(serviceType, presetSize) {
    try {
        const preset = PricingCalculator.getPresetConfiguration(serviceType, presetSize);
        if (!preset) {
            console.error(`No preset found for service type ${serviceType} and size ${presetSize}`);
            return;
        }

        // Update form fields with preset values
        document.getElementById('total-hours').value = preset.totalHours;
        document.getElementById('appointment-time').value = preset.appTime;
        document.getElementById('num-professionals').value = preset.numPros;
        
        if (serviceType === 'headshot') {
            document.getElementById('pro-hourly').value = preset.proHourly;
            document.getElementById('retouching-cost').value = preset.retouchingCost;
        } else {
            document.getElementById('pro-hourly').value = preset.proHourly;
            document.getElementById('hourly-rate').value = preset.hourlyRate;
            document.getElementById('early-arrival').value = preset.earlyArrival;
        }

        // Trigger calculation update
        calculateTotal();
        
        // Show success message
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = `Loaded ${preset.name} configuration`;
        messageDiv.style.color = '#28a745';
        setTimeout(() => messageDiv.textContent = '', 3000);
    } catch (error) {
        console.error('Error loading preset:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'Error loading preset configuration';
        messageDiv.style.color = '#dc3545';
        setTimeout(() => messageDiv.textContent = '', 3000);
    }
}

function populatePresets(serviceType) {
    try {
        const presets = PricingCalculator.getPresetsForService(serviceType);
        const presetContainer = document.getElementById('preset-container');
        
        if (!presetContainer) {
            console.error('Preset container element not found');
            return;
        }
        
        presetContainer.innerHTML = '';

        if (!presets || Object.keys(presets).length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No presets available for this service type';
            message.className = 'preset-message';
            presetContainer.appendChild(message);
            return;
        }

        Object.entries(presets).forEach(([size, config]) => {
            try {
                const presetDiv = document.createElement('div');
                presetDiv.className = 'preset-option';
                
                const button = document.createElement('button');
                button.className = 'preset-button';
                button.textContent = config.name;
                button.onclick = () => loadPreset(serviceType, size);
                
                const description = document.createElement('p');
                description.className = 'preset-description';
                description.textContent = config.description;

                presetDiv.appendChild(button);
                presetDiv.appendChild(description);
                presetContainer.appendChild(presetDiv);
            } catch (error) {
                console.error(`Error creating preset button for ${size}:`, error);
            }
        });
    } catch (error) {
        console.error('Error populating presets:', error);
        const presetContainer = document.getElementById('preset-container');
        if (presetContainer) {
            const message = document.createElement('p');
            message.textContent = 'Error loading presets';
            message.className = 'preset-message error';
            presetContainer.innerHTML = '';
            presetContainer.appendChild(message);
        }
    }
}

function showError(message) {
    const errorElement = document.getElementById('password-error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    setTimeout(() => errorElement.classList.remove('show'), 3000);
}

function checkPassword(event) {
    if (event) event.preventDefault();
    
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const urlPassword = urlParams.get('password');
    
    // Get password from input if no URL parameter
    const inputPassword = document.getElementById('password-input')?.value;
    const password = urlPassword || inputPassword;
    
    const correctPassword = 'LouieJack1!'; // Updated to correct password

    if (password === correctPassword) {
        document.getElementById('password-screen').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
        // Save successful login in session storage
        sessionStorage.setItem('authenticated', 'true');
        return true;
    } else {
        if (!urlPassword) { // Only show error if checking input password
            showError('Incorrect password. Please try again.');
            if (document.getElementById('password-input')) {
                document.getElementById('password-input').value = '';
            }
        }
        return false;
    }
}

// Check for saved authentication or URL parameter on page load
window.addEventListener('load', function() {
    if (sessionStorage.getItem('authenticated') === 'true' || checkPassword()) {
        document.getElementById('password-screen').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    }
});

function closeShareModal() {
    document.getElementById('share-modal').style.display = 'none';
}

function showShareModal() {
    const modal = document.getElementById('share-modal');
    modal.style.display = 'flex';
    
    // Add click event to close button if not already added
    const closeBtn = modal.querySelector('.close-button');
    if (closeBtn) {
        closeBtn.onclick = closeShareModal;
    }
    
    // Close modal when clicking outside
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeShareModal();
        }
    };
}

function saveDraft() {
    const formData = {
        serviceType: document.getElementById('service-type').value,
        totalHours: document.getElementById('total-hours').value,
        appTime: document.getElementById('appointment-time').value,
        numPros: document.getElementById('num-professionals').value,
        proHourly: document.getElementById('pro-hourly').value,
        hourlyRate: document.getElementById('hourly-rate').value,
        earlyArrival: document.getElementById('early-arrival').value,
        retouchingCost: document.getElementById('retouching-cost').value,
        clientName: document.getElementById('client-name').value,
        timestamp: new Date().toISOString()
    };

    // Get existing drafts or initialize empty array
    let drafts = JSON.parse(localStorage.getItem('calculatorDrafts') || '[]');
    
    // Add new draft to beginning of array
    drafts.unshift(formData);
    
    // Keep only last 10 drafts
    drafts = drafts.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem('calculatorDrafts', JSON.stringify(drafts));
    
    // Show success message
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = 'Draft saved successfully';
    messageDiv.style.color = '#28a745';
    setTimeout(() => messageDiv.textContent = '', 3000);
    
    // Update history display
    displayHistory();
}

function loadDraft(index) {
    const drafts = JSON.parse(localStorage.getItem('calculatorDrafts') || '[]');
    const draft = drafts[index];
    
    if (!draft) return;
    
    // Populate form fields
    document.getElementById('service-type').value = draft.serviceType;
    document.getElementById('total-hours').value = draft.totalHours;
    document.getElementById('appointment-time').value = draft.appTime;
    document.getElementById('num-professionals').value = draft.numPros;
    document.getElementById('pro-hourly').value = draft.proHourly;
    document.getElementById('hourly-rate').value = draft.hourlyRate;
    document.getElementById('early-arrival').value = draft.earlyArrival;
    document.getElementById('retouching-cost').value = draft.retouchingCost;
    document.getElementById('client-name').value = draft.clientName;
    
    // Trigger calculation
    calculateTotal();
}

function displayHistory() {
    const historyContainer = document.getElementById('history-container');
    const drafts = JSON.parse(localStorage.getItem('calculatorDrafts') || '[]');
    
    if (!historyContainer) return;
    
    historyContainer.innerHTML = '';
    
    if (drafts.length === 0) {
        historyContainer.innerHTML = '<p class="no-history">No saved drafts</p>';
        return;
    }
    
    drafts.forEach((draft, index) => {
        const draftElement = document.createElement('div');
        draftElement.className = 'history-item';
        
        const date = new Date(draft.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        draftElement.innerHTML = `
            <div class="history-content">
                <h4>${draft.clientName || 'Unnamed Draft'}</h4>
                <p>${draft.serviceType} - ${draft.numPros} pros, ${draft.totalHours} hours</p>
                <p class="history-date">${formattedDate}</p>
            </div>
            <button onclick="loadDraft(${index})">Load</button>
        `;
        
        historyContainer.appendChild(draftElement);
    });
}

// Initialize history display on page load
window.addEventListener('load', displayHistory); 