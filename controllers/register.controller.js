const config = require('../config/config');
const Users = require('../models/dbUsers');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sendmail = require('sendmail')();
const Cryptr = require('cryptr');
const cryptr = new Cryptr('CryptrSecretKey');

const STATUS_PENDING = config.status.pending;
const STATUS_ACTIVE = config.status.active;
const registerverification = "registerverification";

module.exports =  function(app) {
    app.post('/api/register', register);
    app.post('/api/' + registerverification, verification);
    app.post('/api/resendemail', resendemail);

    Users.getUserById = function(id, callback) {
        Users.findOne({ id: id}, function(err, user){
            if (err) {
                callback(err);
            } else {
                callback(null, user);
            }
        });
    };

    Users.getUserByEmail = function(email, callback) {
        Users.findOne({ email: email}, function(err, user){
            if (err) {
                callback(err);
            } else {
                callback(null, user);
            }
        });
    };

    Users.getUserByUname = function(uname, callback) {
        Users.findOne({ uname: uname}, function(err, user){
            if (err) {
                callback(err);
            } else {
                callback(null, user);
            }
        });
    };

    Users.saveUser = function(data, callback) {
        bcrypt.hash(data.passwd, 10, function(err, hash) {
            if (err) {
                callback(err);
            } else {
                const newUser = Users({
                    email: data.email,
                    name: data.name,
                    uname: data.uname,
                    gender: data.gender,
                    passwd: hash,
					status: STATUS_PENDING
                })
				
				const URL_KEY = cryptr.encrypt(newUser._id);
				
				newUser.save(function(err){
					if (err) {
						callback(err)
					} else {
						callback(null, URL_KEY);
					}
				});
            }
        });
    };

	Users.validPassword = function(pwd, hash, callback){
		bcrypt.compare(pwd, hash, function(err, isMatch){
			if (err) {
				callback(err);
			} else {
				callback(err, isMatch);
			}
		});
	};
	
	function sendMail (email, name, id, host) {
		console.log(`//${host}/assets/img/logo.svg`)
		ejs.renderFile('views/email.ejs', {
			logo: `//${host}/assets/img/logo.svg`,
			name: name,
			emailLink: `//${host}/user/${registerverification}/${id}`
		}, {}, function(err, template) {
			
			if (err) {
				console.log(err);
				return;
			}
			
			sendmail({
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

    function register (req, res){
        var resObj = {};
        var newUser = {};
        var data = req.body;
        var errors = {};
        var email = data.email;
        var uname = data.uname;

        req.checkBody('email', 'required').notEmpty();
        req.checkBody('email', 'email').isEmail();
        req.checkBody('name', 'required').notEmpty();
        req.checkBody('uname', 'required').notEmpty();
        req.checkBody('gender', 'required').notEmpty();
        req.checkBody('passwd', 'required').notEmpty();
        req.checkBody('passwdAgain', 'passwdAgain').equals(req.body.passwd);

        errors = req.validationErrors();
		
        if (errors) {
            res.send({
                errors: errors
            });
        } else {
            Users.getUserByEmail(email, function(err, user) {
                if (err) {
                    res.send({
                        error: err
                    });
                } else if (user){
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
                    Users.getUserByUname(uname, function(err, userid){
                        if (err) {
                            res.send({
                                error: err
                            });
                        } else if (userid){
                            res.send({
                                error: {
                                    name: 'uname',
                                    msg: 'User Name already register!'
                                }
                            });
                        } else {
                            Users.saveUser(data, function(err, id){
                                if(err) {
                                    res.send({
                                        error: true,
                                        message: 'Error'
                                    });
                                } else {
									const host = req.get('host');
									
									res.send({
										success: true,
										message: 'Success'
									});
									
									sendMail(data.email, data.name, id, host);
                                }
                            });
                        }                        
                    });
                }
            });
        }
    }
	
	function verification (req, res) {
        const ID = cryptr.decrypt(req.body.id);

		Users.getUserById(ID, function (err) {
			if ( err ) {
				
			} else {
				verificationEmail(ID, res);
			}
		});
		
	}
	
	function verificationEmail (id, res) {
		Users.update({
			_id: id
		}, {
			status: STATUS_ACTIVE
		}, function(err, user){
			if(err) {
				res.send({
					error: true
				});
			} else {
				res.send({
					success: true
				});
			}					
		});		
	}
	
	function resendemail(req, res) {
		const email = req.body.email;

		res.send({
			success: true
		});
		
		//sendMail(email, res);
		
	}
};


		
