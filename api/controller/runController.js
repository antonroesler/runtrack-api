"use strict";

function parseRun(json) {
    return {
        distance: json.distance.qty,
        elevation: json.elevation.ascent,
        humidity: json.humidity.qty,
        activeEnergy: json.activeEnergy.qty,
        avgHeartRate: json.avgHeartRate.qty,
        totalEnergy: json.totalEnergy.qty,
        stepCount: json.stepCount.qty,
        stepCadence: json.stepCadence.qty,
        speed: json.speed.qty,
        intensity: json.intensity.qty,
        maxHeartRate: json.maxHeartRate.qty,
        temperature: json.temperature.qty,
        flightsClimbed: json.flightsClimbed.qty,
        start: json.start,
        end: json.end,
        hrData: aggregate_heart_rate(json.heartRateData),
        shoe: undefined,
    };
}

var mongoose = require("mongoose"),
    Run = mongoose.model("Run");

exports.list_all_runs = function (req, res) {
    Run.find({}, function (err, run) {
        if (err) res.send(err);
        res.json(run);
    });
};

exports.create_a_run = function (req, res) {
    let json = { saved: [] };
    Run.find({}, function (err, runs) {
        if (err) res.send(err);
        for (let run of req.body.data.workouts) {
            run = parseRun(run);
            var new_run = new Run(run);
            if (find_duplicate(runs, new_run) === null) {
                new_run.save(function (err, run) {
                    if (err) res.send(err);
                    json.saved.push(run);
                });
            }
        }
        res.json(json);
    });
};

exports.read_a_run = function (req, res) {
    Run.findById(req.params.runId, function (err, run) {
        if (err) res.send(err);
        res.json(run);
    });
};

exports.update_a_run = function (req, res) {
    Run.findOneAndUpdate(
        { _id: req.params.runId },
        req.body,
        { new: true },
        function (err, run) {
            if (err) res.send(err);
            res.json(run);
        }
    );
};

exports.delete_a_run = function (req, res) {
    Run.remove(
        {
            _id: req.params.runId,
        },
        function (err, run) {
            if (err) res.send(err);
            res.json({ message: "Run successfully deleted" });
        }
    );
};

exports.query = function (req, res) {
    const params = req.query;
    Run.find(
        { start: { $gte: new Date(2021, 10, 1), $lt: new Date(2021, 11, 1) } },
        function (err, run) {
            if (err) res.send(err);
           
        }
    );
};

exports.monthly_kms = function (req, res) {
  const months = {}
  Run.find().exec(function (err, runs) {
    //runs = JSON.stringify(runs)
    for (let i = 0; i < runs.length; i++) {
      const element = runs[i];
      const y = element.start.getFullYear()
      const m = element.start.getMonth()+1
      const km = element.distance
      const x = element.speed;
      if (x > 10){
        const d = "" + m + "." + y
        if (months[d] != undefined){
            months[d] += km
        } else {
        months[d] = km
        }
        }
    }
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.json({"data": months})
})
}

exports.hr_speed = function (req, res) {
    const data = []
    Run.find().exec(function (err, runs) {
      for (let i = 0; i < runs.length; i++) {
        const element = runs[i];
        const y = Math.round(element.avgHeartRate);
        const x = element.speed
        //const km = element.distance
        if (x > 10 && y > 100){
            data.push({x: x, y: y})
        }
        
      }
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.json({"data": data})
  })
}

exports.run_type = function (req, res) {
    const data = {20: 0, 10: 0, 0: 0};
    Run.find().exec(function (err, runs) {
      for (let i = 0; i < runs.length; i++) {
        const element = runs[i];
        const x = element.speed
        const km = element.distance
        if (x > 10){
            if (km > 20){
                data[20] += km
            } else if (km > 10){
                data[10] += km
            }
            else{
                data[0] += km
            }
        }
        
      }
      
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.json({data})
  })
  }

  exports.hr_speed_distance = function (req, res) {
    const data = []
    Run.find().exec(function (err, runs) {
      for (let i = 0; i < runs.length; i++) {
        const element = runs[i];
        const y = Math.round(element.avgHeartRate);
        const x = element.speed
        const r = element.distance / 7
        if (x > 10 && y > 100){
            data.push({x: x, y: y, r: r})
        }
        
      }
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.json({"data": data})
  })
}

function aggregate_heart_rate(hr_raw) {
    var hr_data = {};
    var bpms = hr_raw.map((entry) => entry.qty);

    hr_data.avg = bpms.reduce((a, b) => a + b, 0) / bpms.length;
    hr_data.max = Math.max(...bpms);
    hr_data.min = Math.min(...bpms);
    hr_data.std = Math.sqrt(
        bpms.reduce((a, b) => a + b * b, 0) / bpms.length -
            hr_data.avg * hr_data.avg
    );
    bpms = bpms.sort();
    hr_data.median = bpms[Math.floor(bpms.length / 2)];
    hr_data.q1 = bpms[Math.floor(bpms.length / 4)];
    hr_data.q3 = bpms[Math.floor((bpms.length * 3) / 4)];
    hr_data.p1 = bpms[Math.floor(bpms.length / 10)];
    hr_data.p9 = bpms[Math.floor((bpms.length * 9) / 10)];
    hr_data.iqr = hr_data.q3 - hr_data.q1;
    return hr_data;
}

function find_duplicate(runs, run) {
    for (let r of runs) {
        if (
            String(r.start) == String(run.start) &&
            String(r.end) == String(run.end)
        ) {
            return r;
        }
    }
    return null;
}
