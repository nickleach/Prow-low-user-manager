var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var sendMail   = require('../helpers/emailHelper');
var verifyToken = require('../helpers/tokenHelper');

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

				sampleUser.name = 'nick';
				sampleUser.username = 'nick';
				sampleUser.password = 'nick';
				sampleUser.wholesale = false;
				sampleUser.admin = true;
				sampleUser.store = "Test Store";
				sampleUser.address = "test address";
				sampleUser.city = "dwood";
				sampleUser.state = "Georgia";
				sampleUser.zip = 30338;
				sampleUser.phone = "59586859";
				sampleUser.email = "ngk@gjka.com";
				sampleUser.items = [
						{
							itemId : "568ee76a67b65a052b027002",
							price : "0"
						}
					]

				sampleUser.save();
			} else {
				console.log(user);

				// if there is a chris, update his password
				user.password = 'supersecret';
				user.save();
			}

		});

	});

	userRouter.post('/authenticate', function(req, res, next) {

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('name username password items admin _id').exec(function(err, user) {

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
	        	username: user.username,
	        	items: user.items
	        }, superSecret, {
	          expiresIn: 172800 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token,
	          admin: user.admin,
	          id : user._id
	        });
	      }

	    }

	  });
	});

	userRouter.post('/forgotPassword', function(req, res, next) {

	  // find the user
	  User.findOne({
	    email: req.body.email
	  }).select('name username password _id').exec(function(err, user) {

	    if (err) next(err);

	    // no user with that username was found
	    if (!user) {
	      var notFound = new Error("Could not find user with the email address provided");
            notFound.status = 404;
            return next(notFound);
	    } else if (user) {

	        // create a token
	        var token = jwt.sign({
	        	id: user._id
	        }, superSecret, {
	          expiresIn: 172800 // expires in 24 hours
	        });

	        var email = "<p>Your password reset request from ProLowPutting.com.</p> \
	        <p>Please go to " + config.appUrl + "/resetPassword/" + user._id + '/' + token + " to choose a new password</p>";

	        var response = sendMail(req.body.email, "ProLowPutting Password Reset", email, email, "noreply@prolowputting.com", "ProLowPutting" );

	        console.log("Password reset requested for user:" + user);

	        if(response){
	        	var emailFailed = new Error("Something went wrong with the email server!");
	        	console.log("Password reset email failed " + response);

            emailFailed.status = 500;
            return next(emailFailed);
	        }
	        else{
	        	response = "A link to reset your password has been sent to your email address.";
	        }
	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: response
	        });

	    }

	  });
	});

	// route middleware to verify a token
	userRouter.use('/users', function(req, res, next) {
		verifyToken(req, res,next);
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
			user.items = req.body.items;
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


				if (user.wholesale){
					var email = "<p>Congratulations! You've been approved to purchase wholesale from ProlowPutting.com!</p> \
					<p>Your credentials are: </p><p>Username: " + user.username + "</p><p>Password: " + req.body.password +"</p> \
					You've been approved for a price of $" + user.items[0].price + "per unit. Go to http://prolowputting.com/#/buy, click on the wholesale tab and start purchasing today!";


					var response = sendMail(user.email, "Welcome Prolow Wholesale Customer!", email, email, "noreply@prolowputting.com", "Pro Low Putting");

					if(response){
	        	var emailFailed = new Error("Something went wrong with the email server!");
	        	console.log("Create wholesale user email failed " + response);
            emailFailed.status = 500;
            return next(emailFailed);
	        }

					console.log("Wholesale user created! " + user.username);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})

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
				if (req.body.store) user.store = req.body.store;
				if (req.body.address) user.address = req.body.address;
				if (req.body.city) user.city = req.body.city;
				if (req.body.state) user.state = req.body.state;
				if (req.body.zip) user.zip = req.body.zip;
				if (req.body.phone) user.phone = req.body.phone;
				if (req.body.email) user.email = req.body.email;
				if (req.body.items) user.items = req.body.items;
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
	// route middleware to verify a token
	userRouter.use('/me', function(req, res, next) {
		verifyToken(req, res, next);
	});
	// api endpoint to get user information
	userRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return userRouter;
};
