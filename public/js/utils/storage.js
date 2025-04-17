// Storage management utilities
class StorageManager {
  constructor() {
    this.storage = window.localStorage;
  }

  save(key, data) {
    try {
      const serializedData = JSON.stringify(data);
      this.storage.setItem(key, serializedData);
      return true;
    } catch (error) {
      ErrorHandler.handleError(error, 'Storage save');
      return false;
    }
  }

  load(key) {
    try {
      const serializedData = this.storage.getItem(key);
      return serializedData ? JSON.parse(serializedData) : null;
    } catch (error) {
      ErrorHandler.handleError(error, 'Storage load');
      return null;
    }
  }

  remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      ErrorHandler.handleError(error, 'Storage remove');
      return false;
    }
  }

  clear() {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      ErrorHandler.handleError(error, 'Storage clear');
      return false;
    }
  }

  // Draft management
  saveDraft(data) {
    const drafts = this.load(Settings.STORAGE.DRAFT_KEY) || [];
    drafts.unshift({
      ...data,
      timestamp: new Date().toISOString()
    });
    
    // Keep only the most recent drafts
    const recentDrafts = drafts.slice(0, Settings.STORAGE.MAX_DRAFTS);
    return this.save(Settings.STORAGE.DRAFT_KEY, recentDrafts);
  }

  loadDrafts() {
    return this.load(Settings.STORAGE.DRAFT_KEY) || [];
  }

  removeDraft(index) {
    const drafts = this.loadDrafts();
    if (index >= 0 && index < drafts.length) {
      drafts.splice(index, 1);
      return this.save(Settings.STORAGE.DRAFT_KEY, drafts);
    }
    return false;
  }
}

// Create a global storage manager instance
window.storageManager = new StorageManager(); 