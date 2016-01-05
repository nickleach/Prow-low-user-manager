angular.module('pricingCtrl', ['pricingService'])

  .controller('pricingController', function(Pricing) {

    var vm = this;

    vm.processing = true;

    Pricing.all()
      .success(function(data){
        vm.processing = false;

        vm.pricings = data;
      });

    vm.deletePricing = function(id){
      vm.processing = true;

      Pricing.delete(id)
        .success(function(data){

          Pricing.all()
            .success(function(data){
            vm.processing = false;

            vm.pricings = data;
          });

        });

    };

  })

  .controller('PricingCreateCtrl', function(Pricing){
    var vm = this;

    vm.type = 'create';

    vm.savePricing = function(){
      vm.processing = true;
      vm.message = '';

      Pricing.create(vm.pricingData)
        .success(function(data){
          vm.processing = false;
          vm.pricingData = {};
          vm.message = data.message;

        });
    };
  })

.controller('pricingEditCtrl', function($routeParams, Pricing) {

  var vm = this;

  vm.type = 'edit';

  Pricing.get($routeParams.pricing_id)
    .success(function(data) {
      vm.pricingData = data;
    });

  vm.savePricing = function() {
    vm.processing = true;
    vm.message = '';
    console.log(vm.pricingData);
    // if(vm.pricingData.approved == "")
    Pricing.update($routeParams.pricing_id, vm.pricingData)
      .success(function(data) {
        vm.processing = false;

        vm.pricingData = {};

        vm.message = data.message;
      });
  };

});
