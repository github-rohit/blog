(function(app){

	app.module.controller('SearchController', SearchController);
	SearchController.$inject = ['$scope', '$rootScope', '$location' ,'PostService', 'PagerService', "UserUpdateService"]

	function SearchController($scope, $rootScope, $location, PostService, PagerService, UserUpdateService ) {
		var _this = this;
		var queryObj = $location.search();
		var page = 0;

		if (angular.equals({}, queryObj) || !queryObj.query) {
			$location.path("/");
		} else {
			this.searchQuery = queryObj.query;
			page = queryObj.page
		}

		if (page && !isNaN(page)) {
			queryObj.page = parseInt(page);
		} else {
			queryObj.page = 1
		}

		this.posts = [];
		this.category = PostService.category;

		$rootScope.navActiveTab = 'home';
		
		$scope.posts = [];

		$scope.$watch('posts', function(){
			PostService.list = $scope.posts;
		});
		
		this.setPage = function (obj) {
			if (obj.page < 1 || obj.page > _this.pager.totalItems) {
				return;
			}

			$location.search({
				query: this.searchQuery,
				page: obj.page
			});
		}

		PostService.getSearchQueryResults(queryObj, function (res) {
			const data = res.data;

			if (data.success) {
				_this.posts = $scope.posts = data.list;
				_this.pager = PagerService.SetPage(queryObj.page, data.totalPosts);
			}
			
		});

	}
})(app);