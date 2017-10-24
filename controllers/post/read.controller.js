const Posts = require('../../models/dbPosts');
const Users = require('../../models/dbUsers');
const ObjectId = require('mongoose').Types.ObjectId; 

module.exports =  function(app) {

	app.post('/api/post/posts', getPosts);
	app.post('/api/post/posts/id', getPost);
	
  	function getPosts (req, res, next) {
		var resObj = {};
		var query = {};

		const status = req.body.status;
		const category = req.body.category || '';
		const tags = req.body.tags || '';
		const author = req.body.author || '';
		
		const page = req.body.page || 1;
		const skip = page  > 1 ? limit * ( page - 1 ) : 0;
		
		const aQUERY = [{
			$limit: req.body.limit || 10
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
				"short_description": 1,
				"image": 1,
				"description": 1,
				"category": 1,
				"tags": 1,
				"created_by": 1,
				"status": 1,
				"author.name": 1,
				"date": 1
			}
		}];

		const oMATCH = {
			$match: null
		};

		if (skip) {
			aQUERY.push({
				$skip : skip
			});
		}

		if (author && status) {
			oMATCH.$match = {
				created_by: new ObjectId(author),
				status: status
			};

		} else if (category) {
			oMATCH.$match = {
				category: category
			};
		} else if (tags){
			oMATCH.$match = {
				tags: tags
			};
		} else if (author) {
			oMATCH.$match = {
				created_by: new ObjectId(author)
			};
		} else if (status) {
			oMATCH.$match = {
				status: status
			}
		}
		
		if (oMATCH.$match) {
			aQUERY.push(oMATCH);
		}

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