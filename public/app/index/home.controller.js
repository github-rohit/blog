(function(app){

	app.module.controller('HomeController', HomeController);
	HomeController.$inject = ['$scope', '$rootScope', 'PostService', 'PagerService', "UserUpdateService"]

	function HomeController($scope, $rootScope, PostService, PagerService, UserUpdateService ) {
		const _this = this;
		const path = window.location.pathname;
		const splitPath = path.split('/');
		const category = splitPath[1];
		const catType = splitPath.pop();
		this.posts = [];

		$rootScope.navActiveTab = 'home';
		
		$scope.posts = [];

		$scope.$watch('posts', function(){
			PostService.list = $scope.posts;
		});

		var query = {};
		if (category == "author") {
			query[category] = decodeURIComponent(catType.split("-").pop());
		} else if (catType) {
			query[category] = decodeURIComponent(catType);
		}
		
		this.setPage = function (obj) {
			if (obj.page < 1 || obj.page > _this.pager.totalItems) {
				return;
			}

			_this.getPosts(obj.page);
		}

		this.getPosts = function (page) {
			query.page = page || 1;
			
			PostService.getPosts(query, function (res) {
				const data = res.data;
	
				if (data.success) {
					_this.posts = $scope.posts = data.list;
					_this.pager = PagerService.SetPage(page, data.totalPosts);
				}
				
			});
		}

		this.getPosts(1);
	}
})(app);