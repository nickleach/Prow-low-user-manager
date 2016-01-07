var bodyParser  = require('body-parser');  // get body-parser
var Item        = require('../models/item');
var jwt         = require('jsonwebtoken');
var config      = require('../../config');
var sendMail    = require('../helpers/emailHelper');
var verifyToken = require('../helpers/tokenHelper');
var moment      = require('moment');

var superSecret = config.secret;


module.exports = function(app, express){
  var itemRouter = express.Router();

  itemRouter.route('/items')

    .get(function(req, res, next){
      Item.find(function(err, items){
        if(err){
          return next(err);
        }

        res.json(items)
      })
    });

    itemRouter.route('/items/:item_id')

      .get(function(req, res, next) {
        Item.findById(req.params.item_id, function(err, item) {


        if(!item){
            var notFound = new Error("item not found");
            notFound.status = 404;
            return next(notFound);
          }

         if (err) {
          next(err);
        }

        res.json(item);
      });
    })


  itemRouter.use('/items', function(req, res, next) {
      verifyToken(req, res, next);
  });

  itemRouter.route('/items')
    .post(function(req, res, next){
      var item = new Item();

      item.basePrice = req.body.basePrice;
      item.colors = req.body.colors;
      item.title = req.body.title;
      item.pricingTiers = req.body.pricingTiers;
      item.description = req.body.description;

      console.log("Making new item " + item);

      item.save(function(err){
        if(err){
          return next(err);
        }
        console.log("item created!");

        res.json({
          message: "Item created!",
          created: item
        });
      })
    });

  itemRouter.use('/items/:item_id', function(req, res, next) {
      verifyToken(req, res, next);
    });
      // ----------------------------------------------------
  itemRouter.route('/items/:item_id')

    .put(function(req, res, next) {
      Item.findById(req.params.item_id, function(err, item) {

        if(err) {
            next(err);
         }

        // set the new item information if it exists in the request
        if (req.body.basePrice) item.basePrice = req.body.basePrice;
        if (req.body.colors) item.colors = req.body.colors;
        if (req.body.title) item.title = req.body.title;
        if (req.body.pricingTiers) item.pricingTiers = req.body.pricingTiers;
        if (req.body.description) item.description = req.body.description;

        // save the item
        item.save(function(err) {
          if(err) {
              next(err)
           }

          // return a message
          res.json({ message: 'item updated!' });
        });

      });
    })

    // delete the item with this id
    .delete(function(req, res, next) {
      Item.remove({
        _id: req.params.item_id
      }, function(err, item) {

        if(!item){
          var notFound = new Error("item not found");
          notFound.status = 404;
          return next(notFound);
        }

        if(err) {
            next(err);
         }


        res.json({ message: 'Successfully deleted' });
      });
    });



  return itemRouter;
}
