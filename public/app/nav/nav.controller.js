(function(app){

	app.module.controller('NavController', NavController);
	NavController.$inject = ['$scope', '$location', 'AuthenticationService']

	function NavController($scope, $location, AuthenticationService) {	
		var _this = this;
		this.Authentication = AuthenticationService.isLogin;
		this.user = {};
		this.displayNav = false;

		$scope.$watch(function() {
			return AuthenticationService.isLogin;
		}, () => {
			this.Authentication = AuthenticationService.isLogin;
			if (this.Authentication) {
				this.currentUser = AuthenticationService.GetUser();
			}
		}, false);

		this.getClass = function (url) {
			const path = $location.path();

			return path === url ? 'active' : '';
		}
		
		this.toggle = function () {
			_this.displayNav = !_this.displayNav;
		}
			
	}

})(app);