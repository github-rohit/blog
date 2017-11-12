const {POST_STATUS} = require('../../config/config');
const Posts = require('../../models/dbPosts');
const Users = require('../../models/dbUsers');
const ObjectId = require('mongoose').Types.ObjectId; 

module.exports =  function(app) {

	app.post('/api/post/posts', getPosts);
	app.post('/api/post/posts/id', getPost);
	
  	function getPosts (req, res, next) {
		var resObj = {};
		var query = {};

		const {id, status, category = "", tags = "", author, limit = 10, page = 1, post_reference_id} = req.body;
		const skip = page  > 1 ? limit * ( page - 1 ) : 0;
		
		const aQUERY = [{
			$sort: {
				date: -1
			}
		}, {
			$skip : skip
		}, {
			$limit: limit
		}, {
			$lookup: {
				from: "users",
				localField: "created_by",
				foreignField: "_id",
				as: "author"
			}
		}, {
			$project: {
				"title": 1,
				"image": 1,
				"description": 1,
				"category": 1,
				"tags": 1,
				"created_by": 1,
				"status": 1,
				"author.name": 1,
				"date": 1,
				"post_reference_id": 1
			}
		}];

		query.status = POST_STATUS[status] || POST_STATUS.PUBLISH

		if (id) {
			query._id = new ObjectId(id);
		}

		if (post_reference_id) {
			query.post_reference_id = new ObjectId(post_reference_id);
		}

		if (author) {
			query.created_by = new ObjectId(author);
		}
		
		if (category) {
			query.category = category;
		} 
		
		if (tags){
			query.tags = { $elemMatch: {text: tags} };
		}
		
		aQUERY.unshift({
			$match: query
		});
		
		Posts.aggregate(aQUERY, (err, data) => {
			if (err) {
				res.send({
					error: true,
					message: err.errmsg
				});				
			} else {
				getCount(query, (err, counts) => {
					
					res.send({
						success: true,
						list: data,
						totalPosts: counts
					});
				})				
			}
		})		
	}  

	function getPost(req, res, next) {
		req.body.status = "all";
		getPosts(req, res, next);
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