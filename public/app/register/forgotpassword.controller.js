(function(app){

	app.module.controller('ForgotPassword', ForgotPassword);
		ForgotPassword.$inject = ['$scope', '$http', '$interval', 'FormErrorService', 'RegisterService']

		function ForgotPassword($scope, $http, $interval, FormErrorService, RegisterService) {
			var _this = this;
			this.formData = {};
			this.formError = {};
			this.formValidateMsg = FormErrorService.messages;
			this.userSuccess = false;
			this.displayForm = true;
			
			var isgrecaptchajs = $interval(function(){
				
				try {
					grecaptcha.render('gre-captcha', {
					  'sitekey' : '6LciizMUAAAAAE0nWYFK33EmsDQ_L0M7TwyHULvz'
					});	
					
					$interval.cancel(isgrecaptchajs);					
				} catch (e) {
					
				}
				
			}, 1000);

			this.submit = function() {
				var g = grecaptcha.getResponse();
				
				if (!g) {
					alert("The reCAPTCHA wasn't entered correctly.");
					return;
				}
				
				RegisterService.forgotPassword(_this.formData, function(res){
					const data = res.data || {};
					_this.userSuccess = false;
					_this.userEmpty = false;
					_this.error = false;
					
					if (data.errors) {
						
						_this.formError = FormErrorService.show(data.errors);
						
					} else if (data.userEmpty) {
						
						_this.displayForm = false;
						_this.userEmpty = true;
						
					} else if (data.error) {
						
						_this.error = true;
						
					} else if (data.success) {
						_this.displayForm = false;
						_this.userSuccess = true;
					}
				});
			};
		}

})(app);