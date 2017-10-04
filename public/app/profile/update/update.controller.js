(function(app){

	app.module.controller('ProfileUpdateController', ProfileUpdateController);
	ProfileUpdateController.$inject = ['$rootScope', 'UserUpdateService', 'AuthenticationService'];

	function ProfileUpdateController($rootScope, UserUpdateService, AuthenticationService) {
		var currentUser = $rootScope.globals.currentUser;
		this.formData = {
			_id: currentUser._id,
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
		
		this.submit =  () => {
			UserUpdateService.update(this.formData, (res) => {
				if (res.data.error) {
					this.error = true;
				} else if (res.data.success) {
					var formData = this.formData;
					AuthenticationService.SetCredentials({					
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
					this.success = true;
				}
			});
		}
	}

})(app);