const Users = require('../models/dbUsers');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

module.exports =  function(app) {
	
	app.post('/api/login', login);
	app.post('/api/islogin', ensureAuthenticated, islogin);
	app.post('/api/logout', logout);
	
	Users.validPassword = function(pwd, hash, callback){
		bcrypt.compare(pwd, hash, function(err, isMatch){
			if (err) {
				callback(err);
			} else {
				callback(err, isMatch);
			}
		});
	};

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		Users.findById(id, function(err, user){
				done(err, user);
		});
	});
    
	passport.use(new LocalStrategy( {
		usernameField: 'uname',
		passwordField: 'passwd'
	}, function(uname, passwd, done){
		Users.findOne({ uname: uname }, function(err, user) {
			if (err) { 
				return done(err); 
			}
	    if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        Users.validPassword(passwd, user.passwd, function(err, isMatch){
				if (err) {
					return done(err)
				}
				if(isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Incorrect Password.' });
				}
			});
		});
	}));

	function login(req, res, next) {
		passport.authenticate('local', function(err, user) {
			if (err) {
					return next(err); // will generate a 500 error
			}
			
			// Generate a JSON response reflecting authentication status
			if (! user) {
				return res.send({ 
					success : false, 
					message : 'authentication failed' 
				});
			}
			return req.login(user, function(err) {
				if (err) {
					return res.sendStatus(500);
				}
				return res.send({ 
					success : true, 
					user: {
						_id: user._id,
						uname: user.uname,
						name: user.name,
						email: user.email,
						gender: user.gender,
						avatar: user.avatar,
						aboutme: user.aboutme,
						country: user.country,
						website: user.website,
						facebook: user.facebook,
						twitter: user.twitter,
						google_plus: user.google_plus,
						linkedIn: user.linkedIn,
						instagram: user.instagram,
						tumblr: user.tumblr,
						pinterest: user.pinterest,
					},
					message : 'authentication succeeded' 
				}); 
			});           
		})(req, res, next);
	}
	
  function islogin (req, res, next) {
		res.send({
				success: true
		});
	}  
	
  function logout (req, res, next) {
		req.logout();
		res.send({
				success: true
		});
	}  

	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.sendStatus(401);
		}
	};
};