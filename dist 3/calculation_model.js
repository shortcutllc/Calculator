/**
 * Enhanced Pricing Calculator Model
 * 
 * This model implements the calculation logic for the wellness services pricing calculator
 * with support for multi-day events, multiple locations, and history feature.
 */

class PricingCalculator {
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
     */
    calculate(params) {
        // Extract parameters
        const {
            serviceType,
            totalHours,
            appTime,
            proHourly,
            numPros,
            hourlyRate,
            earlyArrival = 0,
            retouchingCost = 40, // Default retouching cost for headshots
            discountPercent = 0, // Default discount percentage
            totalAppts: specifiedTotalAppts = null, // Allow direct specification of total appointments
            day = null,
            location = null
        } = params;

        // Calculate appointments per professional per hour based on appointment duration
        const apptsPerProPerHour = Math.floor(60 / appTime);
        
        // Calculate total appointments per hour across all professionals
        const apptsPerHour = numPros * apptsPerProPerHour;
        
        // Use specified total appointments if provided, otherwise calculate
        const totalAppts = specifiedTotalAppts !== null ? 
            specifiedTotalAppts : 
            apptsPerHour * totalHours;
        
        let totalProRev, totalCost, shortcutNet, shortcutMargin;
        
        if (serviceType === 'headshot') {
            // For headshot services
            // Calculate total revenue paid to photographers
            totalProRev = (proHourly * totalHours * numPros);
            
            // Calculate retouching cost
            const retouchingTotal = retouchingCost * totalAppts;
            
            // Calculate total cost charged to the customer
            totalCost = totalProRev + retouchingTotal;
            
            // For headshot services, margin is fixed at 20%
            shortcutMargin = 20;
            
            // Calculate Shortcut's net profit based on fixed 20% margin
            shortcutNet = totalCost * 0.2;
            
            // Adjust total cost to achieve the 20% margin
            totalCost = totalProRev / 0.8;
        } else {
            // For massage/spa and hair/nails services
            // Calculate total revenue paid to professionals
            // Base pay (hourly rate × hours × number of pros) + early arrival fee
            totalProRev = (proHourly * totalHours * numPros) + earlyArrival;
            
            // Calculate total cost charged to the customer
            // Customer hourly rate × number of pros × total hours
            totalCost = hourlyRate * numPros * totalHours;
            
            // Calculate Shortcut's net profit
            shortcutNet = totalCost - totalProRev;
            
            // Calculate profit margin percentage
            shortcutMargin = (shortcutNet / totalCost) * 100;
        }
        
        // Apply discount if specified
        if (discountPercent > 0) {
            const discountAmount = totalCost * (discountPercent / 100);
            totalCost -= discountAmount;
            
            // Recalculate net profit and margin after discount
            if (serviceType === 'headshot') {
                // For headshot, maintain 20% margin
                shortcutNet = totalCost * 0.2;
            } else {
                // For other services, recalculate net profit
                shortcutNet = totalCost - totalProRev;
                shortcutMargin = (shortcutNet / totalCost) * 100;
            }
        }
        
        // Calculate annual revenue based on events per year
        // Ensure eventsPerYear is a valid number, defaulting to 12 if not
        const eventsPerYear = typeof params.eventsPerYear === 'number' && !isNaN(params.eventsPerYear) ? params.eventsPerYear : 12;
        const totalAnnual = totalCost * eventsPerYear;
        
        // Return calculated values
        return {
            apptsPerProPerHour,
            apptsPerHour,
            totalAppts,
            totalProRev,
            totalCost,
            shortcutNet,
            shortcutMargin,
            totalAnnual,
            serviceType,
            totalHours,
            day,
            location
        };
    }

    /**
     * Format currency values
     * 
     * @param {number} value - Value to format as currency
     * @returns {string} Formatted currency string
     */
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    }

    /**
     * Format percentage values
     * 
     * @param {number} value - Value to format as percentage
     * @returns {string} Formatted percentage string
     */
    formatPercentage(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
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
                    name: 'Small Event (30 appts)',
                    serviceType: 'massage/spa',
                    totalAppts: 30,
                    numPros: 2,
                    totalHours: 5,
                    appTime: 20,
                    proHourly: 50,
                    hourlyRate: 120,
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
                    hourlyRate: 120,
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
                    hourlyRate: 120,
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
}
