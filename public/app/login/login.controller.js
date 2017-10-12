(function(app){

	app.module.controller('LoginController', LoginController);
	LoginController.$inject = ['$scope', '$http', '$location', 'AuthenticationService', 'RegisterService'];

	function LoginController($scope, $http, $location, AuthenticationService, RegisterService) {
		var _this = this;

		_this.formData = {};
		_this.formError = {};
		_this.loginform = true;

		_this.submit = function() {
			AuthenticationService.Login(_this.formData, res => {
				if (res.data.success) {
					AuthenticationService.SetCredentials(res.data.user);
					$location.path('/dashboard');
				} else if (res.data.status) {
					_this.loginform = false;
					_this.status = res.data.status;
					_this.email = res.data.email;
					console.log('');
				}
			});
		};	
		
		_this.resend = function () {
			
			RegisterService.resendEmail(_this.email, function() {
				_this.loginform = false;
				_this.status = '';
				_this.emailSend = true;
			});
		}

	}

})(app);