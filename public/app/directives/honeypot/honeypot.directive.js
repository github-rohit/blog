(function(app){
    app.module.directive('honeypot', ["$parse", honeypot]);
    
    function honeypot($parse) {
        return {
            restrict: 'E',
            require: 'ngModel',
            templateUrl: '/assets/app/directives/honeypot/honeypot.html',
            replace: true,
            scope: {},
            link: function ($scope, $element, $attr, ngModel) {

                $scope.$watch("honey", function(newval) {
                    ngModel.$setViewValue(newval);
                    ngModel.$render();
                });
                
            }
        }
    }

})(app);