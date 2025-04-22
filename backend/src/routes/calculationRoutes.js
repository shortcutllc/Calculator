const express = require('express');
const router = express.Router();
const calculationController = require('../controllers/calculationController');

// Get all calculations
router.get('/', calculationController.getAllCalculations);

// Create a new calculation
router.post('/', calculationController.createCalculation);

// Delete a calculation
router.delete('/:id', calculationController.deleteCalculation);

module.exports = router; 