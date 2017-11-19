(function(app){

	app.module.controller('RegisterController', RegisterController);
		RegisterController.$inject = ['$scope', '$rootScope', '$http', '$interval', 'FormErrorService', 'RegisterService']

		function RegisterController($scope, $rootScope, $http, $interval, FormErrorService, RegisterService) {
			var _this = this;
			this.formData = {
				gender: ''
			};
			this.formError = {};
			this.formValidateMsg = FormErrorService.messages;
			this.userSuccess = false;

			$rootScope.navActiveTab = 'signup';
			
			this.submit = function() {

				if (_this.formData.honeypot) {
					return;
				}
				
				RegisterService.register(_this.formData, function(res){
					var data = res.data || {};
					_this.emailunameTaken = {};
					_this.userSuccess = false;

					if (data.errors) {
						_this.formError = FormErrorService.show(data.errors);
					} else if (data.error) {
						_this.emailunameTaken[data.error.name] = true;
					} else if (data.success) {
						_this.userSuccess = true;
					}
				});
			};
		}

})(app);