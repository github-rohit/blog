(function(app) {
	app.module.run(run);
	run.$inject = ['$rootScope', '$location', '$route', '$cookies', '$http', 'AuthenticationService'];
	
	function run($rootScope, $location, $route, $cookies, $http, AuthenticationService) {
		// keep user logged in after page refresh
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/api/islogin", false);
		xhr.onload = function (e) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
				} else if(xhr.status === 401) {
					AuthenticationService.ClearCredentials();
				} else{}
			}
		};
		xhr.send(null);

		const blogLogin = $cookies.get('BLOG.LOGIN');

		$rootScope.globals = blogLogin ? JSON.parse(blogLogin) : {};

		if ($rootScope.globals.currentUser) {
			AuthenticationService.isLogin = true;
		}

		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			console.log('hu')
			routeChangeStart(event, next, current);
		});

		function routeChangeStart(event, next, current) {
			if (next.access && next.access.restricted && !AuthenticationService.isLogin) {
				$location.path('/');
				$route.reload();
			}
		}

  }
})(app);