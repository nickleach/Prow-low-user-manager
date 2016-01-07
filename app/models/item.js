var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

var ItemSchema = new Schema({
  basePrice: { type: Number, required: true },
  title: { type: String, required: true },
  colors: [String],
  pricingTiers: [{
    price: Number,
    quantity: Number
  }],
  description: String
});

module.exports = mongoose.model('Item', ItemSchema);
