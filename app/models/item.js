var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

var ItemSchema = new Schema({
  price: { type: Number, required: true },
  title: { type: String, required: true },
  colors: [String]
});

module.exports = mongoose.model('Item', ItemSchema);
