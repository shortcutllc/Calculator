const Calculation = require('../models/Calculation');

// Get all calculations
exports.getAllCalculations = async (req, res) => {
  try {
    const calculations = await Calculation.find().sort({ timestamp: -1 });
    res.json(calculations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new calculation
exports.createCalculation = async (req, res) => {
  const calculation = new Calculation(req.body);
  try {
    const newCalculation = await calculation.save();
    res.status(201).json(newCalculation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a calculation
exports.deleteCalculation = async (req, res) => {
  try {
    const result = await Calculation.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Calculation not found' });
    }
    res.json({ message: 'Calculation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 