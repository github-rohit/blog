(function(app){
	
	app.module.controller('BlogCreateController', BlogCreateController);
	BlogCreateController.$inject = ['$scope', '$rootScope', 'PostService', 'FormErrorService', 'AuthenticationService']

	function BlogCreateController($scope, $rootScope, PostService, FormErrorService, AuthenticationService) {
		var _this = this;
		var path = window.location.pathname;
		var patharr = path.split('/');
		var postId = patharr.length > 2 ? path.split('/').pop() : '';

		this.currentUser = AuthenticationService.GetUser();
		this.frm = {
			data: {},
			error: {},
			msg: FormErrorService.messages,
			action: 'new'
		};

		this.category = PostService.category;

		this.tinymceOptions = {
			height: 500,
			theme: 'modern',
			plugins: [
				'advlist autolink lists link image charmap print preview hr anchor pagebreak',
				'searchreplace wordcount visualblocks visualchars code fullscreen',
				'insertdatetime media nonbreaking save table contextmenu directionality',
				'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc help'
			],
			toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
			toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
			image_advtab: true
		};
		
		if (postId) {
			this.frm.action = 'update';

			if (PostService.list.length) {
				angular.forEach(PostService.list, function(postObj) {
					if (postObj._id === postId) {
						_this.frm.data = postObj;
					}
				});
			} else {
				PostService.getPostsById({
					id: postId
				}, function (response) {
					var res = response.data;
					if (res.success) {
						_this.frm.data = res.list;
					} else {
						_this.error = true;
					}
				});
			}
		}

		this.submit = function () {
			_this.frm.data.owner = _this.currentUser._id;
			_this.frm.data.date = new Date();
			_this.frm.data.action = _this.frm.action;
			
			PostService.create(_this.frm.data, function (res) {
				var data = res.data || {};
				_this.success = false;
				
				if (data.errors) {
					_this.frm.error = FormErrorService.show(data.errors);
				} else if (data.success) {
					_this.success = true;
					if (_this.frm.data.status == 'save') {
						_this.successMsg = 'Post saved successfully';
					} else {
						_this.successMsg = 'Post published successfully';
					}

					if (!postId) {
						_this.frm.data = {};
					}
				}
			});
		};
	}

})(app);