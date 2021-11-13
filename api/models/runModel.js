'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HrSchema = new Schema({
  avg: Number,
  max: Number,
  min: Number,
  std: Number,
  median: Number,
  q1: Number,
  q3: Number,
  p1: Number,
  p9: Number,
  iqr: Number,
});

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
  hrData: HrSchema,
  shoe: String
});

module.exports = mongoose.model('HR', HrSchema);
module.exports = mongoose.model('Run', RunSchema);