class ApiClient {
    constructor() {
        this.baseUrl = 'http://localhost:5001/api';
    }

    async saveCalculation(data) {
        try {
            const response = await fetch(`${this.baseUrl}/calculations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving calculation:', error);
            throw error;
        }
    }

    async getCalculations() {
        try {
            const response = await fetch(`${this.baseUrl}/calculations`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching calculations:', error);
            throw error;
        }
    }

    async deleteCalculation(id) {
        try {
            const response = await fetch(`${this.baseUrl}/calculations/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting calculation:', error);
            throw error;
        }
    }
} 