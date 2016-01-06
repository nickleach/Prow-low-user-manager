var bodyParser  = require('body-parser');  // get body-parser
var PricingTier = require('../models/pricingTiers');
var jwt         = require('jsonwebtoken');
var config      = require('../../config');
var sendMail    = require('../helpers/emailHelper');
var verifyToken = require('../helpers/tokenHelper');
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
    });


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
    });

  pricingTierRouter.use('/pricing', function(req, res, next) {
    verifyToken(req, res, next);
  });

  pricingTierRouter.route('/pricing')
      .post(function(req, res, next){
      var pricingTier = new PricingTier();

      pricingTier.price = req.body.price;
      pricingTier.quantity = req.body.quantity;
      pricingTier.itemId = req.body.itemId;

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

  pricingTierRouter.use('/pricing/:pricingTier_id', function(req, res, next) {
    verifyToken(req, res, next);
  });
      // ----------------------------------------------------
  pricingTierRouter.route('/pricing/:pricingTier_id')

    .put(function(req, res, next) {
      PricingTier.findById(req.params.pricingTier_id, function(err, pricingTier) {

        if(err) {
            next(err);
         }

        // set the new pricingTier information if it exists in the request
        if (req.body.price) pricingTier.price = req.body.price;
        if (req.body.quantity) pricingTier.quantity = req.body.quantity;
        if (req.body.itemId) pricingTier.itemId = req.body.itemId;

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
