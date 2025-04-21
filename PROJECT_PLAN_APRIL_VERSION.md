# Shortcut Event Calculator - Proposal System Project Plan

## Overview
This document outlines the development plan for the proposal generation and viewing system within the Shortcut Event Calculator. The system will allow users to generate professional proposals based on their event calculations, with customization options and secure sharing capabilities.

## Completed Work

### 1. Proposal Modal Implementation
- Added customization options to the proposal generation modal:
  - Client Logo upload
  - Contact information (First Name, Last Name)
  - Custom Note field
  - Content preferences (Summary, Calculations, Calculator)
  - Proposal type selection (Public/Password Protected)

### 2. Data Structure Design
- Created client-facing proposal data structure that excludes Shortcut-specific financial details:
  - Removed Professional Hourly Rate
  - Removed Early Arrival Bonus
  - Removed Professional Revenue
  - Removed Net Profit
  - Removed Profit Margin

### 3. Proposal Preview
- Implemented a preview system that shows how the proposal will look
- Structured the preview to match the current results screen layout:
  - Event Details section
  - Location-based breakdown
  - Service details per day
  - Event Summary

## Current Data Structure
```javascript
{
  clientName: string,
  eventDates: string[],
  locations: string[],
  services: {
    [location]: {
      [date]: {
        services: [{
          serviceType: string,
          totalHours: number,
          numPros: number,
          totalAppointments: number,
          serviceCost: number,
          retouchingCost: number,
          discountPercent: number
        }],
        totalCost: number,
        totalAppointments: number
      }
    }
  },
  summary: {
    totalAppointments: number,
    totalEventCost: number
  },
  
  // New: Proposal Management Data
  proposalId: string,
  version: number,
  status: 'draft' | 'sent' | 'viewed' | 'archived',
  createdAt: timestamp,
  updatedAt: timestamp,
  sentAt: timestamp,
  viewedAt: timestamp,
  sentTo: {
    email: string,
    name: string
  },
  history: [{
    action: 'created' | 'edited' | 'sent' | 'viewed' | 'regenerated',
    timestamp: timestamp,
    user: string,
    changes: object
  }],
  customization: {
    clientLogo: string,
    contactFirstName: string,
    contactLastName: string,
    customNote: string,
    includeSummary: boolean,
    includeCalculations: boolean,
    includeCalculator: boolean
  }
}
```

## Next Steps

### 1. Firebase Integration
- [ ] Set up Firebase project and configuration
- [ ] Implement Firebase Authentication
- [ ] Create Firebase Storage for client logos
- [ ] Design Firebase Realtime Database/Firestore structure
- [ ] Implement proposal data storage
- [ ] Add unique proposal URL generation
- [ ] Implement password protection system
- [ ] Add proposal history tracking
- [ ] Implement proposal versioning system

### 2. Proposal Viewing Page
- [ ] Create new HTML template for proposal viewing
- [ ] Implement responsive design
- [ ] Add client branding section
- [ ] Create password authentication flow
- [ ] Implement dynamic content loading based on customization options
- [ ] Add sharing functionality
- [ ] Implement copy-to-clipboard for proposal details

### 3. Proposal Management Dashboard
- [ ] Create proposal history view
- [ ] Add filtering and search capabilities
- [ ] Implement proposal status tracking (Draft, Sent, Viewed)
- [ ] Add proposal editing functionality
- [ ] Create resend/regenerate options
- [ ] Add client communication history
- [ ] Implement proposal archiving

### 4. Testing and Refinement
- [ ] Test proposal generation with various event configurations
- [ ] Verify password protection functionality
- [ ] Test client logo upload and display
- [ ] Validate all customization options
- [ ] Test responsive design across devices
- [ ] Perform security testing

### 5. Documentation
- [ ] Create user guide for proposal generation
- [ ] Document API endpoints and data structures
- [ ] Add inline code documentation
- [ ] Create maintenance guide

## Technical Requirements

### Frontend
- HTML5/CSS3
- JavaScript (ES6+)
- Firebase SDK
- Responsive Design

### Backend
- Firebase Realtime Database/Firestore
- Firebase Storage
- Firebase Authentication

### Security
- Password protection for private proposals
- Secure file upload for client logos
- Data validation and sanitization

### Data Management
- Version control for proposals
- Audit trail for all proposal actions
- Client communication history
- Proposal status tracking
- Data retention policies

## Timeline
1. Firebase Integration: 2-3 days
2. Proposal Viewing Page: 2-3 days
3. Proposal Management Dashboard: 2-3 days
4. Testing and Refinement: 1-2 days
5. Documentation: 1 day

## Success Criteria
- Users can generate proposals with custom branding
- Proposals can be shared securely (public or password-protected)
- Proposal data is stored reliably in Firebase
- Client-facing information is clear and professional
- System is responsive and works across devices
- All customization options function as expected
- Users can track proposal history and status
- Proposals can be edited and regenerated
- All proposal actions are logged and traceable
- Users can easily find and manage past proposals 