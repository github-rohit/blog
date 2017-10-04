(function(app){

	app.module.controller('DashController', DashController);
	DashController.$inject = ['$scope', 'PostService', 'PagerService','AuthenticationService'];

	function DashController($scope, PostService, PagerService, AuthenticationService) {	
		this.posts = [];
		this.pager = {};
		this.limit = 10;
		this.currentUser = AuthenticationService.GetUser();

		this.publish = function (obj) {
			PostService.update({
				_id: obj.id,
				status: 'publish'
			}, res => {
				if (res.data.error) {
					this.error = true;
				} else if (res.data.success) {
					this.success = true;
					this.posts[obj.index].status = 'published';
				}
			})
		}

		this.setPage = (obj)=> {
			if (obj.page < 1 || obj.page > this.pager.totalItems) {
				return;
			}
			this.getPosts(obj.page);
		}
		

		this.getPosts = (page, status) => {
			PostService.getPosts({
				"createdBy": this.currentUser.name,
				"status": status || 'all',
				"limit": this.limit,
				"page": page || 1
			}, res => {
				const data = res.data;
				if (data.success) {
					this.posts = $scope.posts = data.list;
					this.pager = PagerService.SetPage(page, data.totalPosts, this.limit);
					this.activeTab = status || 'all';
				}
			});	
		};
		
		$scope.posts = [];
		$scope.$watch('posts', function(){
			PostService.list = $scope.posts;
		});

		this.getPosts(1);
	}

})(app);