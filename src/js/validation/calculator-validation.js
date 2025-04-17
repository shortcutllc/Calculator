import { SERVICE_TYPES, EVENT_SIZES, CALCULATOR_DEFAULTS, PRESET_CONFIGURATIONS } from '../constants/calculator-constants';

/**
 * Validates calculator inputs to ensure calculation integrity
 */
export class CalculatorValidation {
    /**
     * Validates single event calculation parameters
     * @param {Object} params - Calculation parameters
     * @throws {Error} If validation fails
     */
    static validateSingleEventParams(params) {
        const {
            serviceType,
            totalHours,
            appTime,
            proHourly,
            numPros,
            hourlyRate,
            earlyArrival,
            retouchingCost
        } = params;

        // Service type validation
        if (!Object.values(SERVICE_TYPES).includes(serviceType)) {
            throw new Error(`Invalid service type: ${serviceType}`);
        }

        // Numeric validations
        if (!Number.isFinite(totalHours) || totalHours <= 0) {
            throw new Error('Total hours must be a positive number');
        }

        if (!Number.isFinite(appTime) || 
            appTime < CALCULATOR_DEFAULTS.MIN_APPOINTMENT_TIME || 
            appTime > CALCULATOR_DEFAULTS.MAX_APPOINTMENT_TIME) {
            throw new Error(`Appointment time must be between ${CALCULATOR_DEFAULTS.MIN_APPOINTMENT_TIME} and ${CALCULATOR_DEFAULTS.MAX_APPOINTMENT_TIME} minutes`);
        }

        if (!Number.isFinite(proHourly) || proHourly < CALCULATOR_DEFAULTS.MIN_HOURLY_RATE) {
            throw new Error(`Professional hourly rate must be at least ${CALCULATOR_DEFAULTS.MIN_HOURLY_RATE}`);
        }

        if (!Number.isInteger(numPros) || numPros <= 0) {
            throw new Error('Number of professionals must be a positive integer');
        }

        // Service-specific validations
        if (serviceType === SERVICE_TYPES.HEADSHOT) {
            if (!Number.isFinite(retouchingCost) || retouchingCost < 0) {
                throw new Error('Retouching cost must be a non-negative number for headshot service');
            }
        } else {
            if (!Number.isFinite(hourlyRate) || hourlyRate < CALCULATOR_DEFAULTS.MIN_HOURLY_RATE) {
                throw new Error(`Hourly rate must be at least ${CALCULATOR_DEFAULTS.MIN_HOURLY_RATE}`);
            }
            if (!Number.isFinite(earlyArrival) || earlyArrival < 0) {
                throw new Error('Early arrival fee must be a non-negative number');
            }
        }
    }

    /**
     * Validates multi-day calculation parameters
     * @param {Array} configurations - Array of day configurations
     * @param {number} eventsPerYear - Number of events per year
     * @throws {Error} If validation fails
     */
    static validateMultiDayParams(configurations, eventsPerYear) {
        if (!Array.isArray(configurations) || configurations.length === 0) {
            throw new Error('Configurations must be a non-empty array');
        }

        // Validate each configuration
        configurations.forEach((config, index) => {
            try {
                this.validateSingleEventParams(config);
            } catch (error) {
                throw new Error(`Invalid configuration for day ${index + 1}: ${error.message}`);
            }
        });

        // Validate events per year
        if (!Number.isInteger(eventsPerYear) || eventsPerYear <= 0) {
            throw new Error('Events per year must be a positive integer');
        }
    }

    /**
     * Validates preset configuration parameters
     * @param {string} serviceType - Type of service
     * @param {string} size - Size of event
     * @throws {Error} If validation fails
     */
    static validatePresetParams(serviceType, size) {
        if (!Object.values(SERVICE_TYPES).includes(serviceType)) {
            throw new Error(`Invalid service type: ${serviceType}`);
        }

        if (!Object.values(EVENT_SIZES).includes(size)) {
            throw new Error(`Invalid event size: ${size}`);
        }
    }

    /**
     * Validates that the calculated appointments match the preset expectations
     * @param {Object} params - Calculation parameters
     * @param {number} calculatedAppts - Number of calculated appointments
     * @throws {Error} If validation fails
     */
    static validateAppointmentCount(params, calculatedAppts) {
        const preset = PRESET_CONFIGURATIONS[params.serviceType]?.[params.size];
        if (preset) {
            const expectedAppts = this.calculateExpectedAppointments(preset);
            if (calculatedAppts !== expectedAppts) {
                throw new Error(`Appointment count mismatch: expected ${expectedAppts}, got ${calculatedAppts}`);
            }
        }
    }

    /**
     * Validates that the calculated costs match the preset expectations
     * @param {Object} params - Calculation parameters
     * @param {number} calculatedCost - Calculated total cost
     * @throws {Error} If validation fails
     */
    static validateCostCalculation(params, calculatedCost) {
        const preset = PRESET_CONFIGURATIONS[params.serviceType]?.[params.size];
        if (preset) {
            const expectedCost = this.calculateExpectedTotalCost(preset);
            if (Math.abs(calculatedCost - expectedCost) > 0.01) { // Allow for small floating point differences
                throw new Error(`Cost calculation mismatch: expected ${expectedCost}, got ${calculatedCost}`);
            }
        }
    }

    /**
     * Validates that the professional revenue calculations are correct
     * @param {Object} params - Calculation parameters
     * @param {number} calculatedRev - Calculated professional revenue
     * @throws {Error} If validation fails
     */
    static validateProRevenue(params, calculatedRev) {
        const expectedRev = params.totalHours * params.numPros * params.proHourly;
        if (Math.abs(calculatedRev - expectedRev) > 0.01) {
            throw new Error(`Professional revenue mismatch: expected ${expectedRev}, got ${calculatedRev}`);
        }
    }

    /**
     * Validates service-specific constraints
     * @param {Object} params - Calculation parameters
     * @throws {Error} If validation fails
     */
    static validateServiceConstraints(params) {
        switch (params.serviceType) {
            case SERVICE_TYPES.MASSAGE_SPA:
            case SERVICE_TYPES.HAIR_NAILS:
                if (params.appTime < 15) {
                    throw new Error(`${params.serviceType} appointments must be at least 15 minutes`);
                }
                break;
            case SERVICE_TYPES.HEADSHOT:
                if (params.appTime < 10 || params.appTime > 20) {
                    throw new Error('Headshot appointments must be between 10 and 20 minutes');
                }
                break;
        }

        // Validate professional limits
        if (params.numPros > 5) {
            throw new Error('Maximum 5 professionals allowed per event');
        }

        // Validate total hours
        if (params.totalHours > 12) {
            throw new Error('Maximum event duration is 12 hours');
        }
    }

    /**
     * Validates multi-location constraints
     * @param {Array} configurations - Array of day configurations
     * @throws {Error} If validation fails
     */
    static validateLocationConstraints(configurations) {
        const locations = new Set(configurations.map(config => config.location));
        
        // Check for duplicate locations on same day
        const locationDays = new Map();
        configurations.forEach(config => {
            const key = `${config.location}-${config.day}`;
            if (locationDays.has(key)) {
                throw new Error(`Duplicate location ${config.location} on ${config.day}`);
            }
            locationDays.set(key, true);
        });

        // Check for maximum locations
        if (locations.size > 10) {
            throw new Error('Maximum 10 different locations allowed');
        }
    }

    // Helper functions for validation
    static #calculateExpectedAppointments(params) {
        const apptsPerHour = 60 / params.appTime;
        return Math.floor(params.totalHours * params.numPros * apptsPerHour);
    }

    static #calculateExpectedTotalCost(params) {
        let cost = params.totalHours * params.numPros * params.proHourly;
        if (params.serviceType !== SERVICE_TYPES.HEADSHOT) {
            cost += params.earlyArrival;
        } else {
            cost += this.#calculateExpectedAppointments(params) * params.retouchingCost;
        }
        return cost;
    }
} 