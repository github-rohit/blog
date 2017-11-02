const Comments = require('../../models/dbComments');

module.exports =  function(app) {

	app.post('/api/comments', comments);
	
  	function comments (req, res, next) {

		const postId = req.body.postId
		const page = req.body.page || 1;
		const skip = page  > 1 ? limit * ( page - 1 ) : 0;

		const aQUERY = [{
			$limit: req.body.limit || 10
		}, {
			$match: {
				postId: postId
			}
		}, {
			$lookup: {
				from: "users",
				localField: "created_by",
				foreignField: "_id",
				as: "author"
			}
		}, {
			$project: {
				"created_by": 1,
				"postId": 1,
				"comment": 1,				
				"author.name": 1,
				"date": 1
			}
		}];

		const oMATCH = {
			$match: {
				postId: postId
			}
		};

		Comments.aggregate(aQUERY, (err, data) => {
			if (err) {
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