# Calculator Business Rules and Formulas

## Overview
This document outlines the core business rules and formulas used in the Wellness Services Pricing Calculator. These rules are critical to maintaining the calculator's integrity and should not be modified without proper validation and testing.

## Service Types

### 1. Massage/Spa Services
- **Appointment Duration**: 20 minutes
- **Minimum Duration**: 15 minutes
- **Appointments per Hour**: 3 (60 minutes ÷ 20 minutes)
- **Professional Rate**: $50/hour
- **Client Rate**: $135/hour
- **Early Arrival Fee**: Varies by event size
  - Small: $100
  - Medium: $200
  - Large: $300

### 2. Hair/Nails Services
- **Appointment Duration**: 30 minutes
- **Minimum Duration**: 15 minutes
- **Appointments per Hour**: 2 (60 minutes ÷ 30 minutes)
- **Professional Rate**: $50/hour
- **Client Rate**: $135/hour
- **Early Arrival Fee**: Same as Massage/Spa

### 3. Headshot Services
- **Appointment Duration**: 12 minutes
- **Duration Range**: 10-20 minutes
- **Appointments per Hour**: 5 (60 minutes ÷ 12 minutes)
- **Professional Rate**: $400/hour
- **Retouching Cost**: $40 per headshot

## Event Sizes and Configurations

### Massage/Spa Events
1. **Small Event (24 appointments)**
   - 2 professionals × 4 hours × 3 appts/hour
   - Total Hours: 4
   - Number of Professionals: 2

2. **Medium Event (36 appointments)**
   - 3 professionals × 4 hours × 3 appts/hour
   - Total Hours: 4
   - Number of Professionals: 3

3. **Large Event (54 appointments)**
   - 3 professionals × 6 hours × 3 appts/hour
   - Total Hours: 6
   - Number of Professionals: 3

### Hair/Nails Events
1. **Small Event (24 appointments)**
   - 2 professionals × 6 hours × 2 appts/hour
   - Total Hours: 6
   - Number of Professionals: 2

2. **Medium Event (32 appointments)**
   - 2 professionals × 8 hours × 2 appts/hour
   - Total Hours: 8
   - Number of Professionals: 2

3. **Large Event (48 appointments)**
   - 3 professionals × 8 hours × 2 appts/hour
   - Total Hours: 8
   - Number of Professionals: 3

### Headshot Events
1. **Small Event (30 appointments)**
   - 2 professionals × 3 hours × 5 appts/hour
   - Total Hours: 3
   - Number of Professionals: 2

2. **Medium Event (60 appointments)**
   - 3 professionals × 4 hours × 5 appts/hour
   - Total Hours: 4
   - Number of Professionals: 3

3. **Large Event (90 appointments)**
   - 3 professionals × 6 hours × 5 appts/hour
   - Total Hours: 6
   - Number of Professionals: 3

## Core Formulas

### 1. Appointment Calculations
```javascript
const appointmentsPerHour = 60 / appointmentDuration;
const totalAppointments = Math.floor(totalHours * numProfessionals * appointmentsPerHour);
```

### 2. Professional Revenue
```javascript
const professionalRevenue = totalHours * numProfessionals * professionalHourlyRate;
```

### 3. Total Cost Calculations
For Massage/Spa and Hair/Nails:
```javascript
const totalCost = (totalHours * numProfessionals * professionalHourlyRate) + earlyArrivalFee;
```

For Headshots:
```javascript
const totalCost = (totalHours * numProfessionals * professionalHourlyRate) + (totalAppointments * retouchingCost);
```

## Business Constraints

1. **Time Constraints**
   - Maximum event duration: 12 hours
   - Minimum appointment time: 10 minutes
   - Maximum appointment time: 120 minutes

2. **Professional Constraints**
   - Maximum professionals per event: 5
   - Minimum hourly rate: $50
   - Maximum hourly rate: $1000

3. **Location Constraints**
   - Maximum different locations: 10
   - No duplicate locations on same day

4. **Multi-Day Events**
   - Events per year default: 12
   - Must have at least one configuration
   - Each day must have valid service type and size

## Validation Rules

1. **Input Validation**
   - All numeric values must be positive
   - Service types must match predefined types
   - Event sizes must match predefined sizes

2. **Calculation Validation**
   - Appointment counts must match preset expectations
   - Professional revenue must match formula calculations
   - Total costs must match preset expectations

3. **Multi-Day Validation**
   - Each day's calculations must match single-day calculations
   - Total calculations must sum individual day results
   - Location constraints must be maintained

## Important Notes

1. **Preset Integrity**
   - Preset configurations are fixed and should not be modified
   - Any changes require full test suite validation
   - Maintain exact values for all preset parameters

2. **Calculation Precision**
   - Use floor function for appointment calculations
   - Allow 0.01 tolerance for cost comparisons
   - Maintain integer values for appointment counts

3. **Error Handling**
   - All validation errors must be caught and reported
   - Invalid inputs must not proceed to calculation
   - Maintain detailed error messages for debugging 