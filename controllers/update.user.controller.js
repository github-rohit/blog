const Users = require('../models/dbUsers');
const passport = require('passport');
const multer = require('multer');
const UPLOAD_PATH = "public/uploads/";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, UPLOAD_PATH)
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	}
});
const Upload = multer({ storage: storage }).single('avatar');

module.exports =  function(app) {
	
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.sendStatus(401);
		}
	};

	app.post('/api/user/update', ensureAuthenticated, create);
	app.post('/api/user/upload', ensureAuthenticated, uploadImage);

  	function create (req, res, next) {
		var resObj = {};
		var errors = {};
		var data = req.body;

		var updateUsers = {
			aboutme: data.aboutme,
			country: data.country,
			gender: data.gender,
			website: data.website,
			facebook: data.facebook,
			twitter: data.twitter,
			google_plus: data.google_plus,
			linkedIn: data.linkedIn,
			instagram: data.instagram,
			tumblr: data.tumblr,
			pinterest: data.pinterest
		};
		
		Users.update({_id: data._id}, updateUsers, function(err, user){
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

	function uploadImage (req, res) {
		Upload(req, res, function(err) {
			if (err) {
				console.log("file upload error: ", err)
				res.send({
					error: true
				})
			} else {
				updateImage(req, res);
			}
		});
	}

	function updateImage (req, res) {
		Users.update({
			_id: req.body.id
		}, {
			avatar: req.file.filename
		}, function(err, user){
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

};