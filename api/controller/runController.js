'use strict';


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
  var new_run = new Run(req.body);
  new_run.save(function(err, run) {
    if (err)
      res.send(err);
    res.json(run);
  });
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

