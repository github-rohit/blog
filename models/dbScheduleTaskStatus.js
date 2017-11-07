const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const dbSchema = new Schema({
	date: {
		type: Date,
		required: true
    },
	task: {
		type: String,
		required: true
    },
    status: {
		type: String,
		required: true
    },
    error: {
        type: String
    }  
});
    
const ScheduleTaskStatus = mongoose.model('ScheduleTaskStatus', dbSchema);

module.exports = ScheduleTaskStatus;