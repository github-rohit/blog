var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var dbSchema = new Schema({
	postId: {
		type: String,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	created_by: {
		type: mongoose.Schema.ObjectId,
		required: true
	}, 
	created_on: {
		type: Date,
		required: true,
		default: new Date()
	}
});
    
var Comments = mongoose.model('Comments', dbSchema);

module.exports = Comments;