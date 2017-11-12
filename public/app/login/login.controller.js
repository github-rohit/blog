(function(app){

	app.module.controller('LoginController', LoginController);
	LoginController.$inject = ['$scope', '$rootScope', '$http', '$location', 'AuthenticationService', 'RegisterService'];

	function LoginController($scope, $rootScope, $http, $location, AuthenticationService, RegisterService) {
		var _this = this;

		_this.formData = {};
		_this.formError = {};
		_this.loginform = true;

		$rootScope.navActiveTab = 'login';

		this.submit = function() {
			AuthenticationService.Login(_this.formData, function (res){
				if (res.data.success) {
					AuthenticationService.SetCredentials(res.data.user);
					$location.path('/dashboard/published/1');
				} else if (res.data.status) {
					_this.authenticationFailed = false;
					_this.loginform = false;
					_this.status = res.data.status;
					_this.email = res.data.email;
					console.log('');
				} else if (res.data.authenticationFailed) {
					_this.authenticationFailed = true;
				}
			});
		};	
		
		this.resend = function () {
			
			RegisterService.resendEmail(_this.email, function(err) {
				_this.loginform = false;
				_this.status = '';
				_this.emailSend = true;
			});
		}

	}

})(app);