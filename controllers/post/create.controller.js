const Config = require('../../config/config');
const Posts = require('../../models/dbPosts');
const Categories = require('../../models/dbCategories');
const passport = require('passport');

const STATUS_DRAFT = Config.postStatus.draft;
const STATUS_PUB = Config.postStatus.published;

module.exports =  function(app) {

	app.post('/api/post/create', create);
	app.post('/api/post/update', ensureAuthenticated, create);
	//app.post('/api/post/publish', ensureAuthenticated, publish);

};

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.sendStatus(401);
	}
}

function validateData (req) {
	return new Promise((resolve, reject) => {
		if (!req.body._id) {
			req.checkBody('title', 'required').notEmpty();
		}
		
		req.checkBody('description', 'required').notEmpty();
		req.checkBody('category', 'required').notEmpty();
		req.checkBody('owner', 'required').notEmpty();
		req.checkBody('date', 'required').notEmpty();
		
		const errors = req.validationErrors();
		
		if (errors) {
			console.log("Validation error!")
			reject(errors);
		} else {
			resolve();
		}	
	})
}

function create (req, res, next) { 
	const data = req.body;
	
	validateData(req).then(() => {
		const POST_ID = data._id;
		const SAVED_STATUS = Config.postStatus[data.status];
		const NEW_STATUS = Config.postStatus[data._status];

		var postObj = {
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

			const newPost = Posts(postObj);

			console.log("NEW POST CREATED!")

			return newPost.save();

		} else if (data.post_reference_id && NEW_STATUS === STATUS_PUB) {
			postObj.post_reference_id = data.post_reference_id;

			console.log("UPDATE!")
			
			return Posts.updatePublishAndDelete(postObj, POST_ID);
		} else { 
			console.log("UPDATE ONLY!")
			return Posts.update({
				_id: data._id
			}, postObj);			
		}
	}).then( post => {

		var resObj = {
			success: true,
			message: 'Success'
		};

		if (post._id) {
			resObj.post = post;
		}
		
		res.send(resObj);

	}).catch(err => {

		console.log("POST CREATE OR UPDATE ERR");

		res.send({
			errors: err
		});
	})
}