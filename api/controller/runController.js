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
    "end": json.end
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
  res.json(run);
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
