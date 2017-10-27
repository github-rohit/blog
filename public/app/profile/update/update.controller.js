(function(app){

	app.module.controller('ProfileUpdateController', ProfileUpdateController);
	ProfileUpdateController.$inject = ['$scope' ,'$rootScope', 'UserUpdateService', 'AuthenticationService'];

	function ProfileUpdateController($scope, $rootScope, UserUpdateService, AuthenticationService) {
		var _this = this;
		var currentUser = $rootScope.globals.currentUser;
	
		this.formData = {
			_id: currentUser._id,
			avatar: currentUser.avatar,
			aboutme: currentUser.aboutme,
			country: currentUser.country,
			gender: currentUser.gender,
			website: currentUser.website,
			facebook: currentUser.facebook,
			twitter: currentUser.twitter,
			google_plus: currentUser.google_plus,
			linkedIn: currentUser.linkedIn,
			instagram: currentUser.instagram,
			tumblr: currentUser.tumblr,
			pinterest: currentUser.pinterest,
			name: currentUser.name,
			email: currentUser.email
		};

		this.success = false;
		
		this.submit =  function () {
			UserUpdateService.update(_this.formData, function (res) {
				if (res.data.error) {
					_this.error = true;
				} else if (res.data.success) {
					var formData = _this.formData;
					AuthenticationService.SetCredentials({	
						avatar: formData.avatar,				
						aboutme: formData.aboutme,
						country: formData.country,
						gender: formData.gender,
						website: formData.website,
						facebook: formData.facebook,
						twitter: formData.twitter,
						google_plus: formData.google_plus,
						linkedIn: formData.linkedIn,
						instagram: formData.instagram,
						tumblr: formData.tumblr,
						pinterest: formData.pinterest
					}, true);
					_this.success = true;
				}
			});
		}
		
		new qq.FineUploader({
			element: document.getElementById('fine-uploader'),
			request: {
				endpoint: '/api/user/upload',
				inputName: "avatar",
				params: {
					id: currentUser._id
				}
			},
			deleteFile: {
				enabled: true,
				endpoint: '/api/user/upload'
			},
			validation: {
				allowedExtensions: ['png', 'jpg', 'jpge', 'gif']
			},
			callbacks: {
				onComplete: function (id, name, responseObj, xhr) {
					_this.formData.avatar = responseObj.filename;
					
					AuthenticationService.SetCredentials({
						avatar: _this.formData.avatar
					}, true);

					$scope.$apply();
				}
			}
		});
	}

})(app);