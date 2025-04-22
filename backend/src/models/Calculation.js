const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  cost: Number,
  totalCost: Number
});

const eventSchema = new mongoose.Schema({
  services: [serviceSchema]
});

const calculationSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  events: {
    type: Map,
    of: [eventSchema]
  },
  calculations: {
    total: Number,
    locationBreakdown: Map
  }
});

module.exports = mongoose.model('Calculation', calculationSchema); 