(function(app){
    app.module.directive('pageSearch', ["$location", "$timeout", pageSearch]);
    
    function pageSearch($location, $timeout) {
        return {
            restrict: 'E',
            templateUrl: '/assets/app/directives/search/search.html',
            replace: true,
            scope: {
                searchQuery: "@"
            },
            link: function ($scope, $element, $attr) {
                
                $element.on("submit", function() {

                    var query = $scope.searchQuery.trim();

                    if (query) { 
                        $timeout(function () {
                            $location.path ("/search").search({
                                query: query
                            });
                        }, 0);
                    }
                    
                })
            }
        }
    }

})(app);