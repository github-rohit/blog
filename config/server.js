const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const passportHttp = require('passport-http');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const config = require('./config');

module.exports =  function(app) {

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true}));

	app.use(flash());
	app.use(function (req, res, next) {
		res.locals.messages = require('express-messages')(req, res);
		next();
	});

	app.use(expressValidator({
		errorFormatter: function(param, msg, value) {
				var namespace = param.split('.')
				, root    = namespace.shift()
				, formParam = root;

			while(namespace.length) {
				formParam += '[' + namespace.shift() + ']';
			}
			return {
				param : formParam,
				msg   : msg,
				value : value
			};
		}
	}));
	
	app.use(session({
		name: 'BLOG',
		secret: process.env.SECRET,
		saveUninitialized: true,
		path : '/',
		resave: false,
		HttpOnly: false,
		cookie: {
			httpOnly: false,
			maxAge: 604770038
		}
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(cookieParser());

	mongoose.connect(config.getDbConnectionString(), {
		"useMongoClient": true
	});
};