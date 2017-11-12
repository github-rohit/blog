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
			autoresize_bottom_margin: 0,
			autoresize_min_height: 400,
			content_css: ["/assets/css/bootstrap.min.css", "/assets/css/tinymce.content.css", "//fonts.googleapis.com/css?family=Merriweather|Roboto:300,400,700"],
			plugins: [
				'advlist autolink lists link image charmap print preview hr anchor pagebreak',
				'searchreplace wordcount visualblocks visualchars code fullscreen',
				'insertdatetime media nonbreaking save table contextmenu directionality',
				'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc help autoresize placeholder'
			],
			toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent table | link image, media | forecolor backcolor', 
			image_advtab: true
		};
		
		if (postId) {
			if (PostService.tempList) {
				setAndModifyData (PostService.tempList)
				PostService.tempList = null;
			} else if (PostService.list.length) {
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

		var d = new Date();
		d.setDate(d.getDate() - 1);

		this.mintime = d.getTime();
		
		/*
		ACTIONS
		*/

		this.resetDraftData = function () {
			_this.isDraft = false;
			$location.path('/create/' +PostService.tempList._id);
		}
		
		this.submit = function () {
			_this.frm.data.owner = _this.currentUser._id;
			_this.frm.data.date = new Date();

			if (_this.frm.data.schedule_at) {
				_this.frm.data.schedule_at = new Date(_this.frm.data.schedule_at);
			}

			PostService.create(_this.frm.data, function (res) {
				var data = res.data || {};
				var action = _this.frm.data._action;
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
						_this.frm.data.post_reference_id = data.post.post_reference_id;
						_this.frm.data._id = data.post._id;
						_this.frm.data.status = data.post.status;
					}

					if (action == 'DRAFT') {
						_this.successMsg = 'Post saved successfully';
					} else if (action == 'PUBLISH') {
						_this.successMsg = 'Post published successfully';
						_this.frm.data.status = "PUBLISHED";
						_this.frm.data._id = _this.frm.data.post_reference_id || _this.frm.data._id;
						$location.path("/post/" + _this.frm.data._id).replace();
					} else if (action == 'SCHEDULE') {
						_this.successMsg = 'Post scheduled on';
					}

				}
			});
		};

		/*
		* FUNCTIONS
		*/

		function setAndModifyData (postObj) {

			if (!postObj) {
				return;
			}

			postObj.tags = getTagArrayFormat(postObj.tags);

			if (!postObj.post_reference_id && postObj.status !== "DRAFT") {
				PostService.getPosts({
					post_reference_id: postObj._id,
					status: "DRAFT"
				}, function (response) {
					var res = response.data;
					if (res.success) {
						if (res.list[0]) {
							_this.isDraft = true;
							PostService.tempList = res.list[0];
						}
					} else {
						_this.error = true;
					}
				});				
			}
			
			_this.frm.data = postObj;

		}

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

	}

})(app);