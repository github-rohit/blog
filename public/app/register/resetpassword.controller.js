(function(app){

	app.module.controller('ResetPassword', ResetPassword);
		ResetPassword.$inject = ["$routeParams", "$location", '$interval', 'FormErrorService', 'RegisterService']

		function ResetPassword($routeParams, $location, $interval, FormErrorService, RegisterService) {
			var URL_PARAM = $routeParams.id;
			var _this = this;
			
			this.displayForm = false;
			this.error = false;
			this.norecord = false;
			
			if (!URL_PARAM) {
				$location.path('/');
			}
			
			this.formData = {};
			this.formError = {};
			this.formValidateMsg = FormErrorService.messages;
			this.userSuccess = false;
			
			RegisterService.resetPassword({
				url: URL_PARAM,
				reqType: 'get'
			}, function(res){
				const data = res.data || {};
				_this.error = false;
				_this.norecord = false;
				_this.displayForm = false;
				
				if (data.err) {
					_this.error = true;
					_this.norecord = false;
				} else if (!data.user) {
					_this.error = false;
					_this.norecord = true;
				} else {
					_this.formData = data.user;
					_this.displayForm = true;
				}
				
			});

			this.submit = function() {
				
				if (_this.formData.honeypot) {
					return;
				}
				
				RegisterService.resetPassword(_this.formData, function(res){
					const data = res.data || {};

					if (data.errors) {
						
						_this.formError = FormErrorService.show(data.errors);
						
					} else if (data.error) {
						
						_this.displayForm = false;
						this.error = true;
						
					} else if (data.success) {
						$location.path('/user/login');
					}
				});
			};
		}

})(app);