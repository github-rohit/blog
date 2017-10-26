(function(app){
	
	app.module.controller('BlogReadController', BlogReadController);
	BlogReadController.$inject = ['$scope', '$rootScope', 'PostService', 'FormErrorService', 'AuthenticationService']

	function BlogReadController($scope, $rootScope, PostService, FormErrorService, AuthenticationService) {
		var _this = this;
		var path = window.location.pathname;
		var postId = path.split('/').pop();

		this.currentUser = AuthenticationService.GetUser();
		this.isLogin = AuthenticationService.isLogin;
		this.category = PostService.category;
		this.tags = PostService.tags;
		this.frm = {
			msg: FormErrorService.messages
		};
		this.comments = {};

		this.submit = function() {
			var newComment = {
				comment: this.frm.comment,
				date: new Date(),
				created_by: _this.currentUser._id,
				postId: postId
			};
			
			PostService.saveComment(newComment, function (response) {
				var res = response.data;

				if (res.success) {
					getComments.call(_this);
					_this.frm.comment = '';
				} else if (res.errors){
					_this.frm.errors = FormErrorService.show(res.errors);
				}

			});			
		};
		
		if (PostService.list.length) {
			angular.forEach(PostService.list, function (postObj) {
				if (postObj._id === postId) {
					_this.post = postObj;
				}
			});
		} else {
			PostService.getPostsById({
				id: postId
			}, function (response) {
				var res = response.data;
				if (res.success) {
					_this.post = res.list[0];
				} else {

				}
					
			});
		}

		function getComments () {
			PostService.getComments({
				postId: postId
			}, function (response) {
				var res = response.data;

				if (res.success) {
					_this.comments.list = res.list;
				} else if (res.error) {
					_this.comments.error = true;
				}

			});
		};

		getComments.call(this);

	}

})(app);