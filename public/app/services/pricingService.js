angular.module('pricingService', [])

.factory('Pricing', function($http) {

  // create a new object
  var pricingFactory = {};

  // get a single pricing
  pricingFactory.get = function(id) {
    return $http.get('/api/pricing/' + id);
  };

  // get all pricings
  pricingFactory.all = function() {
    return $http.get('/api/pricing/');
  };

  // create a pricing
  pricingFactory.create = function(pricingData) {
    return $http.post('/api/pricing/', pricingData);
  };

  // update a pricing
  pricingFactory.update = function(id, pricingData) {
    return $http.put('/api/pricing/' + id, pricingData);
  };

  // delete a pricing
  pricingFactory.delete = function(id) {
    return $http.delete('/api/pricing/' + id);
  };

  // return our entire pricingFactory object
  return pricingFactory;

});
