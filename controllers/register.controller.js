const Users = require('../models/dbUsers');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports =  function(app) {
    app.post('/api/register', register);

    Users.getUserByEmail = function(email, callback) {
        Users.findOne({ email: email}, function(err, user){
            if (err) {
                console.log('getUserByEmail')
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
                var newUser = Users({
                    email: data.email,
                    name: data.name,
                    uname: data.uname,
                    gender: data.gender,
                    passwd: hash
                })

                newUser.save(function(err){
                    if (err) {
                        callback(err)
                    } else {
                        callback(null);
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
                    res.send({
                        error: {
                            name: 'email',
                            msg: 'Email already register'
                        }
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
                                    msg: 'User Name already register'
                                }
                            });
                        } else {
                            Users.saveUser(data, function(err){
                                if(err) {
                                    res.send({
                                        error: true,
                                        message: 'Error'
                                    });
                                } else {
                                    res.send({
                                        success: true,
                                        message: 'Success'
                                    });
                                }
                            });
                        }                        
                    });
                }
            });
        }
    }
};