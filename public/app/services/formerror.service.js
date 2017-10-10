(function (app) {
	'use strict';

 	app.module.factory('FormErrorService', FormErrorService);
 	
	FormErrorService.$inject = [];

	function FormErrorService() {
		
		var service = {
			messages: {
				required: 'This field is required.',
				email: 'Please enter a valid email.',
				passwdAgain: 'Password do not match.',
				emailTaken: 'This email already taken.',
				emailVerification: 'Email already register. But verification is pending!',
				unameTaken: 'This username already taken.'
			},
			show: function (errObj) {
				const self = this;
				var obj = {};

				angular.forEach(errObj, function(error) {
					if (!obj[error.param]) {
						obj[error.param] = error.msg;
					}
				});      

				return obj;  
			},
			hide: function (obj) {

			}
		};

		return service;
	}
 
})(app);