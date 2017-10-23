var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var dbSchema = new Schema({
	url: { 
		type: String,
		required: true,
	},
	user_id: {
		type: String,
		required: true
	},

});
    
var ResetPassword = mongoose.model('ResetPassword', dbSchema);

module.exports = ResetPassword;