(function(app){
	
	app.module.controller('BlogCreateController', BlogCreateController);
	BlogCreateController.$inject = ['PostService', 'FormErrorService', 'AuthenticationService']

	function BlogCreateController(PostService, FormErrorService, AuthenticationService) {
		const path = window.location.pathname;
		const patharr = path.split('/');
		const postId = patharr.length > 2 ? path.split('/').pop() : '';

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
				angular.forEach(PostService.list, postObj => {
					if (postObj._id === postId) {
						this.frm.data = postObj;
					}
				});
			} else {
				PostService.getPostsById({
					id: postId
				}, (response) => {
					var res = response.data;
					if (res.success) {
						this.frm.data = res.list;
					} else {
						this.error = true;
					}
				});
			}
		}

		this.submit = () => {
			this.frm.data.owner = this.currentUser.name;
			this.frm.data.date = new Date();
			this.frm.data.action = this.frm.action;

			PostService.create(this.frm.data, (res) => {
				const data = res.data || {};
				this.success = false;
				
				if (data.errors) {
					this.frm.error = FormErrorService.show(data.errors);
				} else if (data.success) {
					this.success = true;
					if (this.frm.data.status == 'save') {
						this.successMsg = 'Post saved successfully';
					} else {
						this.successMsg = 'Post published successfully';
					}
					
				}
			});
		};
	}

})(app);