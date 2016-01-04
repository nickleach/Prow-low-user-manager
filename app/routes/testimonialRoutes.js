var bodyParser  = require('body-parser');  // get body-parser
var Testimonial = require('../models/testimonials');
var jwt         = require('jsonwebtoken');
var config      = require('../../config');
var sendMail    = require('../helpers/emailHelper');
var moment      = require('moment');


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

  return testimonialRouter;
}
