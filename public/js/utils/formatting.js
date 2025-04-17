// Formatting utilities
class Formatter {
  static formatCurrency(value) {
    return new Intl.NumberFormat('en-US', Settings.FORMAT.CURRENCY).format(value);
  }

  static formatPercent(value) {
    return new Intl.NumberFormat('en-US', Settings.FORMAT.PERCENT).format(value / 100);
  }

  static formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static formatTime(hours) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
    }
    
    return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  static formatPhone(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phone;
  }

  static formatServiceType(type) {
    return type.split('/').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('/');
  }

  static formatProposalNumber(number) {
    return `PRO-${String(number).padStart(6, '0')}`;
  }
}

// Export formatter
window.Formatter = Formatter; 