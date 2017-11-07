const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const dbSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	image: {
		type: String
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
		type: Array
	},
	created_by: {
		type: mongoose.Schema.ObjectId,
		required: true
	}, 
	date: {
		type: Date,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	post_reference_id: {
		type: mongoose.Schema.ObjectId
	}
});

const Posts = mongoose.model('Posts', dbSchema);

Posts.collection.createIndex({
	"title": 1, 
	status: 1,
	"post_reference_id": 1 
}, { 
	unique: true 
});

module.exports = Posts;