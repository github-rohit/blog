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
            controllerAs: 'LC',
            access: {
                restricted: false
            }
        }).when('/user/register', {
            templateUrl: '/assets/app/register/register.html',
            controller: 'RegisterController',
            controllerAs: 'RC',
            access: {
                restricted: false
            }
        }).when('/user/registerverification/:id', {
            templateUrl: '/assets/app/register/emailVerification.html',
            controller: 'EmailVerification',
            controllerAs: 'EmailV',
            access: {
                restricted: false
            }
        }).when('/user/forgotpassword', {
            templateUrl: '/assets/app/register/forgotpassword.html',
            controller: 'ForgotPassword',
            controllerAs: 'FP',
            access: {
                restricted: false
            }
        }).when('/user/resetpassword/:id', {
            templateUrl: '/assets/app/register/resetpassword.html',
            controller: 'ResetPassword',
            controllerAs: 'RP',
            access: {
                restricted: false
            }
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
        });
        
    $locationProvider.hashPrefix('');

    if (window.history && window.history.pushState) {
        $locationProvider.html5Mode({
            enabled: true
        });
    }		
	}

})(app);