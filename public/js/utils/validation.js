// Validation utilities
class Validation {
  static validateNumber(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  }

  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static validatePhone(phone) {
    const re = /^\+?[\d\s-()]{10,}$/;
    return re.test(phone);
  }

  static validateDate(date) {
    return !isNaN(Date.parse(date));
  }

  static validateRequired(value) {
    return value && value.trim().length > 0;
  }

  static validateServiceType(type) {
    const validTypes = ['massage/spa', 'hair/nails', 'headshot'];
    return validTypes.includes(type);
  }
}

// Error handling utilities
class ErrorHandler {
  static showError(message, elementId = 'error-message') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      setTimeout(() => {
        errorElement.style.display = 'none';
      }, 5000);
    } else {
      console.error(message);
    }
  }

  static handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    this.showError(`An error occurred: ${error.message}`);
  }
}

// Export utilities
window.Validation = Validation;
window.ErrorHandler = ErrorHandler; 