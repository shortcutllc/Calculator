const { ResultVisibilityChecker } = require('../js/validation/result-visibility-checker');
const { PricingCalculator } = require('../calculation_model.js');
const { PRESET_CONFIGURATIONS } = require('../js/constants/calculator-constants');

describe('Result Visibility Tests', () => {
    let calculator;

    beforeEach(() => {
        calculator = new PricingCalculator();
    });

    describe('Single Event Results', () => {
        test('massage/spa small event shows all required fields', () => {
            const params = PRESET_CONFIGURATIONS['massage/spa'].small;
            const results = calculator.calculate(params);
            const visibility = ResultVisibilityChecker.validateResultVisibility(results);
            
            expect(visibility.isValid).toBe(true);
            expect(visibility.errorMessage).toBeNull();
        });

        test('detects missing required fields', () => {
            const incompleteResults = {
                totalAppts: 24,
                // Missing totalCost
                totalHours: 4
                // Missing other required fields
            };

            const visibility = ResultVisibilityChecker.validateResultVisibility(incompleteResults);
            expect(visibility.isValid).toBe(false);
            expect(visibility.missingFields).toContain('Total Cost');
        });

        test('detects empty fields', () => {
            const resultsWithEmpty = {
                totalAppts: 24,
                totalCost: null,
                totalHours: undefined,
                numPros: 2,
                shortcutNet: 500,
                shortcutMargin: 25,
                totalProRev: 400
            };

            const visibility = ResultVisibilityChecker.validateResultVisibility(resultsWithEmpty);
            expect(visibility.isValid).toBe(false);
            expect(visibility.emptyFields).toContain('Total Cost');
            expect(visibility.emptyFields).toContain('Total Hours');
        });
    });

    describe('Multi-Day Results', () => {
        test('multi-day event shows all required fields for each day', () => {
            const configs = [
                PRESET_CONFIGURATIONS['massage/spa'].small,
                PRESET_CONFIGURATIONS['hair/nails'].medium
            ];
            const results = calculator.calculateMultiple(configs);
            const visibility = ResultVisibilityChecker.validateResultVisibility(results);
            
            expect(visibility.isValid).toBe(true);
            expect(visibility.errorMessage).toBeNull();
        });

        test('detects missing fields in day results', () => {
            const incompleteMultiResults = {
                totalAppts: 56,
                totalCost: 2500,
                shortcutNet: 1000,
                shortcutMargin: 40,
                dayResults: [
                    {
                        totalAppts: 24,
                        // Missing totalCost for day 1
                    },
                    {
                        totalAppts: 32,
                        totalCost: 1500
                    }
                ]
            };

            const visibility = ResultVisibilityChecker.validateResultVisibility(incompleteMultiResults);
            expect(visibility.isValid).toBe(false);
            expect(visibility.missingFields).toContain('Day 1 Total Cost');
        });
    });

    describe('Result Formatting', () => {
        test('validates currency formatting', () => {
            const results = {
                totalCost: 1234.56,
                shortcutNet: 500,
                totalProRev: 400
            };

            const formatting = ResultVisibilityChecker.validateResultFormatting(results);
            expect(formatting.isValid).toBe(true);
        });

        test('validates percentage formatting', () => {
            const results = {
                shortcutMargin: 25.5
            };

            const formatting = ResultVisibilityChecker.validateResultFormatting(results);
            expect(formatting.isValid).toBe(true);
        });

        test('detects invalid integer fields', () => {
            const results = {
                totalAppts: 24.5, // Should be integer
                numPros: 2,
                totalHours: 4
            };

            const formatting = ResultVisibilityChecker.validateResultFormatting(results);
            expect(formatting.isValid).toBe(false);
            expect(formatting.formattingErrors).toContain('totalAppts must be an integer');
        });
    });

    describe('Location Results', () => {
        test('validates location-specific results', () => {
            const results = {
                totalAppts: 56,
                totalCost: 2500,
                shortcutNet: 1000,
                shortcutMargin: 40,
                locationResults: {
                    'Location A': {
                        totalAppts: 24,
                        totalCost: 1000,
                        shortcutNet: 400,
                        shortcutMargin: 40,
                        totalProRev: 200,
                        totalHours: 4,
                        numPros: 2
                    },
                    'Location B': {
                        totalAppts: 32,
                        totalCost: 1500,
                        shortcutNet: 600,
                        shortcutMargin: 40,
                        totalProRev: 300,
                        totalHours: 6,
                        numPros: 3
                    }
                }
            };

            const visibility = ResultVisibilityChecker.validateResultVisibility(results);
            expect(visibility.isValid).toBe(true);
            expect(visibility.errorMessage).toBeNull();
        });

        test('detects missing location results', () => {
            const results = {
                totalAppts: 56,
                totalCost: 2500,
                shortcutNet: 1000,
                shortcutMargin: 40,
                locationResults: {
                    'Location A': {
                        totalAppts: 24,
                        // Missing totalCost
                    }
                }
            };

            const visibility = ResultVisibilityChecker.validateResultVisibility(results);
            expect(visibility.isValid).toBe(false);
            expect(visibility.missingFields).toContain('Location Location A Total Cost');
        });
    });
}); 