/**
 * Enhanced Pricing Calculator Model
 * 
 * This model implements the calculation logic for the wellness services pricing calculator
 * with support for multi-day events, multiple locations, and history feature.
 */

// Constants for validation and configuration
const VALID_SERVICE_TYPES = ['massage/spa', 'hair/nails', 'headshot'];
const DEFAULT_MARGIN = {
    'headshot': 20, // 20% margin for headshots
    'massage/spa': 25, // 25% margin for massage/spa
    'hair/nails': 25  // 25% margin for hair/nails
};
const CALCULATION_PRECISION = 2; // Number of decimal places for calculations
const CACHE_DURATION = 5 * 60 * 1000; // Cache duration in milliseconds (5 minutes)

// Add this before the class definition
const PRESET_CONFIGURATIONS = {
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

class PricingCalculator {
    constructor() {
        this.calculationCache = new Map();
        this.customServiceTypes = new Map();
    }

    /**
     * Validates input parameters for calculations
     * @private
     * @param {Object} params - Input parameters to validate
     * @throws {Error} If validation fails
     */
    _validateParams(params) {
        const {
            serviceType,
            totalHours,
            appTime,
            proHourly,
            numPros,
            hourlyRate,
        } = params;

        if (!serviceType || (!VALID_SERVICE_TYPES.includes(serviceType) && !this.customServiceTypes.has(serviceType))) {
            throw new Error(`Invalid service type: ${serviceType}`);
        }

        if (!Number.isFinite(totalHours) || totalHours <= 0) {
            throw new Error('Total hours must be a positive number');
        }

        if (!Number.isFinite(appTime) || appTime <= 0) {
            throw new Error('Appointment time must be a positive number');
        }

        if (!Number.isFinite(proHourly) || proHourly <= 0) {
            throw new Error('Professional hourly rate must be a positive number');
        }

        if (!Number.isInteger(numPros) || numPros <= 0) {
            throw new Error('Number of professionals must be a positive integer');
        }

        if (serviceType !== 'headshot' && (!Number.isFinite(hourlyRate) || hourlyRate <= 0)) {
            throw new Error('Hourly rate must be a positive number');
        }
    }

    /**
     * Generates a cache key for the given parameters
     * @private
     * @param {Object} params - Calculation parameters
     * @returns {string} Cache key
     */
    _generateCacheKey(params) {
        return JSON.stringify(params);
    }

    /**
     * Rounds a number to the specified precision
     * @private
     * @param {number} value - Value to round
     * @returns {number} Rounded value
     */
    _round(value) {
        return Number(Math.round(value + 'e' + CALCULATION_PRECISION) + 'e-' + CALCULATION_PRECISION);
    }

    /**
     * Adds a custom service type with specific margin and validation rules
     * @param {string} serviceType - Name of the custom service
     * @param {Object} config - Configuration for the custom service
     */
    addCustomServiceType(serviceType, config) {
        if (VALID_SERVICE_TYPES.includes(serviceType)) {
            throw new Error(`Cannot override built-in service type: ${serviceType}`);
        }

        this.customServiceTypes.set(serviceType, {
            margin: config.margin || 25,
            requiresRetouching: config.requiresRetouching || false,
            ...config
        });
    }

    /**
     * Calculate pricing details based on input parameters for multiple days and locations
     * 
     * @param {Array} configurations - Array of day/location configurations
     * @param {number} eventsPerYear - Number of events per year for annual calculation (optional)
     * @returns {Object} Calculated pricing details
     */
    calculateMultiple(configurations, eventsPerYear = 12) {
        // Ensure eventsPerYear is a valid number
        eventsPerYear = typeof eventsPerYear === 'number' && !isNaN(eventsPerYear) ? eventsPerYear : 12;
        
        // Initialize totals
        let totalResults = {
            totalAppts: 0,
            totalProRev: 0,
            totalCost: 0,
            shortcutNet: 0,
            totalAnnual: 0,
            dayResults: [],
            locationResults: {}
        };
        
        // Process each configuration (day/location)
        configurations.forEach((config, index) => {
            // Calculate results for this configuration
            const result = this.calculate(config);
            
            // Add to day results
            totalResults.dayResults.push({
                day: config.day || `Day ${index + 1}`,
                location: config.location || `Location ${index + 1}`,
                ...result
            });
            
            // Add to location totals
            const locationKey = config.location || `Location ${index + 1}`;
            if (!totalResults.locationResults[locationKey]) {
                totalResults.locationResults[locationKey] = {
                    totalAppts: 0,
                    totalProRev: 0,
                    totalCost: 0,
                    shortcutNet: 0
                };
            }
            
            // Update location totals
            totalResults.locationResults[locationKey].totalAppts += result.totalAppts;
            totalResults.locationResults[locationKey].totalProRev += result.totalProRev;
            totalResults.locationResults[locationKey].totalCost += result.totalCost;
            totalResults.locationResults[locationKey].shortcutNet += result.shortcutNet;
            
            // Update overall totals
            totalResults.totalAppts += result.totalAppts;
            totalResults.totalProRev += result.totalProRev;
            totalResults.totalCost += result.totalCost;
            totalResults.shortcutNet += result.shortcutNet;
        });
        
        // Calculate overall margin
        totalResults.shortcutMargin = (totalResults.shortcutNet / totalResults.totalCost) * 100;
        
        // Calculate annual totals
        totalResults.totalAnnual = totalResults.totalCost * eventsPerYear;
        
        // Calculate location margins
        Object.keys(totalResults.locationResults).forEach(location => {
            const locResult = totalResults.locationResults[location];
            locResult.shortcutMargin = (locResult.shortcutNet / locResult.totalCost) * 100;
        });
        
        return totalResults;
    }

    /**
     * Calculate pricing details based on input parameters for a single day/location
     * 
     * @param {Object} params - Input parameters for calculation
     * @param {string} params.serviceType - Type of service (massage/spa, hair/nails, or headshot)
     * @param {number} params.totalHours - Duration of the event in hours
     * @param {number} params.appTime - Appointment duration in minutes
     * @param {number} params.proHourly - Hourly rate paid to professionals ($)
     * @param {number} params.numPros - Number of professionals working
     * @param {number} params.hourlyRate - Rate charged to customers per hour ($)
     * @param {number} params.earlyArrival - Fee for early arrival ($)
     * @param {number} params.retouchingCost - Cost per headshot for retouching (for headshot service)
     * @param {number} params.discountPercent - Discount percentage to apply to total cost (optional)
     * @param {number} params.totalAppts - Total appointments (if specified directly instead of calculated)
     * @param {string} params.day - Day identifier (e.g., "Day 1", "Monday")
     * @param {string} params.location - Location identifier (e.g., "HQ", "Downtown Office")
     * @returns {Object} Calculated pricing details
     * @throws {Error} If validation fails
     */
    calculate(params) {
        // Validate input parameters
        this._validateParams(params);

        // Check cache first
        const cacheKey = this._generateCacheKey(params);
        const cachedResult = this.calculationCache.get(cacheKey);
        if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_DURATION) {
            return cachedResult.result;
        }

        // Extract parameters with improved defaults
        const {
            serviceType,
            totalHours,
            appTime,
            proHourly,
            numPros,
            hourlyRate,
            earlyArrival = 0,
            retouchingCost = 40,
            discountPercent = 0,
            totalAppts: specifiedTotalAppts = null,
            day = null,
            location = null
        } = params;

        // Calculate appointments with improved precision
        const apptsPerProPerHour = this._round(60 / appTime);
        const apptsPerHour = this._round(numPros * apptsPerProPerHour);
        const totalAppts = specifiedTotalAppts !== null ? 
            specifiedTotalAppts : 
            this._round(apptsPerHour * totalHours);

        let totalProRev, totalCost, shortcutNet, shortcutMargin;

        // Get margin based on service type (including custom services)
        const margin = this.customServiceTypes.has(serviceType) ?
            this.customServiceTypes.get(serviceType).margin :
            DEFAULT_MARGIN[serviceType];

        if (serviceType === 'headshot' || (this.customServiceTypes.has(serviceType) && this.customServiceTypes.get(serviceType).requiresRetouching)) {
            // Calculate for services requiring retouching
            totalProRev = this._round(proHourly * totalHours * numPros);
            const retouchingTotal = this._round(retouchingCost * totalAppts);
            totalCost = this._round(totalProRev + retouchingTotal);
            shortcutMargin = margin;
            shortcutNet = this._round(totalCost * (margin / 100));
            totalCost = this._round(totalProRev / (1 - margin / 100));
        } else {
            // Calculate for standard services
            totalProRev = this._round((proHourly * totalHours * numPros) + earlyArrival);
            totalCost = this._round((hourlyRate * totalHours * numPros) + earlyArrival);
            shortcutNet = this._round(totalCost - totalProRev);
            shortcutMargin = this._round((shortcutNet / totalCost) * 100);
        }

        // Apply discount if specified
        if (discountPercent > 0) {
            const discountAmount = this._round(totalCost * (discountPercent / 100));
            totalCost = this._round(totalCost - discountAmount);
            
            if (serviceType === 'headshot' || (this.customServiceTypes.has(serviceType) && this.customServiceTypes.get(serviceType).requiresRetouching)) {
                shortcutNet = this._round(totalCost * (margin / 100));
            } else {
                shortcutNet = this._round(totalCost - totalProRev);
                shortcutMargin = this._round((shortcutNet / totalCost) * 100);
            }
        }

        // Calculate annual revenue
        const eventsPerYear = typeof params.eventsPerYear === 'number' && !isNaN(params.eventsPerYear) ? params.eventsPerYear : 12;
        const totalAnnual = this._round(totalCost * eventsPerYear);

        // Prepare result
        const result = {
            apptsPerProPerHour: this._round(apptsPerProPerHour),
            apptsPerHour: this._round(apptsPerHour),
            totalAppts,
            totalProRev: this._round(totalProRev),
            totalCost: this._round(totalCost),
            shortcutNet: this._round(shortcutNet),
            shortcutMargin: this._round(shortcutMargin),
            totalAnnual: this._round(totalAnnual),
            serviceType,
            totalHours,
            day,
            location
        };

        // Cache the result
        this.calculationCache.set(cacheKey, {
            result,
            timestamp: Date.now()
        });

        return result;
    }

    /**
     * Format currency values with improved precision
     * @param {number} value - Value to format as currency
     * @returns {string} Formatted currency string
     */
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: CALCULATION_PRECISION,
            maximumFractionDigits: CALCULATION_PRECISION
        }).format(value);
    }

    /**
     * Format percentage values with improved precision
     * @param {number} value - Value to format as percentage
     * @returns {string} Formatted percentage string
     */
    formatPercentage(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value / 100);
    }

    /**
     * Clear the calculation cache
     */
    clearCache() {
        this.calculationCache.clear();
    }

    /**
     * Get preset configurations based on appointment counts
     * 
     * @param {string} serviceType - Type of service (massage/spa, hair/nails, or headshot)
     * @returns {Array} Array of preset configurations
     */
    getPresets(serviceType) {
        // Preset configurations based on appointment counts
        const presets = {
            'massage/spa': [
                {
                    name: 'Small Event (24 appts)',
                    serviceType: 'massage/spa',
                    totalAppts: 24,
                    numPros: 2,
                    totalHours: 4,
                    appTime: 20,
                    proHourly: 50,
                    hourlyRate: 135,
                    earlyArrival: 100
                },
                {
                    name: 'Medium Event (60 appts)',
                    serviceType: 'massage/spa',
                    totalAppts: 60,
                    numPros: 4,
                    totalHours: 5,
                    appTime: 20,
                    proHourly: 50,
                    hourlyRate: 135,
                    earlyArrival: 200
                },
                {
                    name: 'Large Event (120 appts)',
                    serviceType: 'massage/spa',
                    totalAppts: 120,
                    numPros: 6,
                    totalHours: 7,
                    appTime: 20,
                    proHourly: 50,
                    hourlyRate: 135,
                    earlyArrival: 300
                }
            ],
            'hair/nails': [
                {
                    name: 'Small Event (20 appts)',
                    serviceType: 'hair/nails',
                    totalAppts: 20,
                    numPros: 2,
                    totalHours: 5,
                    appTime: 30,
                    proHourly: 60,
                    hourlyRate: 135,
                    earlyArrival: 100
                },
                {
                    name: 'Medium Event (40 appts)',
                    serviceType: 'hair/nails',
                    totalAppts: 40,
                    numPros: 4,
                    totalHours: 5,
                    appTime: 30,
                    proHourly: 60,
                    hourlyRate: 135,
                    earlyArrival: 200
                },
                {
                    name: 'Large Event (80 appts)',
                    serviceType: 'hair/nails',
                    totalAppts: 80,
                    numPros: 6,
                    totalHours: 7,
                    appTime: 30,
                    proHourly: 60,
                    hourlyRate: 135,
                    earlyArrival: 300
                }
            ],
            'headshot': [
                {
                    name: 'Small Headshot (25 appts)',
                    serviceType: 'headshot',
                    totalAppts: 25,
                    numPros: 1,
                    totalHours: 5,
                    appTime: 12,
                    proHourly: 400,
                    retouchingCost: 40
                },
                {
                    name: 'Medium Headshot (50 appts)',
                    serviceType: 'headshot',
                    totalAppts: 50,
                    numPros: 2,
                    totalHours: 5,
                    appTime: 12,
                    proHourly: 400,
                    retouchingCost: 40
                },
                {
                    name: 'Large Headshot (100 appts)',
                    serviceType: 'headshot',
                    totalAppts: 100,
                    numPros: 2,
                    totalHours: 10,
                    appTime: 12,
                    proHourly: 400,
                    retouchingCost: 40
                }
            ]
        };
        
        return presets[serviceType] || [];
    }

    // Add this method to the class
    static getPresetConfiguration(serviceType, size) {
        return PRESET_CONFIGURATIONS[serviceType]?.[size];
    }

    // Add this method to get all presets for a service type
    static getPresetsForService(serviceType) {
        return PRESET_CONFIGURATIONS[serviceType] || {};
    }

    // Add this method to get all preset configurations
    static getAllPresetConfigurations() {
        return PRESET_CONFIGURATIONS;
    }
}
