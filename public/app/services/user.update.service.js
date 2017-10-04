(function (app) {
	'use strict';

 	app.module.factory('UserUpdateService', UserUpdateService);
 	
	UserUpdateService.$inject = ['$http'];

	function UserUpdateService($http) {
		
		var service = {
			update: function (data, callback) {
				$http.post('/api/user/update', data).then(function(response){
					callback(response);
				}, function(response){

				});
			},
			delete: function (data, callback) {
				$http.delete('/api/user/delete', data).then(function(response){
					callback(response);
				}, function(response){
					
				});
			}
		};

		return service;
	}
 
})(app);