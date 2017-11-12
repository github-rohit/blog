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
		type: Array,
		default: "Uncategorized"
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
	},
	schedule_at: {
		type: Date
	}
});

dbSchema.statics.findAndUpdateOrSave = function (query, postObj) {
	return new Promise((resolve, reject) => {
		Posts.findOne(query, (err, post) => {
			if (err) {

				reject(err);

			} else if (post) {

				Posts.findOneAndUpdate({
					_id: post._id
				}, postObj, {
					new: true
				}, (err, result)=> {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});	

			} else {

				const newPost = Posts(postObj);
				newPost.save((err, result)=> {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});

			}
		})
	});	
}

dbSchema.statics.updatePublishAndDelete = function (postObj, delId) {
	const ID = postObj.post_reference_id;
	
	postObj.post_reference_id = null;
	
	return new Promise((resolve, reject) => {
		let id = delId;
		Posts.findOneAndUpdate({
			_id: ID
		}, {
			$set: postObj
		}, {
			new: true
		},(err, post) => {
			if (err) {
				reject({
					id, 
					code: "001#1"
				});
			} else {
				Posts.remove({
					_id: delId
				},  (err) => {
					if (err) {
						reject({
							id,
							code: "001#2"	
						});
					} else {
						resolve(post);
					}
				});				
			}
			
		});		
	})

}

const Posts = mongoose.model('Posts', dbSchema);

// Posts.collection.createIndex({
// 	"title": 1, 
// 	status: 1,
// 	"post_reference_id": 1 
// }, { 
// 	unique: true 
// });

module.exports = Posts;