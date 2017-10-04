(function(app){

	app.module.controller('LogoutController', LogoutController);
	LogoutController.$inject = ['$window', 'AuthenticationService']

	function LogoutController($window, AuthenticationService) {
		AuthenticationService.Logout(function(res){
			if (res.data.success) {
				AuthenticationService.ClearCredentials();
				$window.location.href = '/user/login';
			}
		});
	}

})(app);