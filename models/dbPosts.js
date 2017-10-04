var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

mongoose.connect('mongodb://localhost/blog', {
	useMongoClient: true
});

var dbSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true
	},
	image: {
		type: String,
		required: true
	},
	short_description: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	tags: {
		type: String,
		required: true
	},
	owner: {
		type: String,
		required: true
	}, 
	date: {
		type: Date,
		required: true
	},
	status: {
		type: String,
		required: true
	}
});
    
var Posts = mongoose.model('Posts', dbSchema);

module.exports = Posts;