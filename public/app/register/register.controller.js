(function(app){

	app.module.controller('RegisterController', RegisterController);
		RegisterController.$inject = ['$http', 'FormErrorService', 'RegisterService']

		function RegisterController($http, FormErrorService, RegisterService) {
			const self = this;
			this.formData = {};
			this.formError = {};
			this.formValidateMsg = FormErrorService.messages;

			this.submit = function() {
				RegisterService.register(self.formData, function(res){
					const data = res.data || {};
					self.emailunameTaken = {};
					self.userSuccess = false;

					if (data.errors) {
						self.formError = FormErrorService.show(data.errors);
					} else if (data.error) {
						self.emailunameTaken[data.error.name] = true;
					} else if (data.success) {
						self.userSuccess = true;
					}
				});
			};
		}

})(app);