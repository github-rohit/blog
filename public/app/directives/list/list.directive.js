(function(app){
    app.module.directive('postList', postList);

    function postList() {
        return {
            restrict: 'E',
            templateUrl: '/assets/app/directives/list/list.html',
            replace: true,
            scope: {
                posts: '=',
                owner: '@',
                publish: '&'
            }
        }
    }

})(app);