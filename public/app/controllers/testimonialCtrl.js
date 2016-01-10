angular.module('testimonialCtrl', ['testimonialService'])

  .controller('testimonialController', function(Testimonial) {

    var vm = this;

    vm.processing = true;

    Testimonial.all()
      .success(function(data){
        vm.processing = false;

        vm.testimonials = data;
      });

    vm.deleteTestimonial = function(id){
      vm.processing = true;

      Testimonial.delete(id)
        .success(function(data){

          Testimonial.all()
            .success(function(data){
            vm.processing = false;

            vm.testimonials = data;
          });

        });

    };

  })

  .controller('testimonialCreateCtrl', function(Testimonial){
    var vm = this;

    vm.type = 'create';

    vm.saveTestimonial = function(){
      vm.processing = true;
      vm.message = '';

      Testimonial.create(vm.testimonialData)
        .success(function(data){
          vm.processing = false;
          vm.testimonialData = {};
          vm.message = data.message;

        });
    };
  })

.controller('testimonialEditCtrl', function($routeParams, Testimonial, $location) {

  var vm = this;

  vm.type = 'edit';

  Testimonial.get($routeParams.testimonial_id)
    .success(function(data) {
      vm.testimonialData = data;
    });

  vm.saveTestimonial = function() {
    vm.processing = true;
    vm.message = '';
    console.log(vm.testimonialData);
    // if(vm.testimonialData.approved == "")
    Testimonial.update($routeParams.testimonial_id, vm.testimonialData)
      .success(function(data) {
        vm.processing = false;

        vm.testimonialData = {};

        vm.message = data.message;

        $location.path('/testimonials');
      });
  };

});
