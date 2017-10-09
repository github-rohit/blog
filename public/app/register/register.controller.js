(function(app){

	app.module.controller('RegisterController', RegisterController);
		RegisterController.$inject = ['$scope', '$http', 'FormErrorService', 'RegisterService']

		function RegisterController($scope, $http, FormErrorService, RegisterService) {
			const self = this;
			this.formData = {
				gender: ''
			};
			this.formError = {};
			this.formValidateMsg = FormErrorService.messages;
			this.userSuccess = false;

			grecaptcha.render('gre-captcha', {
			  'sitekey' : '6LciizMUAAAAAE0nWYFK33EmsDQ_L0M7TwyHULvz'
			});
			
			this.submit = function() {
				var g = grecaptcha.getResponse();
				if (!g) {
					alert("The reCAPTCHA wasn't entered correctly.");
					return;
				}
				
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