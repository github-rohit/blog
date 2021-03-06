var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var dbSchema = new Schema({
	email: { 
		type: String,
		required: true,
		unique: true,
		dropDups: true
	},
	name: {
		type: String,
		required: true
	},
	passwd: {
		type: String,
		required: true
	}, 
	gender: {
		type: String
	},
	status: {
		type: String
	},
	avatar: {
		type: String
	},
	aboutme: {
		type: String
	},
	country: {
		type: String
	},
	website: {
		type: String
	},
	facebook: {
		type: String
	},
	twitter: {
		type: String
	},
	google_plus: {
		type: String
	},
	linkedIn: {
		type: String
	},
	instagram: {
		type: String
	},
	tumblr: {
		type: String
	},
	pinterest: {
		type: String
	}

});
    
var Users = mongoose.model('Users', dbSchema);

module.exports = Users;