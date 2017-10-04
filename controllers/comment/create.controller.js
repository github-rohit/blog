const Comments = require('../../models/dbComments');
const passport = require('passport');

module.exports =  function(app) {

	function ensureAuthenticated(req, res, next) {
		console.log(req.session.passport)
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.sendStatus(401);
		}
	};
	
	app.post('/api/comment', ensureAuthenticated, create);
	
  function create (req, res, next) {
		var resObj = {};
		var errors = {};
		var data = req.body;
		
		req.checkBody('postId', 'required').notEmpty();
		req.checkBody('comment', 'required').notEmpty();
		req.checkBody('createdBy', 'required').notEmpty();
		req.checkBody('date', 'required').notEmpty();

		errors = req.validationErrors();

		if (errors) {
			res.send({
				errors: errors
			});
		} else {

			var comment = Comments({
				postId: data.postId,
				comment: data.comment,
				createdBy: data.createdBy,
				date: data.date,
			});
			
			comment.save(function(err){
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

	}  

};