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
			},
			emailVerification: function (id, callback) {
				$http.post('/api/registerverification', {
					id: id
				}).then(function(response){
					callback(response);
				}, function(response){
					
				});
			},
			resendEmail: function (email, callback) {
				$http.post('/api/resendemail', {
					email: email
				}).then(function(response){
					callback(response);
				}, function(response){
					
				});
			},
			forgotPassword: function (data, callback) {
				$http.post('/api/forgotpassword', data).then(function(response){
					callback(response);
				}, function(response){
					
				});
			},
			resetPassword: function (data, callback) {
				$http.post('/api/resetpassword', data).then(function(response){
					callback(response);
				}, function(response){
					
				});
			}
		};

		return service;
	}
 
})(app);