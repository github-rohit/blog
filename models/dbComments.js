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
	createdBy: {
		type: String,
		required: true
	}, 
	date: {
		type: Date,
		required: true
	}
});
    
var Comments = mongoose.model('Comments', dbSchema);

module.exports = Comments;