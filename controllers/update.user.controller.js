const Users = require('../models/dbUsers');
const passport = require('passport');

module.exports =  function(app) {
	
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.sendStatus(401);
		}
	};

	app.post('/api/user/update', ensureAuthenticated, create);
	//app.post('/api/user/update', create);

  function create (req, res, next) {
		var resObj = {};
		var errors = {};
		var data = req.body;

		var updateUsers = {
			aboutme: data.aboutme,
			country: data.country,
			gender: data.gender,
			website: data.website,
			facebook: data.facebook,
			twitter: data.twitter,
			google_plus: data.google_plus,
			linkedIn: data.linkedIn,
			instagram: data.instagram,
			tumblr: data.tumblr,
			pinterest: data.pinterest
		};
		
		Users.update({_id: data._id}, updateUsers, function(err, user){
			if(err) {
				res.send({
					error: true,
					message: err.errmsg
				});
			} else {
				console.log(user);
				res.send({
					success: true,
					message: 'Success'
				});
			}					
		});

	}  

};