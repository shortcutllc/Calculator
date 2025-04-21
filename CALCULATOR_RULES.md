# Shortcut Event Calculator Development Rules

## Core Principle
All changes must maintain existing functionality while implementing new features or improvements. No feature regression is allowed.

## Testing Framework

### 1. Pre-Change Verification
- [ ] Document current state of feature being modified
- [ ] Test current functionality thoroughly
- [ ] Create backup of working state
- [ ] Document expected behavior

### 2. Change Implementation Rules
- One change at a time
- Test each change in isolation
- Verify all existing features after each change
- Document any new behavior

### 3. Post-Change Verification
- [ ] Run complete test checklist
- [ ] Verify no regression in existing features
- [ ] Document any changes in behavior
- [ ] Update documentation if needed

## Complete Test Checklist

### 1. Initial Setup and Welcome Screen
- [ ] Welcome screen layout and styling
  - Logo display
  - Title "Welcome to the Shortcut Event Calculator"
  - Form container width and spacing
  - Background color (#175071)
  - Font family (Outfit)
  - All button styles (primary, secondary, danger)

### 2. Client Information Input
- [ ] Client name input
  - Field validation (required)
  - Input styling (border, hover, focus states)
  - Font size and weight
  - Placeholder text

### 3. Location Management
- [ ] Location input functionality
  - Initial location input field
  - "Add Another Location" button
  - Remove location button
  - Multiple location handling
  - Location input validation

### 4. Event Configuration Modal
- [ ] Modal appearance and functionality
  - Modal opening/closing
  - Form fields layout
  - Service type selection
  - Date selection
  - All input validations

### 5. Service Configuration
- [ ] Service configuration
  - Service type presets (massage, facial, hair, nails, headshot)
  - Default values for each service type
  - Total hours input
  - Appointment time input
  - Number of professionals
  - Professional hourly rate
  - Hourly rate
  - Early arrival bonus
  - Retouching cost (for headshots)
  - Discount percent

### 6. Calculations and Preview
- [ ] Calculation functionality
  - Appointment preview updates
  - Total appointments calculation
  - Cost calculations
  - Revenue calculations
  - Discount application

### 7. Results Display
- [ ] Results page organization
  - Event details card
  - Location sections
  - Date cards
  - Service groups
  - Client perspective section
  - Shortcut perspective section
  - Totals display
  - Financial details

### 8. Multi-Location Support
- [ ] Multi-location functionality
  - Multiple location handling
  - Location-specific calculations
  - Combined totals
  - Location switching

### 9. Responsive Design
- [ ] Responsive behavior
  - Mobile layout
  - Tablet layout
  - Desktop layout
  - Form field adjustments
  - Card layouts
  - Button placements

### 10. Data Persistence
- [ ] Data handling
  - Form data retention
  - Calculation persistence
  - Results display accuracy
  - Multi-location data management

## Development Workflow
1. Create feature branch from clean_v3_calculator
2. Implement changes following the rules above
3. Test thoroughly using the checklist
4. Create pull request with:
   - Description of changes
   - Test results
   - Any new documentation needed
5. Get review approval
6. Merge to clean_v3_calculator

## Emergency Procedures
If a change causes regression:
1. Immediately revert the change
2. Document the issue
3. Create a new branch to fix the issue
4. Test the fix thoroughly
5. Submit new pull request

## Documentation Requirements
- All new features must be documented
- Any changes to existing behavior must be documented
- Test results must be recorded
- Known issues must be documented 