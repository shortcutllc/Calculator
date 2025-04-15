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
    event.preventDefault();
    const password = document.getElementById('password-input').value;
    const correctPassword = 'shortcut2024'; // This should match your expected password

    if (password === correctPassword) {
        document.getElementById('password-screen').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
        // Save successful login in session storage
        sessionStorage.setItem('authenticated', 'true');
    } else {
        showError('Incorrect password. Please try again.');
        document.getElementById('password-input').value = '';
    }
    return false;
}

// Check for saved authentication on page load
window.addEventListener('load', function() {
    if (sessionStorage.getItem('authenticated') === 'true') {
        document.getElementById('password-screen').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    }
}); 