

// INCLUED
const Config = require('../config/config');
const Users = require('../models/dbUsers');
const ResetPassword = require('../models/dbResetPassword');
const Ejs = require('ejs');
const BodyParser = require('body-parser');
const Bcrypt = require('bcrypt');
const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Sendmail = require('sendmail')();
const Cryptr = require('cryptr');

//CONTANT VALUE
const STATUS_PENDING = Config.status.pending;
const STATUS_ACTIVE = Config.status.active;
const registerverification = "registerverification";

module.exports =  (app) => {

    app.post('/api/register', register);
    app.post('/api/resendemail', resendVerificationEmail);
    app.post('/api/' + registerverification, verification);
    app.post('/api/forgotpassword', forgotPassword);
	app.post('/api/resetpassword', resetPassword);
	
	const cryptr = new Cryptr('CryptrSecretKey');

	/**
	 * DATABASE ACTIONS
	 */
	

    Users.getUserById = function(id, callback) {
		return new Promise((resolve, reject) => {
			Users.findOne({ 
				_id: id
			}, (err, user) => {
				if (err) {
					reject(err);
				} else {
					resolve(user);
				}
			});
		});
	};
	
	Users.getUserByEmail = (email) => {
		return new Promise((resolve, reject) => {
			Users.findOne({
				email: email
			}, function(err, user){
				if (err) {
					reject(err);
				} else {
					resolve(user);
				}
			});
		});
	};

    Users.saveNewUser = (data) => {
		return new Promise((resolve, reject) => {
			Bcrypt.hash(data.passwd, 10, (err, hash) => {
				if (err) {
					reject(err);
				} else {
					const newUser = Users({
						email: data.email,
						name: data.name,
						gender: data.gender,
						passwd: hash,
						status: STATUS_PENDING
					})
					
					const URL_KEY = cryptr.encrypt(newUser._id);
					
					newUser.save(err => {
						if (err) {
							reject(err)
						} else {
							resolve(URL_KEY);
						}
					});
				}
			});
		})
	};

	Users.updateUser = (query, update) => {
		return new Promise((resolve, reject) => {
			Users.update(query, update, (err, user) => {
				if(err) {
					reject(err);
				} else {
					resolve(user);
				}					
			});				
		});
	}

	
	
	function getUserIdByUrl(url) {	
		return new Promise((resolve, reject) => {
			ResetPassword.findOne({ 
				url: url
			}, (err, user) => {
				if (err) {
					reject(err);
				} else {
					resolve(user);
				}
			});	
		});
	}

	/**
	 * Send verification email
	 * @param {*} email 
	 * @param {*} name 
	 * @param {*} id 
	 * @param {*} host 
	 */
	
	function sendMail (email, name, id, host) {
		Ejs.renderFile('views/email.ejs', {
			logo: `${host}`,
			name: name,
			emailLink: `//${host}/user/${registerverification}/${id}`
		}, {}, function(err, template) {
			
			if (err) {
				console.log(err);
				return;
			}
			
			Sendmail({
				from: 'no-reply@nirmalrohit.com',
				to: email,
				subject: 'Please verify your email address',
				html: template,
			  }, function(err, reply) {
				console.log(err && err.stack);
				console.dir(reply);
			});
		});	
	}

	/**
	 * send forgot password email.
	 * @param {*} email 
	 * @param {*} name 
	 * @param {*} id 
	 * @param {*} host 
	 */
	
	function sendForgotPasswordMail (email, name, id, host) {
		Ejs.renderFile('views/forgotPasswordeEmail.ejs', {
			logo: `${host}`,
			name: name,
			emailLink: `//${host}/user/resetpassword/${id}`
		}, {}, (err, template) => {
			
			if (err) {
				console.log(err);
				return;
			}
			
			Sendmail({
				from: 'no-reply@nirmalrohit.com',
				to: email,
				subject: 'Reset password',
				html: template,
			  }, (err, reply) => {
				console.log(err && err.stack);
				console.dir(reply);
			});
		});	
	}

	/**?
	 * API ACTIONS
	 */
	function register(req, res) {
        const DATA = req.body;
		const Email = DATA.email;
		
        var resObj = {};
        var newUser = {};

        req.checkBody('email', 'required').notEmpty();
        req.checkBody('email', 'email').isEmail();
        req.checkBody('name', 'required').notEmpty();
        req.checkBody('gender', 'required').notEmpty();
        req.checkBody('passwd', 'required').notEmpty();
        req.checkBody('passwdAgain', 'passwdAgain').equals(DATA.passwd);

		const validationErrors = req.validationErrors();
		
		if (validationErrors) {
            res.send({
                errors: validationErrors
            });
		} else {
			Users.getUserByEmail(Email).then(user => {
				if (user){
					if (user.status == STATUS_PENDING) {
						resObj = {
                            name: 'emailVerification',
                            msg: 'Email already register. But verification is pending!'
                        };
					} else {
						resObj = {
                            name: 'email',
                            msg: 'Email already register!'
                        };
					}
                    res.send({
                        error: resObj
                    });
				} else {
					return Users.saveNewUser(DATA);
				}
			}).then( URL_KEY => {
				
				if (!URL_KEY) {
					return;
				}
				
				const host = req.get('host');

				sendMail(DATA.email, DATA.name, URL_KEY, host);

				res.send({
					success: true,
					message: 'Success'
				});

			}).catch( err => {

				console.error("User register: ", err);

				res.send({
					error: err
				});
			});
		}
	}
	
	function resendVerificationEmail (req,  res) {
		const Email = req.body.email;


	Users.getUserByEmail(Email).then( user => {
		const host = req.get('host');
		const URL_KEY = cryptr.encrypt(user._id);

		if (user) {
			sendMail(Email, user.name, URL_KEY, host);
			
			res.send({
				success: true
			});

		} else {
			res.send({
				error: true
			});
		}
		
	}).catch( err => {

		console.error("Resend verification email: ", err);

		res.send({
			error: err
		});
	});

	}
	
	function verification (req, res) {
        const ID = cryptr.decrypt(req.body.id);

		Users.getUserById(ID).then( user => {
			
			return Users.updateUser ({
				_id: user._id
			}, {
				status: STATUS_ACTIVE
			});

		}).then(()=> {

			res.send({
				success: true
			});

		}).catch( err => {

			console.error("User email verification: ", err);

			res.send({
				error: err
			});
		});
	}
	
	function forgotPassword (req, res) {
		const Email = req.body.email;
		const Host = req.get('host');

		Users.getUserByEmail(Email).then( user => {

			if (!user) {
		
				res.send({
					error: true,
					userEmpty: true
				});
				
			} else {
				dbStoreResetPasswordAndSendEmail(user, res, Host);				
			}

		}).catch( err => {

			console.error("User email verification: ", err);

			res.send({
				error: err
			});
		});
	}

	function dbStoreResetPasswordAndSendEmail(user, res, host) {
		const id = user._id;
		const date = new Date();
		const cryptrForgot = new Cryptr(date.toString());
		const URL_KEY = cryptrForgot.encrypt(id);
		
		const temp = ResetPassword({
			url: URL_KEY,
			user_id: id,
		})
				
		temp.save(err => {
			if (err) {
		
				res.send({
					error: true
				});
				
			} else {
		
				res.send({
					success: true,
					url: `//${host}/user/resetpassword/${URL_KEY}`
				});
				
				sendForgotPasswordMail(user.email, user.name, URL_KEY, host);	
				
			}
		});		
	}

	function resetPassword (req, res) {
        const reqType = req.body.reqType;
		const url = req.body.url;

		if (reqType == 'get') {

			getUserIdByUrl(url).then(user => {

				res.send({
					user: user
				});

			}).catch( err => {
				
				console.error("Reset password get: ", err);
	
				res.send({
					error: err
				});

			});
		} else {
			updatePassword(req, res);
		}
	}

	function updatePassword (req, res) {
		const passwd = req.body.passwd;
		
		req.checkBody('passwd', 'required').notEmpty();
		req.checkBody('passwdAgain', 'passwdAgain').equals(passwd);
		
		const validationErrors = req.validationErrors();
		const USER_ID = req.body.user_id;	
		
		if (validationErrors) {

			res.send({
				errors: validationErrors
			});

		} else {
			Users.getUserById(USER_ID).then( user => {

				return Users.update({
					_id: USER_ID
				}, {
					passwd: passwd
				});

			}).then(user => {
				
				ResetPassword.deleteMany({
					user_id: USER_ID
				}, (err, rec) => {
					if (err) {
						console.log("error in deleting temp password reset data")
					} else {
						
					}
				});

				res.send({
					success: true
				});
				
			}).catch(err => {

				console.error("Update password: ", err);
				
				res.send({
					error: err
				});				
			})
		}
	}

};


		
