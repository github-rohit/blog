(function(app){

	app.module.controller('EmailVerification', EmailVerification);
		EmailVerification.$inject = ["$routeParams", '$location', 'RegisterService']

		function EmailVerification($routeParams, $location, RegisterService) {
			var ID = $routeParams.id;
			var _this = this;
			
			this.error = false;
			
			if (!ID) {
				$location.path('/');
			} else {
				RegisterService.emailVerification(ID, function(res){
					if (res.data.error) {
						_this.error = true;
					} else if (res.data.success) {
						$location.path('/user/login');
					}
				});				
			}
		}

})(app);