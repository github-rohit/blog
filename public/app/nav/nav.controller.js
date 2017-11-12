(function(app){

	app.module.controller('NavController', NavController);
	NavController.$inject = ['$scope', '$rootScope', '$location', 'AuthenticationService']

	function NavController($scope, $rootScope, $location, AuthenticationService) {	
		var _this = this;
		this.Authentication = AuthenticationService.isLogin;
		this.user = {};
		this.displayNav = false;

		$scope.$watch(function() {
			return AuthenticationService.isLogin;
		}, function () {
			_this.Authentication = AuthenticationService.isLogin;
			if (_this.Authentication) {
				_this.currentUser = AuthenticationService.GetUser();
			}
		}, false);

		$rootScope.$watch('navActiveTab', function (newval) {
			_this.navActiveTab = newval;
		});

		this.toggle = function () {
			_this.displayNav = !_this.displayNav;
		}
			
	}

})(app);