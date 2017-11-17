(function(app){

	app.module.controller('HomeController', HomeController);
	HomeController.$inject = ['$scope', '$rootScope', '$location','PostService', 'PagerService', "UserUpdateService"]

	function HomeController($scope, $rootScope, $location, PostService, PagerService, UserUpdateService ) {
		var _this = this;
		var queryObj = $location.search();
		var path = window.location.pathname;
		var splitPath = path.split('/');
		var category = splitPath[1];
		var catType = splitPath.pop();
		var page  = queryObj.page;

		this.posts = [];
		this.category = PostService.category;

		$rootScope.navActiveTab = 'home';
		
		$scope.posts = [];

		$scope.$watch('posts', function(){
			PostService.list = $scope.posts;
		});

		if (page && !isNaN(page)) {
			page = parseInt(page);
		} else {
			page = 1
		}

		var query = {
			page: page
		};

		if (category == "author") {
			query[category] = decodeURIComponent(catType.split("-").pop());
		} else if (catType) {
			query[category] = decodeURIComponent(catType);
		}

		if (category == "category") {
			this.catType = catType;
		}

		this.setPage = function (obj) {
			if (obj.page < 1 || obj.page > _this.pager.totalItems) {
				return;
			}

			$location.search({
				page: obj.page
			});

		}

		PostService.getPosts(query, function (res) {
			var data = res.data;

			if (data.success) {
				_this.posts = $scope.posts = data.list;
				_this.pager = PagerService.SetPage(page, data.totalPosts);
			}
			
		});

	}
})(app);