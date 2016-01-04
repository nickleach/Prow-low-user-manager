var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var userRouter = express.Router();

	// route to generate sample user
	userRouter.post('/sample', function(req, res, next) {

		// look for the user named chris
		User.findOne({ 'username': 'chris' }, function(err, user) {

			// if there is no chris user, create one
			if (!user) {
				var sampleUser = new User();

				sampleUser.name = 'Chris';
				sampleUser.username = 'chris';
				sampleUser.password = 'supersecret';
				sampleUser.wholesale = false;
				sampleUser.admin = true;
				sampleUser.prolowPrice = 0;
				sampleUser.store = "Test Store";
				sampleUser.address = "test address";
				sampleUser.city = "dwood";
				sampleUser.state = "Georgia";
				sampleUser.zip = 30338;
				sampleUser.phone = "59586859";
				sampleUser.email = "ngk@gjka.com";

				sampleUser.save();
			} else {
				console.log(user);

				// if there is a chris, update his password
				user.password = 'supersecret';
				user.save();
			}

		});

	});

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	userRouter.post('/authenticate', function(req, res, next) {

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('name username password').exec(function(err, user) {

	    if (err) next(err);

	    // no user with that username was found
	    if (!user) {
	      var notFound = new Error("Could not find user");
            notFound.status = 404;
            return next(notFound);
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        var notFound = new Error("Password and username doesn't match our records");
            notFound.status = 404;
            return next(notFound);
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username
	        }, superSecret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }

	    }

	  });
	});

	// route middleware to verify a token
	userRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {

	      if (err) {
	        res.status(403).send({
	        	success: false,
	        	message: 'Failed to authenticate token.'
	    	});
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;

	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });

	  } else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({
   	 		success: false,
   	 		message: 'No token provided.'
   	 	});

	  }
	});

	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	userRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});

	// on routes that end in /users
	// ----------------------------------------------------
	userRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res, next) {

			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)
			user.admin = req.body.admin ? req.body.admin : false;
			user.wholesale = req.body.wholesale ? req.body.wholesale : false;
			user.prolowPrice = req.body.prolowPrice;
			user.store = req.body.store;
			user.address = req.body.address;
			user.city = req.body.city;
			user.state = req.body.state;
			user.zip = req.body.zip;
			user.phone = req.body.phone;
			user.email = req.body.email;

			console.log("Creating new user: " + user);

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000){
              var userExists = new Error("The user with that username already exists!");
              userExists.status = 500;
              return next(userExists);
              }
					else
						return next(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res, next) {

			User.find({}, function(err, users) {
				if (err) {
					return next(err);
				}

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	userRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res, next) {
			User.findById(req.params.user_id, function(err, user) {


				if(!user){
            var notFound = new Error("User not found");
            notFound.status = 404;
            return next(notFound);
          }

         if (err) {
					next(err);
				}

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res, next) {
			User.findById(req.params.user_id, function(err, user) {

				if(err) {
            next(err);
         }

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				if (req.body.admin) user.admin = req.body.admin;
				if (req.body.wholesale) user.wholesale = req.body.wholesale;
				if (req.body.prolowPrice) user.prolowPrice = req.body.prolowPrice;
				if (req.body.store) user.store = req.body.store;
				if (req.body.address) user.address = req.body.address;
				if (req.body.city) user.city = req.body.city;
				if (req.body.state) user.state = req.body.state;
				if (req.body.zip) user.zip = req.body.zip;
				if (req.body.phone) user.phone = req.body.phone;
				if (req.body.email) user.email = req.body.email;
				// save the user
				user.save(function(err) {
					if(err) {
              next(err)
           }

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res, next) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {

        if(!user){
          var notFound = new Error("User not found");
          notFound.status = 404;
          return next(notFound);
        }

        if(err) {
            next(err);
         }


				res.json({ message: 'Successfully deleted' });
			});
		});

	// api endpoint to get user information
	userRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return userRouter;
};
