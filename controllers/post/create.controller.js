const {POST_STATUS} = require('../../config/config');
const Posts = require('../../models/dbPosts');
const Categories = require('../../models/dbCategories');
const passport = require('passport');

const ACTION_TYPE = {
	"NEW": "NEW",
	"DRAFT": "DRAFT",
	"PUBLISH": "PUBLISH",
	"SCHEDULE": "SCHEDULE"
}

module.exports =  function(app) {

	app.post('/api/post/create', ensureAuthenticated, create);
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
		req.checkBody('owner', 'required').notEmpty();
		req.checkBody('created_on', 'required').notEmpty();
		
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
		const SAVED_STATUS = data.status;
		const ACTION = data._action;
		const NEW_STATUS = POST_STATUS[ACTION];

		var actionType = "";

		if (!POST_ID || 
			(SAVED_STATUS == POST_STATUS.PUBLISH && (ACTION === ACTION_TYPE.DRAFT || ACTION === ACTION_TYPE.SCHEDULE))) {

			actionType = ACTION_TYPE.NEW;

		} else if (SAVED_STATUS === POST_STATUS.DRAFT && ACTION === ACTION_TYPE.PUBLISH && data.post_reference_id) {
			actionType = ACTION_TYPE.PUBLISH;
		} 

		var postObj = {
			image: data.image,
			description: data.description,
			category: data.category,
			tags: data.tags,
			created_by: data.owner,
			created_on: data.date,
			status: NEW_STATUS,
			schedule_at: data.schedule_at
		};

		switch (actionType) {

			case ACTION_TYPE.NEW:
				postObj.title = data.title;
				postObj.post_reference_id = POST_ID || null;

				console.log("NEW POST CREATED!")

				if (!POST_ID) {
					const newPost = Posts(postObj);
					return newPost.save();
				} else {
					return Posts.findAndUpdateOrSave({
						post_reference_id: POST_ID
					}, postObj);
				}

				break;
			case ACTION_TYPE.PUBLISH:
			
				console.log("UPDATE AND DELETE!");

				postObj.post_reference_id = data.post_reference_id;
				
				return Posts.updatePublishAndDelete(postObj, POST_ID);		
						
				break;	
			default:
				console.log("UPDATE ONLY!");

				return Posts.findOneAndUpdate({
					_id: data._id
				}, {
					$set: postObj
				}, {
					new: true
				});	

				break;
		}

	}).then( post => {
		
		var resObj = {
			success: true,
			message: 'Success'
		};

		if (post && post._id) {
			resObj.post = post;
		}
		
		res.send(resObj);

	}).catch(err => {

		console.log("POST CREATE OR UPDATE ERR " + new Date(), err);

		res.send({
			errors: err
		});
	})
}