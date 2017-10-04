(function(app){
    app.module.directive('pagination', pagination);

    function pagination() {
        return {
            restrict: 'E',
            templateUrl: '/assets/app/directives/pagination/pagination.html',
            replace: true,
            scope: {
                pager: '=',
                setPage: '&'
            }
        }
    }

})(app);