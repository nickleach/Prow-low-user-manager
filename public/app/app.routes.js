angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})

		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})

		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// page to edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})
		.when('/testimonials', {
			templateUrl: 'app/views/pages/testimonials/allTestimonials.html',
			controller: 'testimonialController',
			controllerAs: 'testimonial'
		})
		.when('/testimonials/create', {
			templateUrl: 'app/views/pages/testimonials/singleTestimonial.html',
			controller: 'testimonialCreateCtrl',
			controllerAs: 'testimonial'
		})
		.when('/testimonials/:testimonial_id', {
			templateUrl: 'app/views/pages/testimonials/singleTestimonial.html',
			controller: 'testimonialEditCtrl',
			controllerAs: 'testimonial'
		})
		.when('/pricing', {
			templateUrl: 'app/views/pages/pricing/allPricing.html',
			controller: 'pricingController',
			controllerAs: 'pricing'
		})
		.when('/pricing/:pricing_id', {
			templateUrl: 'app/views/pages/pricing/singlePricing.html',
			controller: 'pricingEditCtrl',
			controllerAs: 'pricing'
		})
		.when('/items', {
			templateUrl: 'app/views/pages/items/allItems.html',
			controller: 'itemController',
			controllerAs: 'item'
		})
		.when('/items/create', {
			templateUrl: 'app/views/pages/items/singleItem.html',
			controller: 'itemCreateCtrl',
			controllerAs: 'item'
		})
		.when('/items/:item_id', {
			templateUrl: 'app/views/pages/items/singleItem.html',
			controller: 'itemEditCtrl',
			controllerAs: 'item'
		});

	$locationProvider.html5Mode(true);

});
