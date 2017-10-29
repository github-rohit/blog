(function(app){

	app.module.controller('DashController', DashController);
	DashController.$inject = ['$scope', 'PostService', 'PagerService','AuthenticationService'];

	function DashController($scope, PostService, PagerService, AuthenticationService) {	
		var _this =this;

		this.posts = [];
		this.pager = {};
		this.limit = 10;
		this.currentUser = AuthenticationService.GetUser();
		this.activeTab = "published";

		this.publish = function (obj) {
			PostService.update({
				_id: obj.id,
				status: 'publish'
			}, function (res) {
				if (res.data.error) {
					_this.error = true;
				} else if (res.data.success) {
					_this.success = true;
					_this.posts[obj.index].status = 'published';
				}
			})
		}

		this.setPage = function (obj) {
			if (obj.page < 1 || obj.page > _this.pager.totalItems) {
				return;
			}
			_this.getPosts(obj.page);
		}
		
		this.getPosts = function (page, status) {
			PostService.getPosts({
				"author": this.currentUser._id,
				"status": status || '',
				"limit": _this.limit,
				"page": page || 1
			}, function (res) {
				var data = res.data;
				if (data.success) {
					_this.posts = $scope.posts = data.list;
					_this.pager = PagerService.SetPage(page, data.totalPosts, _this.limit);
					_this.activeTab = status || 'all';
				}
			});	
		};
		
		$scope.posts = [];
		$scope.$watch('posts', function(){
			PostService.list = $scope.posts;
		});

		this.getPosts(1, "published");
	}

})(app);