// Test suite for preset functionality
function testPresetLoading() {
    // Test loading massage/spa presets
    loadPreset('massage/spa', 'small');
    console.assert(
        document.getElementById('total-hours').value === '4',
        'Small massage preset should set 4 hours'
    );
    console.assert(
        document.getElementById('num-professionals').value === '2',
        'Small massage preset should set 2 professionals'
    );

    // Test loading headshot presets
    loadPreset('headshot', 'medium');
    console.assert(
        document.getElementById('pro-hourly').value === '400',
        'Medium headshot preset should set $400 hourly rate'
    );
}

function testPresetPopulation() {
    // Test populating massage/spa presets
    populatePresets('massage/spa');
    const presetContainer = document.getElementById('preset-container');
    console.assert(
        presetContainer.children.length === 3,
        'Should create 3 preset options for massage/spa'
    );
}

// Run tests
function runTests() {
    console.log('Running preset tests...');
    testPresetLoading();
    testPresetPopulation();
    console.log('Preset tests completed');
} 