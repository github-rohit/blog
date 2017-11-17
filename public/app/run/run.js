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
		xhr.open("GET", "/api/getcategorylist", false);
		xhr.onload = function (e) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					$rootScope.category = JSON.parse(xhr.responseText);
				} else {
					$rootScope.category = {};
				}
			}
		};
		xhr.send(null);

		var blogLogin = $cookies.get('BLOG.LOGIN');

		$rootScope.globals = blogLogin ? JSON.parse(blogLogin) : {};

		if ($rootScope.globals.currentUser) {
			AuthenticationService.isLogin = true;
		}
		
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			$rootScope.bodyClass = "";
			$rootScope.navActiveTab = "";
			routeChangeStart(event, next, current);
		});

		function routeChangeStart(event, next, current) {

			var access = next.access || {};

			if (access.routeType && !isValidRoute(next)) {
				$location.path('/');
			}

			if (!angular.equals({}, access) && access.restricted && !AuthenticationService.isLogin) {
				$location.path('/');
				$route.reload();
			} else if (!angular.equals({}, access) && !access.restricted && AuthenticationService.isLogin) {
				$location.path('/dashboard/published/1');
			}
		}
  	}

	function isValidRoute (routeObj) {
		var isroute = false;
		var routeType = routeObj.access.routeType;
		var params = routeObj.params || {};

		if ( routeType === "dashboard") {
			if (params.type === "published" || params.type === "draft") {
				isroute = true
			}
		}

		return isroute;
	}


})(app);