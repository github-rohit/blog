(function(app){

	app.module.controller('HomeController', HomeController);
	HomeController.$inject = ['$scope', 'PostService', 'PagerService']

	function HomeController($scope, PostService, PagerService) {
		const self = this;
		const path = window.location.pathname;
		const splitPath = path.split('/');
		const category = splitPath[1];
		const catType = splitPath.pop();
		this.posts = [];
		
		$scope.posts = [];

		$scope.$watch('posts', function(){
			PostService.list = $scope.posts;
		});

		var query = {};

		if (catType) {
			query[category] = decodeURIComponent(catType);
		}
		
		this.setPage = (obj)=> {
			if (obj.page < 1 || obj.page > this.pager.totalItems) {
				return;
			}
			this.getPosts(obj.page);
		}

		this.getPosts = (page) => {
			query.page = page || 1;
			
			PostService.getPosts(query, function (res) {
				const data = res.data;
	
				if (data.success) {
					self.posts = $scope.posts = data.list;
					self.pager = PagerService.SetPage(page, data.totalPosts);
				}
				
			});
		}

		this.getPosts(1);

	}

})(app);