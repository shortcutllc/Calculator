class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'calculatorHistory';
        this.apiClient = new ApiClient();
        this.isOnline = true;
        this.pendingSync = [];

        // Check online status and sync pending items when back online
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncPendingItems();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    async saveCalculation(data) {
        try {
            if (this.isOnline) {
                // Try to save to API first
                const savedData = await this.apiClient.saveCalculation(data);
                // Also cache in localStorage
                this.saveToLocalStorage(savedData);
                return savedData;
            } else {
                // Offline mode: Save to localStorage and queue for sync
                const tempId = 'temp_' + Date.now();
                const tempData = { ...data, _id: tempId, pendingSync: true };
                this.saveToLocalStorage(tempData);
                this.pendingSync.push(tempData);
                return tempData;
            }
        } catch (error) {
            // If API fails, fall back to localStorage
            console.warn('Failed to save to API, using localStorage fallback:', error);
            const tempId = 'temp_' + Date.now();
            const tempData = { ...data, _id: tempId, pendingSync: true };
            this.saveToLocalStorage(tempData);
            this.pendingSync.push(tempData);
            return tempData;
        }
    }

    async getCalculations() {
        try {
            if (this.isOnline) {
                // Try to get from API first
                const calculations = await this.apiClient.getCalculations();
                // Update localStorage cache
                this.saveAllToLocalStorage(calculations);
                return calculations;
            }
        } catch (error) {
            console.warn('Failed to fetch from API, using localStorage:', error);
        }
        
        // Fall back to localStorage
        return this.getFromLocalStorage();
    }

    async deleteCalculation(id) {
        try {
            if (this.isOnline && !id.startsWith('temp_')) {
                await this.apiClient.deleteCalculation(id);
            }
            this.deleteFromLocalStorage(id);
            this.pendingSync = this.pendingSync.filter(item => item._id !== id);
        } catch (error) {
            console.error('Error deleting calculation:', error);
            throw error;
        }
    }

    // LocalStorage helpers
    saveToLocalStorage(data) {
        const calculations = this.getFromLocalStorage();
        const index = calculations.findIndex(calc => calc._id === data._id);
        
        if (index !== -1) {
            calculations[index] = data;
        } else {
            calculations.push(data);
        }
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(calculations));
    }

    saveAllToLocalStorage(calculations) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(calculations));
    }

    getFromLocalStorage() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }

    deleteFromLocalStorage(id) {
        const calculations = this.getFromLocalStorage();
        const filtered = calculations.filter(calc => calc._id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    }

    // Sync helpers
    async syncPendingItems() {
        const pending = [...this.pendingSync];
        this.pendingSync = [];

        for (const item of pending) {
            try {
                const { _id, pendingSync, ...data } = item;
                const savedData = await this.apiClient.saveCalculation(data);
                this.deleteFromLocalStorage(_id);
                this.saveToLocalStorage(savedData);
            } catch (error) {
                console.error('Failed to sync item:', error);
                this.pendingSync.push(item);
            }
        }
    }
} 