angular.module('itemCtrl', ['itemService'])

  .controller('itemController', function(Item) {

    var vm = this;

    vm.processing = true;

    Item.all()
      .success(function(data){
        vm.processing = false;
        console.log(data);
        vm.items = data;
      });

    vm.deleteItem = function(id){
      vm.processing = true;

      Item.delete(id)
        .success(function(data){

          Item.all()
            .success(function(data){
            vm.processing = false;

            vm.items = data;
          });

        });

    };

  })

  .controller('itemCreateCtrl', function(Item){
    var vm = this;

    vm.type = 'create';

    vm.saveItem = function(){
      vm.processing = true;
      vm.message = '';

      var tiers = [ vm.tier1, vm.tier2, vm.tier3 ];
      vm.itemData.pricingTiers = tiers;
      Item.create(vm.itemData)
        .success(function(data){
          vm.processing = false;
          vm.itemData = {};
          vm.message = data.message;

        });
    };
  })

.controller('itemEditCtrl', function($routeParams, Item, $location, $log) {

  var vm = this;

  vm.type = 'edit';

  Item.get($routeParams.item_id)
    .success(function(data) {
      vm.itemData = data;
      $log.debug("item", data)
    });

  vm.saveItem = function() {
    vm.processing = true;
    vm.message = '';
    console.log(vm.itemData);
    // if(vm.itemData.approved == "")
    Item.update($routeParams.item_id, vm.itemData)
      .success(function(data) {
        vm.processing = false;

        vm.itemData = {};

        vm.message = data.message;
        $location.path('/items');
      });
  };

});
