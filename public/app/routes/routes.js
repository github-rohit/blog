(function(app){

	app.module.config(config);
	config.$inject = ['$routeProvider', '$locationProvider', '$sceDelegateProvider'];

	function config($routeProvider, $locationProvider, $sceDelegateProvider) {
    
    $routeProvider
        .when('/', {
            templateUrl: '/assets/app/index/index.html',
            controller: 'HomeController',
            controllerAs: 'HC'
        }).when('/category/:cat', {
            templateUrl: '/assets/app/index/index.html',
            controller: 'HomeController',
			controllerAs: 'HC',
        })
        .when('/tags/:tags', {
            templateUrl: '/assets/app/index/index.html',
            controller: 'HomeController',
			controllerAs: 'HC',
        })
        .when('/author/:author', {
            templateUrl: '/assets/app/index/index.html',
            controller: 'HomeController',
			controllerAs: 'HC',
        })
        .when('/search', {
            templateUrl: '/assets/app/search/search.html',
            controller: 'SearchController',
			controllerAs: 'SearchC',
        })
        .when('/post/:id', {
            templateUrl: '/assets/app/post/read/read.html',
            controller: 'BlogReadController',
			controllerAs: 'BRC',
        })
        .when('/create/:id?', {
            templateUrl: '/assets/app/post/create/create.html',
            controller: 'BlogCreateController',
			controllerAs: 'BCC',
            access: {
                restricted: true
            }
        })/*.when('/dashboard', {
            templateUrl: '/assets/app/dashboard/dashboard.html',
            controller: 'DashController',
			controllerAs: 'DC',
            access: {
                restricted: true
            }
        })*/.when('/dashboard/:type', {
            templateUrl: '/assets/app/dashboard/dashboard.html',
            controller: 'DashController',
			controllerAs: 'DC',
            access: {
                routeType: "dashboard",
                restricted: true
            }
        }).otherwise({ redirectTo: '/' });
	}

})(app);