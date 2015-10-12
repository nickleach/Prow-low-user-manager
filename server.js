// BASE SETUP
// ======================


//Call the packages --------------
var express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    morgan       = require('morgan'),
    mongoose     = require('mongoose'),
    config       = require('./config'),
    path         = require('path');


//APP config ================
//===========================
//use body parser so we can grab info from POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


// configure our app to handle CORS requests
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
 Authorization');
 next();
})


//log all requests to console
app.use(morgan('dev'));


//connect to database
mongoose.connect(config.database);


//set static files location
//used for requests that frontend will make
app.use(express.static(__dirname + '/public'));


//ROUTES FOR API =========
//========================

//API Routes -------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);


//Main Catchall Route ---------
//Send Users to Frontend ------
//Has to be registered after API routes
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});



//START THE SERVER
// ============================
app.listen(config.port);
console.log('Server running on port ' + config.port + '...');

