(function (app) {
	'use strict';

 	app.module.factory('AuthenticationService', AuthenticationService);
 	
	AuthenticationService.$inject = ['$http', '$cookies', '$rootScope'];

	function AuthenticationService($http, $cookies, $rootScope, $timeout) {
		var service = {
			IsLogin: function () {
				var _this = this;
				$http.post('/api/islogin').then(function(response){
					
				}, function(response) {
					if (response.status === 401) {
						_this.ClearCredentials();
					}
				});
			},
			Login: function (data, callback) {
				$http.post('/api/login', data).then(function(response){
					callback(response);
				}, function(response){
					callback(response);
				});
			},
			Logout: function (callback) {
				$http.post('/api/logout').then(function(response) {
					callback(response);
				}, function(response){
					callback(response);
				});
			},
			SetCredentials: function (user, extend) {

				if (extend) {
					user = angular.extend({}, $rootScope.globals.currentUser, user);
				}
				
				$rootScope.globals = {
					currentUser: user
				}

				$cookies.putObject('BLOG.LOGIN', $rootScope.globals);

				this.isLogin = true;
			},
			ClearCredentials: function () {
				$rootScope.globals = {};
				$cookies.remove('BLOG.LOGIN', {path: '/'});

				this.isLogin = false;
			},
			GetUser: function() {
				return $rootScope.globals.currentUser;
			}
		};

		return service;
	}
 
})(app);