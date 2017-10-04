(function(app){

	app.module.controller('LoginController', LoginController);
	LoginController.$inject = ['$scope', '$http', '$location', 'AuthenticationService'];

	function LoginController($scope, $http, $location, AuthenticationService) {
		var self = this;

		self.formData = {};
		self.formError = {};

		self.submit = function() {
			AuthenticationService.Login(self.formData, res => {
				if (res.data.success) {
					AuthenticationService.SetCredentials(res.data.user);
					$location.path('/dashboard');
				} else {
					
				}
			});
		};	
		

	}

})(app);