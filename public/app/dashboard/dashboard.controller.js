(function(app){

	app.module.controller('DashController', DashController);
	DashController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'PostService', 'PagerService','AuthenticationService'];

	function DashController($scope,$rootScope, $routeParams, $location, PostService, PagerService, AuthenticationService) {	
		var _this =this;
		var type = $routeParams.type;
		var queryObj = $location.search();
		var page = queryObj.page;

		this.posts = [];
		this.pager = {};
		this.limit = 10;
		this.currentUser = AuthenticationService.GetUser();
		this.activeTab = type.toUpperCase();

		$rootScope.navActiveTab = 'dashboard';

		if (page && !isNaN(page)) {
			page = parseInt(page);
		} else {
			page = 1
		}		

		this.setPage = function (obj) {
			if (obj.page < 1 || obj.page > _this.pager.totalItems) {
				return;
			}

			$location.search({
				page: obj.page
			});
		}
		
		$scope.posts = [];
		$scope.$watch('posts', function(){
			PostService.list = $scope.posts;
		});			
		
		PostService.getPosts({
			"author": this.currentUser._id,
			"status": _this.activeTab,
			"limit": _this.limit,
			"page": page
		}, function (res) {
			var data = res.data;
			if (data.success) {
				_this.posts = $scope.posts = data.list;
				_this.pager = PagerService.SetPage( page, data.totalPosts, _this.limit);
			}
		});	

	}

})(app);