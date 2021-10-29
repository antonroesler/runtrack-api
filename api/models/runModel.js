'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RunSchema = new Schema({
  distance: Number,
  elevation: Number,
  humidity: Number,
  activeEnergy: Number,
  avgHeartRate: Number,
  totalEnergy: Number,
  stepCount: Number,
  stepCadence: Number,
  speed: Number,
  intensity: Number,
  maxHeartRate: Number,
  temperature: Number,
  flightsClimbed: Number,
  start: Date,
  end: Date,
});

module.exports = mongoose.model('Run', RunSchema);