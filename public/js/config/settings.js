// Application settings and constants
const Settings = {
  // Service type configurations
  SERVICE_TYPES: {
    'massage/spa': {
      defaultAppTime: 20,
      defaultProHourly: 50,
      fields: ['hourlyRate', 'earlyArrival']
    },
    'hair/nails': {
      defaultAppTime: 30,
      defaultProHourly: 50,
      fields: ['hourlyRate', 'earlyArrival']
    },
    'headshot': {
      defaultAppTime: 12,
      defaultProHourly: 400,
      fields: ['retouchingCost']
    }
  },

  // Validation settings
  VALIDATION: {
    MIN_HOURS: 0.5,
    MAX_HOURS: 24,
    MIN_PROFESSIONALS: 1,
    MAX_PROFESSIONALS: 20,
    MIN_APPOINTMENT_TIME: 5,
    MAX_APPOINTMENT_TIME: 60
  },

  // UI settings
  UI: {
    MODAL_TRANSITION_DURATION: 300,
    ERROR_MESSAGE_DURATION: 5000,
    ANIMATION_DURATION: 200
  },

  // Storage settings
  STORAGE: {
    DRAFT_KEY: 'calculatorDrafts',
    MAX_DRAFTS: 10
  },

  // Format settings
  FORMAT: {
    CURRENCY: {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    PERCENT: {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  }
};

// Export settings
window.Settings = Settings; 