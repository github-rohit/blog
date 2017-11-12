(function(app){

	app.module.controller('DashController', DashController);
	DashController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'PostService', 'PagerService','AuthenticationService'];

	function DashController($scope,$rootScope, $routeParams, $location, PostService, PagerService, AuthenticationService) {	
		var _this =this;
		var type = $routeParams.type;
		this.posts = [];
		this.pager = {};
		this.limit = 10;
		this.currentUser = AuthenticationService.GetUser();
		this.activeTab = type.toUpperCase();
		this.pageNum = parseInt($routeParams.pageNum.toUpperCase());

		$rootScope.navActiveTab = 'dashboard';

		this.setPage = function (obj) {
			if (obj.page < 1 || obj.page > _this.pager.totalItems) {
				return;
			}

			$location.path("/dashboard/" + type + "/" + obj.page);
		}
		
		this.getPosts = function () {
			PostService.getPosts({
				"author": this.currentUser._id,
				"status": _this.activeTab,
				"limit": _this.limit,
				"page": _this.pageNum
			}, function (res) {
				var data = res.data;
				if (data.success) {
					_this.posts = $scope.posts = data.list;
					_this.pager = PagerService.SetPage( _this.pageNum, data.totalPosts, _this.limit);
				}
			});	
		};
		
		$scope.posts = [];
		$scope.$watch('posts', function(){
			PostService.list = $scope.posts;
		});

		this.getPosts();
	}

})(app);