// Proposal functionality
class ProposalManager {
  constructor() {
    this.initializeElements();
    this.initializeEventListeners();
  }
  
  initializeElements() {
    this.proposalModal = document.getElementById('proposalModal');
    this.proposalPreviewModal = document.getElementById('proposalPreviewModal');
    this.proposalContent = document.getElementById('proposalContent');
    this.proposalPreviewContent = document.getElementById('proposalPreviewContent');
  }
  
  initializeEventListeners() {
    this.initializePreviewButton();
    this.initializeCloseButtons();
    this.initializeDownloadButton();
    this.initializeEmailButton();
    this.initializeModalCloseHandlers();
  }
  
  initializePreviewButton() {
    eventManager.on(document.getElementById('previewProposal'), 'click', () => {
      this.generateProposal();
      this.proposalPreviewModal.style.display = 'block';
    });
  }
  
  initializeCloseButtons() {
    eventManager.on(document.getElementById('closeProposalPreview'), 'click', () => {
      this.proposalPreviewModal.style.display = 'none';
    });
  }
  
  initializeDownloadButton() {
    eventManager.on(document.getElementById('downloadProposal'), 'click', () => {
      this.downloadProposal();
    });
  }
  
  initializeEmailButton() {
    eventManager.on(document.getElementById('emailProposal'), 'click', () => {
      this.emailProposal();
    });
  }
  
  initializeModalCloseHandlers() {
    eventManager.on(window, 'click', (event) => {
      if (event.target === this.proposalModal) {
        this.proposalModal.style.display = 'none';
      }
      if (event.target === this.proposalPreviewModal) {
        this.proposalPreviewModal.style.display = 'none';
      }
    });
  }
  
  generateProposal() {
    const result = window.calculator.calculate();
    if (!result) {
      ErrorHandler.showError('Please complete all required fields before generating a proposal');
      return;
    }
    
    const formData = this.getFormData();
    if (!this.validateFormData(formData)) {
      return;
    }
    
    const proposalHTML = this.generateProposalHTML(result, formData);
    this.proposalPreviewContent.innerHTML = proposalHTML;
  }
  
  getFormData() {
    return {
      clientName: document.getElementById('clientName').value,
      clientEmail: document.getElementById('clientEmail').value,
      clientPhone: document.getElementById('clientPhone').value,
      eventDate: document.getElementById('eventDate').value,
      eventLocation: document.getElementById('eventLocation').value,
      additionalNotes: document.getElementById('additionalNotes').value
    };
  }
  
  validateFormData(formData) {
    if (!Validation.validateRequired(formData.clientName)) {
      ErrorHandler.showError('Client name is required');
      return false;
    }
    
    if (!Validation.validateRequired(formData.clientEmail)) {
      ErrorHandler.showError('Client email is required');
      return false;
    }
    
    if (!Validation.validateEmail(formData.clientEmail)) {
      ErrorHandler.showError('Please enter a valid email address');
      return false;
    }
    
    if (formData.clientPhone && !Validation.validatePhone(formData.clientPhone)) {
      ErrorHandler.showError('Please enter a valid phone number');
      return false;
    }
    
    if (!Validation.validateRequired(formData.eventDate)) {
      ErrorHandler.showError('Event date is required');
      return false;
    }
    
    if (!Validation.validateDate(formData.eventDate)) {
      ErrorHandler.showError('Please enter a valid date');
      return false;
    }
    
    return true;
  }
  
  generateProposalHTML(result, formData) {
    return `
      <div class="proposal-header">
        <h2>Proposal for ${formData.clientName}</h2>
        <p>Generated on ${Formatter.formatDate(new Date())}</p>
      </div>
      
      <div class="proposal-client-info">
        <h3>Client Information</h3>
        <p><strong>Name:</strong> ${formData.clientName}</p>
        <p><strong>Email:</strong> ${formData.clientEmail}</p>
        <p><strong>Phone:</strong> ${formData.clientPhone ? Formatter.formatPhone(formData.clientPhone) : 'N/A'}</p>
      </div>
      
      <div class="proposal-event-info">
        <h3>Event Details</h3>
        <p><strong>Date:</strong> ${Formatter.formatDate(formData.eventDate)}</p>
        <p><strong>Location:</strong> ${formData.eventLocation || 'N/A'}</p>
        <p><strong>Service Type:</strong> ${Formatter.formatServiceType(result.serviceType)}</p>
        <p><strong>Duration:</strong> ${Formatter.formatTime(result.totalHours)}</p>
        <p><strong>Number of Professionals:</strong> ${result.numPros}</p>
      </div>
      
      <div class="proposal-pricing">
        <h3>Pricing Summary</h3>
        <p><strong>Total Appointments:</strong> ${result.totalAppts}</p>
        <p><strong>Total Cost:</strong> ${Formatter.formatCurrency(result.totalCost)}</p>
        <p><strong>Professional Revenue:</strong> ${Formatter.formatCurrency(result.totalProRev)}</p>
        <p><strong>Shortcut Net Profit:</strong> ${Formatter.formatCurrency(result.shortcutNet)}</p>
        <p><strong>Shortcut Margin:</strong> ${Formatter.formatPercent(result.shortcutMargin)}</p>
        <p><strong>Annual Value:</strong> ${Formatter.formatCurrency(result.totalAnnual)}</p>
      </div>
      
      ${formData.additionalNotes ? `
        <div class="proposal-notes">
          <h3>Additional Notes</h3>
          <p>${formData.additionalNotes}</p>
        </div>
      ` : ''}
    `;
  }
  
  downloadProposal() {
    const proposalContent = this.proposalPreviewContent.innerHTML;
    const clientName = document.getElementById('clientName').value;
    
    if (!Validation.validateRequired(clientName)) {
      ErrorHandler.showError('Client name is required for download');
      return;
    }
    
    const printWindow = this.createPrintWindow(proposalContent, clientName);
    printWindow.print();
  }
  
  createPrintWindow(content, title) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = content;
    
    const styles = this.getPrintStyles();
    tempElement.prepend(styles);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(tempElement.innerHTML);
    printWindow.document.title = `Proposal for ${title}`;
    printWindow.document.close();
    printWindow.focus();
    
    return printWindow;
  }
  
  getPrintStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      body { font-family: Arial, sans-serif; }
      .proposal-header { text-align: center; margin-bottom: 20px; }
      .proposal-client-info, .proposal-event-info, .proposal-pricing, .proposal-notes {
        margin-bottom: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      h2, h3 { color: #333; }
      p { margin: 5px 0; }
    `;
    return styles;
  }
  
  emailProposal() {
    const clientEmail = document.getElementById('clientEmail').value;
    const clientName = document.getElementById('clientName').value;
    
    if (!Validation.validateRequired(clientEmail)) {
      ErrorHandler.showError('Client email is required');
      return;
    }
    
    if (!Validation.validateEmail(clientEmail)) {
      ErrorHandler.showError('Please enter a valid email address');
      return;
    }
    
    const subject = `Proposal for ${clientName}`;
    const body = this.proposalPreviewContent.innerText;
    
    window.location.href = `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}

// Initialize proposal manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.proposalManager = new ProposalManager();
}); 