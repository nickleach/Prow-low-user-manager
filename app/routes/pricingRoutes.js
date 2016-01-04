var bodyParser  = require('body-parser');  // get body-parser
var PricingTier = require('../models/pricingTiers');
var jwt         = require('jsonwebtoken');
var config      = require('../../config');
var sendMail    = require('../helpers/emailHelper');
var moment      = require('moment');

var superSecret = config.secret;


module.exports = function(app, express){
  var pricingTierRouter = express.Router();

  pricingTierRouter.route('/pricing')

    .get(function(req, res, next){
      PricingTier.find(function(err, pricingTiers){
        if(err){
          return next(err);
        }

        res.json(pricingTiers)
      })
    })

    .post(function(req, res, next){
      var pricingTier = new PricingTier();

      pricingTier.price = req.body.price;
      pricingTier.quantity = req.body.quantity;

      console.log("Making new pricingTier " + pricingTier);

      pricingTier.save(function(err){
        if(err){
          return next(err);
        }
        console.log("pricingTier created!");

        res.json({
          message: "Pricing tier created!",
          created: pricingTier
        });
      })
    });

    pricingTierRouter.use(function(req, res, next) {
      // do logging
      console.log('Admin editing pricingTiers');

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
  pricingTierRouter.route('/pricing/:pricingTier_id')

    // get the pricingTier with that id
    .get(function(req, res, next) {
      PricingTier.findById(req.params.pricingTier_id, function(err, pricingTier) {


        if(!pricingTier){
            var notFound = new Error("pricingTier not found");
            notFound.status = 404;
            return next(notFound);
          }

         if (err) {
          next(err);
        }

        res.json(pricingTier);
      });
    })

    .put(function(req, res, next) {
      PricingTier.findById(req.params.pricingTier_id, function(err, pricingTier) {

        if(err) {
            next(err);
         }

        // set the new pricingTier information if it exists in the request
        if (req.body.price) pricingTier.price = req.body.price;
        if (req.body.quantity) pricingTier.quantity = req.body.quantity;

        // save the pricingTier
        pricingTier.save(function(err) {
          if(err) {
              next(err)
           }

          // return a message
          res.json({ message: 'pricingTier updated!' });
        });

      });
    })

    // delete the pricingTier with this id
    .delete(function(req, res, next) {
      PricingTier.remove({
        _id: req.params.pricingTier_id
      }, function(err, pricingTier) {

        if(!pricingTier){
          var notFound = new Error("pricingTier not found");
          notFound.status = 404;
          return next(notFound);
        }

        if(err) {
            next(err);
         }


        res.json({ message: 'Successfully deleted' });
      });
    });







  return pricingTierRouter;
}
