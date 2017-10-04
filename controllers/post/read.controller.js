const Posts = require('../../models/dbPosts');

module.exports =  function(app) {

	app.post('/api/post/posts', getPosts);
	app.post('/api/post/posts/id', getPost);
	
  function getPosts (req, res, next) {
		var resObj = {};
		var query = {};

		const status = req.body.status;
		const category = req.body.category || '';
		const tags = req.body.tags || '';
		const createdBy = req.body.createdBy || '';
		const limit = req.body.limit || 10;
		const page = req.body.page || 1;
		const skip = page  > 1 ? limit * ( page - 1 ) : 0;

		if ((status && status !== 'all') || !status) {
			query.status = status || 'published';
		}

		if (category) {
			query.category = category;
		} else if (tags){
			query.tags = tags;
		} else if (createdBy) {
			query.owner = createdBy;
		}

		Posts.find(query ,function(err, data){
			if(err) {
				res.send({
					error: true,
					message: err.errmsg
				});
			} else {
				getCount(query, function(err, counts){
					res.send({
						success: true,
						list: data,
						totalPosts: counts
					});
				})
			}					
		}).skip(skip).limit(limit);
	}  

	function getPost(req, res, next) {
		var resObj = {};

		const id = req.body.id;

		Posts.findById(id, (err, post) => {
			if(err) {
				res.send({
					error: true,
					message: err.errmsg
				});
			} else {
				res.send({
					success: true,
					list: post
				});
			}		
		});
	}
	// Get count
	function getCount(query, callback) {
		Posts.count(query, (err, counts) => {
			if(err) {
				callback(err);
			} else {
				callback(null, counts);
			}		
		});
	}	
};