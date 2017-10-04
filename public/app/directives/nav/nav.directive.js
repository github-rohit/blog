(function(app){

	app.module.directive('navDirective', NavDirective);

	function NavDirective() {
    return {
        restrict: 'E',
        templateUrl: '/assets/app/directives/nav/nav.html',
        replace: true,
    }
	}

})(app);