var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

var PricingSchema = new Schema({
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  itemId: { type: String, required: true}
});

module.exports = mongoose.model('PricingTier', PricingSchema);
