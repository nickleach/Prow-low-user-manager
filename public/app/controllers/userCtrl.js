angular.module('userCtrl', ['userService'])

.controller('userController', function(User) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the users at page load
	User.all()
		.success(function(data) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.users = data;
		});

	// function to delete a user
	vm.deleteUser = function(id) {
		vm.processing = true;

		User.delete(id)
			.success(function(data) {

				// get all users to update the table
				// you can also set up your api
				// to return the list of users with the delete call
				User.all()
					.success(function(data) {
						vm.processing = false;
						vm.users = data;
					});

			});
	};

})

// controller applied to user creation page
.controller('userCreateController', function(User, $log, Item, $location) {

	var vm = this;
	  Item.all()
      .success(function(data){
        vm.processing = false;
        console.log(data);
        vm.items = data;
      });
	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		var userItems = vm.items.map(function(i){
			var ims = {
				itemId: i._id,
				price: i.basePrice
			};
			return ims;
		});

		vm.userData.items = userItems;
		$log.debug("creating user", vm.userData)

		// use the create function in the userService
		User.create(vm.userData)
			.success(function(data) {
				vm.processing = false;
				vm.userData = {};
				vm.message = data.message;
				$log.debug(data.message, data);
			});

	};

})

// controller applied to user edit page
.controller('userEditController', function($routeParams, User, Item, $location) {

	var vm = this;

  Item.all()
  	.success(function(data){
    vm.processing = false;
    vm.items = data;
  });

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.get($routeParams.user_id)
		.success(function(data) {
			if(data.items.length > 0){
				var userItems = data.items.map(function(x){
					var item = _.findWhere(vm.items, { _id: x.itemId });
					x.title = item.title
					return x;
				});
				data.items = userItems;
			}else{
				var userItems = vm.items.map(function(x){
					var item = {
						itemId: x._id,
						price: x.basePrice,
						title: x.title
					};
					return item;
				});
				data.items = userItems;
			}
			vm.userData = data;
			console.log(vm.userData);
		});



	// function to save the user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';
		vm.userData.items.forEach(function(item){
			delete item.title;
		});
		// call the userService function to update
		User.update($routeParams.user_id, vm.userData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.userData = {};
				$location.path('/users');

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});
