(function(app){
    app.module.directive('expandingTextarea', function () {
        return {
            restrict: 'A',
            controller: function ($scope, $rootScope, $element, $attrs, $timeout) {
                $element.css('min-height', '0');
                $element.css('overflow-y', 'hidden');
                setHeight(0);
                $timeout(setHeightToScrollHeight);
    
                function setHeight(height) {
                    $element.css('height', height + 'px');
                    $element.css('max-height', height + 'px');
                }
    
                function setHeightToScrollHeight() {
                    setHeight(0);
                    var elem = angular.element($element);
                    var scrollHeight = elem[0].scrollHeight;
                    if (scrollHeight !== undefined) {
                        setHeight(scrollHeight);
                        $rootScope.tinymceTopPos = elem.prop('offsetTop') + scrollHeight;
                    }
                }

                $scope.$watch(function () {
                    return angular.element($element)[0].value;
                }, setHeightToScrollHeight);
            }
        };
    });

    app.module.directive('setFocus', [function ($timeout, $parse) {
        return {
            link: function (scope, element, attrs) {
                element[0].focus();
            }
        };
    }]);
    
    app.module.directive('disableEnterKey', [function () {
        return {
            controller: function ($scope, $element) {
                $element.on( 'keypress' , function (e){
                    $scope.$apply(function () {
                      if (e.keyCode === 13)
                      e.preventDefault();
                    });
                });
            }
        };
    }]);
    
})(app);

