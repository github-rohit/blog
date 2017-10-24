(function(app){
	
	app.module.controller('BlogReadController', BlogReadController);
	BlogReadController.$inject = ['$scope', '$rootScope', 'PostService', 'FormErrorService', 'AuthenticationService']

	function BlogReadController($scope, $rootScope, PostService, FormErrorService, AuthenticationService) {

		var path = window.location.pathname;
		var postId = path.split('/').pop();

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
				createdBy: 'rohit',
				postId: postId
			};
			
			PostService.saveComment(newComment, response => {
				var res = response.data;

				if (res.success) {
					getComments.call(this);
					this.frm.comment = '';
				} else if (res.errors){
					this.frm.errors = FormErrorService.show(res.errors);
				}

			});			
		};
		
		if (PostService.list.length) {
			angular.forEach(PostService.list, postObj => {
				if (postObj._id === postId) {
					this.post = postObj;
				}
			});
		} else {
			PostService.getPostsById({
				id: postId
			}, (response) => {
				var res = response.data;
				if (res.success) {
					this.post = res.list[0];
				} else {

				}
					
			});
		}

		function getComments () {
			PostService.getComments({
				postId: postId
			},response => {
				var res = response.data;

				if (res.success) {
					this.comments.list = res.list;
				} else if (res.error) {
					this.comments.error = true;
				}

			});
		};

		getComments.call(this);

	}

})(app);