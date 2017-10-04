var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var passportHttp = require('passport-http');
var flash = require('connect-flash');

var config = require('./config');
var date = new Date();

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
		secret: config.secret,
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
};