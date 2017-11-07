const Config = require('../../config/config');
const Posts = require('../../models/dbPosts');
const Categories = require('../../models/dbCategories');
const passport = require('passport');

module.exports =  function(app) {
	
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.sendStatus(401);
		}
	};

	app.post('/api/post/create', ensureAuthenticated, create);
	app.post('/api/post/update', ensureAuthenticated, create);
	app.post('/api/post/publish', ensureAuthenticated, publish);

	Posts.savePost = function (postObj) {
		const newPost = Posts(postObj);
		return new Promise((resolve, reject) => {
			newPost.save((err, post) => {
				if(err) {
					reject(err);
				} else {
					resolve(post);
				}					
			});
			
		});		
	};
	
	Posts.updatePost = function (query, data) {
		return new Promise((resolve, reject) => {
			Posts.update(query, data, (err, post) => {
				if (err) {
					reject(err);
				} else {
					resolve(post);
				}
			});
		});
	};
	
  	function create (req, res, next) {
		var resObj = {};
		var errors = {};
		var data = req.body;
		
		if (!data._id) {
			req.checkBody('title', 'required').notEmpty();
		}
		
		req.checkBody('description', 'required').notEmpty();
		req.checkBody('category', 'required').notEmpty();
		req.checkBody('owner', 'required').notEmpty();
		req.checkBody('date', 'required').notEmpty();

		errors = req.validationErrors();

		if (errors) {
			res.send({
				errors: errors
			});
		} else {
			const POST_ID = data._id;
			const SAVED_STATUS = Config.postStatus[data.status];
			const NEW_STATUS = Config.postStatus[data._status];
			const STATUS_DRAFT = Config.postStatus.draft;
			const STATUS_PUB = Config.postStatus.published;

			var postObj = {
				short_description: data.short_description,
				image: data.image,
				description: data.description,
				category: data.category,
				tags: data.tags,
				created_by: data.owner,
				date: data.date,
				status: NEW_STATUS
			};

			if (!POST_ID || (SAVED_STATUS === STATUS_PUB && NEW_STATUS === STATUS_DRAFT)) {	
				postObj.title = data.title;
				postObj.post_reference_id = POST_ID || null;

				Posts.savePost(postObj).then( post => {
					res.send({
						success: true,
						message: 'Success',
						post: post
					});

				}).catch(err => {
	
					console.error("Create post: ", err);
					
					res.send({
						error: true,
						message: err.errmsg
					});			
				});	
			} else {
				const query = {
					_id: data._id
				};

				if (data.post_reference_id && NEW_STATUS === STATUS_PUB) {
					Posts.update({
						_id: data.post_reference_id
					}, {
						status: Config.postStatus.deleted,
						post_reference_id: data._id
					}).then(() => {
						update (req, res, next, query, postObj);
					}).catch(err => {
						console.log("Delete post: ", err);
						res.send({
							error: true,
							message: err.errmsg
						});
					});
				} else {
					update (req, res, next, query, postObj)
				}
			}

		}

	}  

	function update (req, res, next, query, updateObj) {
		updateObj.post_reference_id = null;
		Posts.updatePost(query, updateObj).then( post => {
			res.send({
				success: true,
				message: 'Success',
				post: post
			});
		}).catch( err => {

			console.error("Update post: ", err);

			res.send({
				error: true,
				message: err.errmsg
			});
		});	
	}

	function publish (req, res, next) {
		res.send({
			success: true,
			message: 'Success'
		});		
	}
};