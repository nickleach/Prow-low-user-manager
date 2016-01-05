angular.module('testimonialService', [])

.factory('Testimonial', function($http) {

  // create a new object
  var testimonialFactory = {};

  // get a single testimonial
  testimonialFactory.get = function(id) {
    return $http.get('/api/testimonials/' + id);
  };

  // get all testimonials
  testimonialFactory.all = function() {
    return $http.get('/api/testimonials/');
  };

  // create a testimonial
  testimonialFactory.create = function(testimonialData) {
    return $http.post('/api/testimonials/', testimonialData);
  };

  // update a testimonial
  testimonialFactory.update = function(id, testimonialData) {
    return $http.put('/api/testimonials/' + id, testimonialData);
  };

  // delete a testimonial
  testimonialFactory.delete = function(id) {
    return $http.delete('/api/testimonials/' + id);
  };

  // return our entire testimonialFactory object
  return testimonialFactory;

});
