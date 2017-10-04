(function(app){

	app.module.controller('ProfileViewController', ProfileViewController);
	ProfileViewController.$inject = ['$rootScope', 'AuthenticationService'];

	function ProfileViewController($rootScope, AuthenticationService) {
		this.user = $rootScope.globals.currentUser;
		
	}

})(app);