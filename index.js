require('dotenv').config();
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Run = require('./api/models/runModel'), //created model loading here
  bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '200mb'}));
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PW+'@cluster0.nlxri.mongodb.net/test_1?retryWrites=true&w=majority'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/runRoute'); //importing route
routes(app); //register the route


app.listen(port);


console.log('test list RESTful API server started on: ' + port);
