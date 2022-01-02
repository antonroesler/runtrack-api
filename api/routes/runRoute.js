'use strict';
module.exports = function(app) {
  var run = require('../controller/runController');

  // run Routes
  app.route('/runs')
    .get(run.list_all_runs)
    .post(run.create_a_run);


  app.route('/runs/:runId')
    .get(run.read_a_run)
    .put(run.update_a_run)
    .delete(run.delete_a_run);

  app.route('/monthly')
    .get(run.monthly_kms)
  
  app.route('/hrspeed')
    .get(run.hr_speed)
  
    app.route('/hrspeeddistance')
    .get(run.hr_speed_distance)
  
    app.route('/type')
    .get(run.run_type)
};