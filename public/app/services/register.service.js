(function (app) {
	'use strict';

 	app.module.factory('RegisterService', RegisterService);
 	
	RegisterService.$inject = ['$http', '$cookies', '$rootScope'];

	function RegisterService($http, $cookies, $rootScope, $timeout) {
		var service = {
			register: function (data, callback) {
				$http.post('/api/register', data).then(function(response){
					callback(response);
				}, function(response){

				});
			}
		};

		return service;
	}
 
})(app);