/**
 * Calculator Business Rules and Constants
 * IMPORTANT: These values are critical to the calculator's integrity.
 * DO NOT modify without proper validation and testing.
 */

export const SERVICE_TYPES = {
    MASSAGE_SPA: 'massage/spa',
    HAIR_NAILS: 'hair/nails',
    HEADSHOT: 'headshot'
};

export const EVENT_SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
};

// Preserve exact values from original calculator
export const PRESET_CONFIGURATIONS = {
    'massage/spa': {
        small: {
            name: 'Small Event (24 appointments)',
            totalHours: 4,
            appTime: 20,
            numPros: 2,
            proHourly: 50,
            hourlyRate: 135,
            earlyArrival: 100,
            description: '24 appointments (2 pros × 4 hours × 3 appts/hour)'
        },
        medium: {
            name: 'Medium Event (36 appointments)',
            totalHours: 4,
            appTime: 20,
            numPros: 3,
            proHourly: 50,
            hourlyRate: 135,
            earlyArrival: 200,
            description: '36 appointments (3 pros × 4 hours × 3 appts/hour)'
        },
        large: {
            name: 'Large Event (54 appointments)',
            totalHours: 6,
            appTime: 20,
            numPros: 3,
            proHourly: 50,
            hourlyRate: 135,
            earlyArrival: 300,
            description: '54 appointments (3 pros × 6 hours × 3 appts/hour)'
        }
    },
    'hair/nails': {
        small: {
            name: 'Small Event (24 appointments)',
            totalHours: 6,
            appTime: 30,
            numPros: 2,
            proHourly: 50,
            hourlyRate: 135,
            earlyArrival: 100,
            description: '24 appointments (2 pros × 6 hours × 2 appts/hour)'
        },
        medium: {
            name: 'Medium Event (32 appointments)',
            totalHours: 8,
            appTime: 30,
            numPros: 2,
            proHourly: 50,
            hourlyRate: 135,
            earlyArrival: 200,
            description: '32 appointments (2 pros × 8 hours × 2 appts/hour)'
        },
        large: {
            name: 'Large Event (48 appointments)',
            totalHours: 8,
            appTime: 30,
            numPros: 3,
            proHourly: 50,
            hourlyRate: 135,
            earlyArrival: 300,
            description: '48 appointments (3 pros × 8 hours × 2 appts/hour)'
        }
    },
    'headshot': {
        small: {
            name: 'Small Event (30 appointments)',
            totalHours: 3,
            appTime: 12,
            numPros: 2,
            proHourly: 400,
            retouchingCost: 40,
            description: '30 appointments (2 pros × 3 hours × 5 appts/hour)'
        },
        medium: {
            name: 'Medium Event (60 appointments)',
            totalHours: 4,
            appTime: 12,
            numPros: 3,
            proHourly: 400,
            retouchingCost: 40,
            description: '60 appointments (3 pros × 4 hours × 5 appts/hour)'
        },
        large: {
            name: 'Large Event (90 appointments)',
            totalHours: 6,
            appTime: 12,
            numPros: 3,
            proHourly: 400,
            retouchingCost: 40,
            description: '90 appointments (3 pros × 6 hours × 5 appts/hour)'
        }
    }
};

// Default values and constraints
export const CALCULATOR_DEFAULTS = {
    EVENTS_PER_YEAR: 12,
    MIN_APPOINTMENT_TIME: 10,
    MAX_APPOINTMENT_TIME: 120,
    MIN_HOURLY_RATE: 50,
    MAX_HOURLY_RATE: 1000,
    DEFAULT_EARLY_ARRIVAL_FEE: 100
}; 