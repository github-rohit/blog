const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const dbSchema = new Schema({
	schedule_at: {
		type: Date,
		required: true
	}
});
    
const PostSchedule = mongoose.model('PostSchedule', dbSchema);

module.exports = PostSchedule;