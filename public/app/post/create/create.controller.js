(function(app){
	
	app.module.controller('BlogCreateController', BlogCreateController);
	BlogCreateController.$inject = ['$scope', '$rootScope', '$document', '$window', '$location','PostService', 'FormErrorService', 'AuthenticationService']

	function BlogCreateController($scope, $rootScope, $document, $window, $location, PostService, FormErrorService, AuthenticationService) {
		var _this = this;
		var path = window.location.pathname;
		var patharr = path.split('/');
		var postId = patharr.length > 2 ? path.split('/').pop() : '';

		$rootScope.bodyClass = 'bg-white';

		this.currentUser = AuthenticationService.GetUser();
		this.frm = {
			data: {},
			error: {},
			msg: FormErrorService.messages
		};

		this.category = PostService.category;

		this.tinymceOptions = {
			height: 500,
			theme: 'modern',
			menubar:false,
			branding: false,
			plugins: [
				'advlist autolink lists link image charmap print preview hr anchor pagebreak',
				'searchreplace wordcount visualblocks visualchars code fullscreen',
				'insertdatetime media nonbreaking save table contextmenu directionality',
				'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc help autoresize'
			],
			toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent table | link image, media | forecolor backcolor', 
			image_advtab: true
		};
		
		if (postId) {
			if (PostService.list.length) {
				angular.forEach(PostService.list, function(postObj) {
					if (postObj._id === postId) {
						setAndModifyData(postObj);
					}
				});
			} else {
				PostService.getPostsById({
					id: postId
				}, function (response) {
					var res = response.data;
					if (res.success) {
						setAndModifyData(res.list[0]);
					} else {
						_this.error = true;
					}
				});
			}
		}

		this.submit = function () {
			_this.frm.data.owner = _this.currentUser._id;
			_this.frm.data.date = new Date();

			PostService.create(_this.frm.data, function (res) {
				var data = res.data || {};

				_this.success = false;
				_this.error = false;
				_this.successMsg = ""
				
				if (data.error) {
					_this.error = true;
				} else if (data.errors) {
					_this.frm.error = FormErrorService.show(data.errors);
				} else if (data.success) {
					
					_this.success = true;

					if (data.post) {
						_this.frm.data._id = data.post._id;
						_this.frm.data.status = data.post.status;
					}

					if (_this.frm.data._status == 'draft') {
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
		
		this.resetDraftData = function () {
			_this.isDraft = false;
			_this.frm.data = _this.draftData;
		}

		function setAndModifyData (postObj) {

			if (!postObj) {
				return;
			}

			postObj.tags = getTagArrayFormat(postObj.tags);

			if (!postObj.post_reference_id) {
				PostService.getPosts({
					post_reference_id: postObj._id,
					status: "all"
				}, function (response) {
					var res = response.data;
					if (res.success) {
						if (res.list[0]) {
							_this.isDraft = true;
							_this.draftData = res.list[0];
						}
					} else {
						_this.error = true;
					}
				});				
			}
			
			_this.frm.data = postObj;

		}

		$document.on('scroll', function() {
			
			if ($window.scrollY >= 60) {
				_this.colRightFixed = true;
			} else {
				_this.colRightFixed = false;
			}

			if ($window.scrollY >= $rootScope.tinymceTopPos) {
				_this.colLeftFixed = true;
			} else {
				_this.colLeftFixed = false;
			}
			
			// or pass this to the scope
			$scope.$apply(function() {
				$scope.pixelsScrolled = $window.scrollY;
			})
		});

		function getTagArrayFormat (str) {
			var arr = [];

			if (str && typeof str === "string") {
				
				str.split(',').forEach(function(val) {
					arr.push({
						text: val
					});
				});
			} else {
				arr = str;
			}

			return arr;
		}

	}

})(app);