const Posts = require('../../models/dbPosts');
const passport = require('passport');

module.exports =  function(app) {
	
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.sendStatus(401);
		}
	};

	app.post('/api/post/update', ensureAuthenticated, update);
	
  function update (req, res, next) {
		var resObj = {};
		var errors = {};
		var data = req.body;
		var updatePost = {};

		if (data.status === 'publish') {
			updatePost = {
				status: 'published'
			}
		} else {
			updatePost = {}
		}
			
		Posts.update({_id: data._id}, updatePost, function(err, user){
			if(err) {
				res.send({
					error: true,
					message: err.errmsg
				});
			} else {
				res.send({
					success: true,
					message: 'Success'
				});
			}					
		});
	}  

};