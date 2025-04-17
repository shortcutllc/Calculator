const { PricingCalculator } = require('../calculation_model.js');
const { SERVICE_TYPES, EVENT_SIZES, PRESET_CONFIGURATIONS } = require('../js/constants/calculator-constants.js');
const { CalculatorValidation } = require('../js/validation/calculator-validation.js');

describe('PricingCalculator Core Functionality', () => {
    let calculator;

    beforeEach(() => {
        calculator = new PricingCalculator();
    });

    describe('Preset Configurations', () => {
        // Test all service types and sizes
        Object.keys(PRESET_CONFIGURATIONS).forEach(serviceType => {
            Object.keys(PRESET_CONFIGURATIONS[serviceType]).forEach(size => {
                test(`${serviceType} ${size} preset matches exact values`, () => {
                    const preset = PricingCalculator.getPresetConfiguration(serviceType, size);
                    expect(preset).toEqual(PRESET_CONFIGURATIONS[serviceType][size]);
                });
            });
        });

        // Test invalid preset requests
        test('throws error for invalid service type', () => {
            expect(() => {
                CalculatorValidation.validatePresetParams('invalid-service', 'small');
            }).toThrow('Invalid service type');
        });

        test('throws error for invalid size', () => {
            expect(() => {
                CalculatorValidation.validatePresetParams('massage/spa', 'invalid-size');
            }).toThrow('Invalid event size');
        });
    });

    describe('Single Event Calculations', () => {
        // Test all service types and sizes
        Object.keys(PRESET_CONFIGURATIONS).forEach(serviceType => {
            Object.keys(PRESET_CONFIGURATIONS[serviceType]).forEach(size => {
                test(`${serviceType} ${size} event calculates correctly`, () => {
                    const params = PricingCalculator.getPresetConfiguration(serviceType, size);
                    const result = calculator.calculate(params);
                    
                    // Test appointment calculations
                    const expectedAppts = calculateExpectedAppointments(params);
                    expect(result.totalAppts).toBe(expectedAppts);
                    
                    // Test revenue calculations
                    const expectedProRev = calculateExpectedProRevenue(params);
                    expect(result.totalProRev).toBe(expectedProRev);
                    
                    // Test total cost calculations
                    const expectedCost = calculateExpectedTotalCost(params);
                    expect(result.totalCost).toBe(expectedCost);
                });
            });
        });

        // Test validation errors
        test('throws error for invalid appointment time', () => {
            const params = {...PRESET_CONFIGURATIONS['massage/spa'].small, appTime: 5};
            expect(() => {
                CalculatorValidation.validateSingleEventParams(params);
            }).toThrow('Appointment time must be between');
        });

        test('throws error for invalid hourly rate', () => {
            const params = {...PRESET_CONFIGURATIONS['massage/spa'].small, hourlyRate: 30};
            expect(() => {
                CalculatorValidation.validateSingleEventParams(params);
            }).toThrow('Hourly rate must be at least');
        });
    });

    describe('Multi-Day Calculations', () => {
        test('multiple day calculation preserves individual day integrity', () => {
            const configs = [
                { ...PRESET_CONFIGURATIONS['massage/spa'].small, day: 'Day 1' },
                { ...PRESET_CONFIGURATIONS['hair/nails'].medium, day: 'Day 2' },
                { ...PRESET_CONFIGURATIONS['headshot'].large, day: 'Day 3' }
            ];
            
            const result = calculator.calculateMultiple(configs);
            
            // Verify each day's calculations
            configs.forEach((config, index) => {
                const singleResult = calculator.calculate(config);
                expect(result.dayResults[index].totalAppts).toBe(singleResult.totalAppts);
                expect(result.dayResults[index].totalProRev).toBe(singleResult.totalProRev);
                expect(result.dayResults[index].totalCost).toBe(singleResult.totalCost);
            });

            // Verify total calculations
            expect(result.totalAppts).toBe(
                configs.reduce((sum, config) => sum + calculator.calculate(config).totalAppts, 0)
            );
            expect(result.totalCost).toBe(
                configs.reduce((sum, config) => sum + calculator.calculate(config).totalCost, 0)
            );
        });

        test('throws error for empty configurations array', () => {
            expect(() => {
                CalculatorValidation.validateMultiDayParams([], 12);
            }).toThrow('Configurations must be a non-empty array');
        });

        test('throws error for invalid events per year', () => {
            const configs = [PRESET_CONFIGURATIONS['massage/spa'].small];
            expect(() => {
                CalculatorValidation.validateMultiDayParams(configs, -1);
            }).toThrow('Events per year must be a positive integer');
        });
    });
});

// Helper functions for calculating expected values
function calculateExpectedAppointments(params) {
    const apptsPerHour = 60 / params.appTime;
    return Math.floor(params.totalHours * params.numPros * apptsPerHour);
}

function calculateExpectedProRevenue(params) {
    return params.totalHours * params.numPros * params.proHourly;
}

function calculateExpectedTotalCost(params) {
    let cost = params.totalHours * params.numPros * params.proHourly;
    if (params.serviceType !== 'headshot') {
        cost += params.earlyArrival;
    } else {
        cost += calculateExpectedAppointments(params) * params.retouchingCost;
    }
    return cost;
} 