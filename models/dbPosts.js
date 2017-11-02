const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const dbSchema = new Schema({
	title: {
		type: String,
		required: true
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

Posts.collection.ensureIndex({
	"title": 1, 
	"post_reference_id": 1 
}, { 
	unique: true 
});

module.exports = Posts;