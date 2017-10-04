const Comments = require('../../models/dbComments');

module.exports =  function(app) {

	app.post('/api/comments', comments);
	
  function comments (req, res, next) {
		var resObj = {};

		Comments.find({
			postId: req.body.postId
		} ,function(err, data){
			if(err) {
				res.send({
					error: true,
					message: err.errmsg
				});
			} else {
				res.send({
					success: true,
					list: data
				});
			}					
		});
	}  

};