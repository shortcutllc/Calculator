/**
 * Validates that all calculator results are visible and properly populated
 */
export class ResultVisibilityChecker {
    /**
     * Checks if all required result fields are present and populated
     * @param {Object} results - The calculation results
     * @returns {Object} Validation results with any missing or invalid fields
     */
    static validateResultVisibility(results) {
        const missingFields = [];
        const emptyFields = [];
        const invalidFields = [];

        // Required fields that must be present and populated
        const requiredFields = {
            // Client-facing results
            totalAppts: 'Total Appointments',
            totalCost: 'Total Cost',
            totalHours: 'Total Hours',
            numPros: 'Number of Professionals',
            
            // Shortcut-specific results
            shortcutNet: 'Shortcut Net Revenue',
            shortcutMargin: 'Shortcut Margin',
            totalProRev: 'Professional Revenue'
        };

        // Check each required field
        Object.entries(requiredFields).forEach(([field, displayName]) => {
            if (!(field in results)) {
                missingFields.push(displayName);
            } else if (results[field] === null || results[field] === undefined) {
                emptyFields.push(displayName);
            } else if (typeof results[field] === 'number' && isNaN(results[field])) {
                invalidFields.push(displayName);
            }
        });

        // Special checks for multi-day results
        if (results.dayResults) {
            results.dayResults.forEach((dayResult, index) => {
                Object.entries(requiredFields).forEach(([field, displayName]) => {
                    if (!(field in dayResult)) {
                        missingFields.push(`Day ${index + 1} ${displayName}`);
                    } else if (dayResult[field] === null || dayResult[field] === undefined) {
                        emptyFields.push(`Day ${index + 1} ${displayName}`);
                    } else if (typeof dayResult[field] === 'number' && isNaN(dayResult[field])) {
                        invalidFields.push(`Day ${index + 1} ${displayName}`);
                    }
                });
            });
        }

        // Check location results if present
        if (results.locationResults) {
            Object.entries(results.locationResults).forEach(([location, locationResult]) => {
                Object.entries(requiredFields).forEach(([field, displayName]) => {
                    if (!(field in locationResult)) {
                        missingFields.push(`Location ${location} ${displayName}`);
                    } else if (locationResult[field] === null || locationResult[field] === undefined) {
                        emptyFields.push(`Location ${location} ${displayName}`);
                    } else if (typeof locationResult[field] === 'number' && isNaN(locationResult[field])) {
                        invalidFields.push(`Location ${location} ${displayName}`);
                    }
                });
            });
        }

        const hasErrors = missingFields.length > 0 || emptyFields.length > 0 || invalidFields.length > 0;

        return {
            isValid: !hasErrors,
            missingFields,
            emptyFields,
            invalidFields,
            errorMessage: hasErrors ? this.#generateErrorMessage(missingFields, emptyFields, invalidFields) : null
        };
    }

    /**
     * Generates a user-friendly error message
     * @private
     */
    static #generateErrorMessage(missingFields, emptyFields, invalidFields) {
        const messages = [];
        
        if (missingFields.length > 0) {
            messages.push(`Missing fields: ${missingFields.join(', ')}`);
        }
        if (emptyFields.length > 0) {
            messages.push(`Empty fields: ${emptyFields.join(', ')}`);
        }
        if (invalidFields.length > 0) {
            messages.push(`Invalid fields: ${invalidFields.join(', ')}`);
        }

        return messages.join('\n');
    }

    /**
     * Checks if the results are properly formatted for display
     * @param {Object} results - The calculation results
     * @returns {boolean} True if results are properly formatted
     */
    static validateResultFormatting(results) {
        const formattingErrors = [];

        // Check currency formatting
        const currencyFields = ['totalCost', 'shortcutNet', 'totalProRev'];
        currencyFields.forEach(field => {
            if (field in results && typeof results[field] === 'number') {
                const formatted = results[field].toLocaleString('en-US', { 
                    style: 'currency', 
                    currency: 'USD' 
                });
                if (!formatted.startsWith('$')) {
                    formattingErrors.push(`${field} not properly formatted as currency`);
                }
            }
        });

        // Check percentage formatting
        if ('shortcutMargin' in results && typeof results.shortcutMargin === 'number') {
            const formatted = `${results.shortcutMargin.toFixed(2)}%`;
            if (!formatted.endsWith('%')) {
                formattingErrors.push('shortcutMargin not properly formatted as percentage');
            }
        }

        // Check integer formatting
        const integerFields = ['totalAppts', 'numPros', 'totalHours'];
        integerFields.forEach(field => {
            if (field in results && !Number.isInteger(results[field])) {
                formattingErrors.push(`${field} must be an integer`);
            }
        });

        return {
            isValid: formattingErrors.length === 0,
            formattingErrors
        };
    }
} 