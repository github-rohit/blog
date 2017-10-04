(function(app){

	app.module.config(config);
	config.$inject = ['$routeProvider', '$locationProvider', '$sceDelegateProvider'];

	function config($routeProvider, $locationProvider, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist([
        'self'
    ]);
    
    $routeProvider
        .when('/user/login', {
            templateUrl: '/assets/app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'LC'
        }).when('/user/register', {
            templateUrl: '/assets/app/register/register.html',
            controller: 'RegisterController',
            controllerAs: 'RC'
        }).when('/user/logout', {
            templateUrl: '/assets/app/logout/logout.html',
            controller: 'LogoutController',
            controllerAs: 'Logout'
        }).when('/user/profile', {
            templateUrl: '/assets/app/profile/view/view.html',
            controller: 'ProfileViewController',
			controllerAs: 'PVC',
            access: {
                restricted: true
            }
        }).when('/user/update', {
            templateUrl: '/assets/app/profile/update/update.html',
            controller: 'ProfileUpdateController',
			controllerAs: 'PUC',
            access: {
                restricted: true
            }
        }).when('/dashboard', {
            templateUrl: '/assets/app/dashboard/dashboard.html',
            controller: 'DashController',
			controllerAs: 'DC',
            access: {
                restricted: true
            }
        });
        
    $locationProvider.hashPrefix('');

    if (window.history && window.history.pushState) {
        $locationProvider.html5Mode({
            enabled: true
        });
    }		
	}

})(app);