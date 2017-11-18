(function(app){
    app.module.directive('dropdown', ["$document", dropdown]);
    
    function dropdown($document) {
        return {
            restrict: 'E',
            require: '?ngModel',
            templateUrl: '/assets/app/directives/dropdown/dropdown.html',
            replace: true,
            scope: {
                items: "=",
                value: "@"
            },
            link: function ($scope, $element, $attr, ngModel) {
                var marker = "marker-current"

                if (!ngModel) {
                    
                } else {
                    
                }

                $element.on("click", function($event) {
                    $element.toggleClass("open " + marker)
                });

                $document.on("click", function ($event) {
                    if ($element.hasClass(marker)) {
                        $element.removeClass(marker);
                    } else {
                        $element.removeClass("open");
                    }
                })
                
                $element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }
        }
    }

})(app);