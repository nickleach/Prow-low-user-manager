var bodyParser  = require('body-parser');  // get body-parser
var Testimonial = require('../models/testimonials');
var jwt         = require('jsonwebtoken');
var config      = require('../../config');
var verifyToken = require('../helpers/tokenHelper');
var sendMail    = require('../helpers/emailHelper');
var moment      = require('moment');

var superSecret = config.secret;
var testimonialEmail = config.email.testimonial;
var rootUrl = config.rootUrl + 'testimonials/';

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

      testimonial.date = moment().unix();
      testimonial.testimonial = req.body.testimonial;
      testimonial.author = req.body.author;
      testimonial.image = req.body.image;
      testimonial.title = req.body.title;
      testimonial.approved = req.body.approved;
      testimonial.customerCreated = req.body.customerCreated;

      console.log("Making new testimonial " + testimonial);

      testimonial.save(function(err){
        if(err){
          return next(err);
        }
        console.log("Testimonial created!");

        if(testimonial.customerCreated){
          var email = "<p>A customer has submitted a new testimonial! Click the link below to approve it!</p> \
          <p>" + rootUrl + testimonial._id + '</p>';
         sendMail(testimonialEmail, "New Testimonial", email, email, "noreply@prolowputting.com", "Pro Low Putting");
        }

        res.json({
          message: "Your testimonial has been submitted! Thank you!",
          created: testimonial
        });
      })
    });

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
      });

    testimonialRouter.use('/testimonials/:testimonial_id', function(req, res, next) {
      verifyToken(req, res, next);
    });
      // ----------------------------------------------------
  testimonialRouter.route('/testimonials/:testimonial_id')

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

        if (req.body.date) {
          testimonial.date = moment(req.body.date).unix();
        }
        testimonial.approved = req.body.approved;
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
