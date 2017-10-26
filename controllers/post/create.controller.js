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

	app.post('/api/create', ensureAuthenticated, create);
	
  function create (req, res, next) {
		var resObj = {};
		var errors = {};
		var data = req.body;
		
		req.checkBody('title', 'required').notEmpty();
		req.checkBody('short_description', 'required').notEmpty();
		req.checkBody('image', 'required').notEmpty();
		req.checkBody('description', 'required').notEmpty();
		req.checkBody('category', 'required').notEmpty();
		req.checkBody('tags', 'required').notEmpty();
		req.checkBody('owner', 'required').notEmpty();
		req.checkBody('date', 'required').notEmpty();
		req.checkBody('status', 'required').notEmpty();

		errors = req.validationErrors();
		const categories = Categories({
			categorie: "Technology",
			count: 0
		})
		categories.save((err) => {
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
		return;
		if (errors) {
			res.send({
				errors: errors
			});
		} else {
			const postObj = {
				title: data.title,
				short_description: data.short_description,
				image: data.image,
				description: data.description,
				category: data.category,
				tags: data.tags,
				created_by: data.owner,
				date: data.date,
				status: data.status
			};

			if (data.action === 'update') {
				Posts.update({_id: data._id}, postObj, (err, user) => {
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
			} else {
				const newPost = Posts(postObj);
				newPost.save((err) => {
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

	}  

};