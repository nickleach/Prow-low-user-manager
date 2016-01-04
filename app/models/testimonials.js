var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var TestimonialSchema = new Schema({
  date: { type: Number, required: true },
  testimonial: { type: String, required: true },
  author: { type: String, required: true },
  image: String,
  title: { type: String, required: true },
  approved: { type: Boolean, required: true }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
