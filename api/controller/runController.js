'use strict';


function parseRun(json){
  return {
    "distance": json.distance.qty,
    "elevation": json.elevation.ascent,
    "humidity": json.humidity.qty,
    "activeEnergy": json.activeEnergy.qty,
    "avgHeartRate": json.avgHeartRate.qty,
    "totalEnergy": json.totalEnergy.qty,
    "stepCount": json.stepCount.qty,
    "stepCadence": json.stepCadence.qty,
    "speed": json.speed.qty,
    "intensity": json.intensity.qty,
    "maxHeartRate": json.maxHeartRate.qty,
    "temperature": json.temperature.qty,
    "flightsClimbed": json.flightsClimbed.qty,
    "start": json.start,
    "end": json.end,
    "hrData": aggregate_heart_rate(json.heartRate),
    "shoe": undefined
  }
}


var mongoose = require('mongoose'),
  Run = mongoose.model('Run');

exports.list_all_runs = function(req, res) {
  Run.find({}, function(err, run) {
    if (err)
      res.send(err);
    res.json(run);
  });
};




exports.create_a_run = function(req, res) {
  let json = {"saved": []}
  for (let run of req.body.data.workouts){
    run = parseRun(run)
    var new_run = new Run(run);
    new_run.save(function(err, run) {
      if (err){
        res.send(err);
      } else {
        json.saved.push(run)
      }
      
    });
  }
  res.json(json);
};


exports.read_a_run = function(req, res) {
  Run.findById(req.params.runId, function(err, run) {
    if (err)
      res.send(err);
    res.json(run);
  });
};


exports.update_a_run = function(req, res) {
  Run.findOneAndUpdate({_id: req.params.runId}, req.body, {new: true}, function(err, run) {
    if (err)
      res.send(err);
    res.json(run);
  });
};


exports.delete_a_run = function(req, res) {


  Run.remove({
    _id: req.params.runId
  }, function(err, run) {
    if (err)
      res.send(err);
    res.json({ message: 'Run successfully deleted' });
  });
};


function aggregate_heart_rate(hr_raw){
  var hr_data = {}
  var bpms = hr_raw.map(entry => entry.qty)

  hr_data.avg = bpms.reduce((a, b) => a + b, 0) / bpms.length
  hr_data.max = Math.max(...bpms)
  hr_data.min = Math.min(...bpms)
  hr_data.std = Math.sqrt(bpms.reduce((a, b) => a + b * b, 0) / bpms.length - hr_data.avg * hr_data.avg)
  bpms = bpms.sort()
  hr_data.median = bpms[Math.floor(bpms.length / 2)]
  hr_data.q1 = bpms[Math.floor(bpms.length / 4)]
  hr_data.q3 = bpms[Math.floor(bpms.length * 3 / 4)]
  hr_data.p1 = bpms[Math.floor(bpms.length / 10)]
  hr_data.p9 = bpms[Math.floor(bpms.length * 9 / 10)]
  hr_data.iqr = hr_data.q3 - hr_data.q1
  return hr_data
}