var bodyParser  = require('body-parser');  // get body-parser
var Testimonial = require('../models/testimonials');
var jwt         = require('jsonwebtoken');
var config      = require('../../config');
var sendMail    = require('../helpers/emailHelper');
var moment      = require('moment');

var superSecret = config.secret;


module.exports = function(app, express){
  var testimonialRouter = express.Router();

  testimonialRouter.route('/testimonials')

    .get(function(req, res, next){
      Testimonial.find(function(err, testimonials){
        if(err){
          return next(err);
        }

        res.json(testimonials)
      })
    })

    .post(function(req, res, next){
      var testimonial = new Testimonial();

      testimonial.date = moment(req.body.date).unix();
      testimonial.testimonial = req.body.testimonial;
      testimonial.author = req.body.author;
      testimonial.image = req.body.image;
      testimonial.title = req.body.title;
      testimonial.approved = req.body.approved;

      console.log("Making new testimonial " + testimonial);

      testimonial.save(function(err){
        if(err){
          return next(err);
        }
        console.log("Testimonial created!");

        if(!testimonial.approved){
          var email = "<p>A customer has submitted a new testimonial! Click the link below to approve it!</p> " + testimonial._id;
          console.log(email);
        }

        res.json({
          message: "Your testimonial has been submitted! Thank you!",
          created: testimonial
        });
      })
    });

    testimonialRouter.use(function(req, res, next) {
      // do logging
      console.log('Admin editing testimonials');

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
      // ----------------------------------------------------
  testimonialRouter.route('/testimonials/:testimonial_id')

    // get the testimonial with that id
    .get(function(req, res, next) {
      Testimonial.findById(req.params.testimonial_id, function(err, testimonial) {


        if(!testimonial){
            var notFound = new Error("Testimonial not found");
            notFound.status = 404;
            return next(notFound);
          }

         if (err) {
          next(err);
        }

        res.json(testimonial);
      });
    })

    .put(function(req, res, next) {
      Testimonial.findById(req.params.testimonial_id, function(err, testimonial) {

        if(err) {
            next(err);
         }

        // set the new testimonial information if it exists in the request
        if (req.body.testimonial) testimonial.testimonial = req.body.testimonial;
        if (req.body.author) testimonial.author = req.body.author;
        if (req.body.image) testimonial.image = req.body.image;
        if (req.body.title) testimonial.title = req.body.title;
        if (req.body.approved) testimonial.approved = req.body.approved;
        if (req.body.date) {
          testimonial.date = moment(req.body.date).unix();
        }
        // save the testimonial
        testimonial.save(function(err) {
          if(err) {
              next(err)
           }

          // return a message
          res.json({ message: 'Testimonial updated!' });
        });

      });
    })

    // delete the testimonial with this id
    .delete(function(req, res, next) {
      Testimonial.remove({
        _id: req.params.testimonial_id
      }, function(err, testimonial) {

        if(!testimonial){
          var notFound = new Error("testimonial not found");
          notFound.status = 404;
          return next(notFound);
        }

        if(err) {
            next(err);
         }


        res.json({ message: 'Successfully deleted' });
      });
    });







  return testimonialRouter;
}
