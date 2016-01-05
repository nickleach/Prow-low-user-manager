angular.module('userApp', ['ngAnimate',
                           'app.routes',
                           'authService',
                           'mainCtrl',
                           'userCtrl',
                           'userService',
                           'testimonialCtrl',
                           'testimonialService',
                           'pricingCtrl',
                           'pricingService'
                           ])
.filter('dateTime', function(){
  return function(date, input){
    var filteredDate = "";
    if(!input){
      filteredDate = moment.unix(date).format("MMM Do YYYY");
    }else{
    filteredDate = moment.unix(date).format();
    }
    return filteredDate;
   };


  })
// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});
