const {POST_STATUS} = require('../../config/config');
const ScheduleTaskStatus = require('../../models/dbScheduleTaskStatus');
const Posts = require('../../models/dbPosts');

const STATUS_PUB = POST_STATUS.PUBLISH;

module.exports =  function(schedule_at) {
    var idsArray = [];
	var pArray = [];

	saveScheduleTaskStatus({
		date: schedule_at,
		task: "001",
		status: "SUCCESS",
		msg: "Start Schedule publishing"
	});
	
    Posts.find({
        schedule_at: {
            $lte: new Date(schedule_at)
        }       
    }).then((posts) => {
        
        if (!posts) {
            return;
        }
		
		console.log("IDs FOUND FOR PUBLISH:", idsArray);
		
		return new Promise((resolve, reject) => {
			posts.forEach( post => {
				let postId = post._id;
				
				pArray.push(Posts.updatePublishAndDelete({
					image: post.image,
					description: post.description,
					category: post.category,
					tags: post.tags,
					status: STATUS_PUB
				}, postId));
				
			});
			
			resolve();
		})

    }).then(() => {
		for (let priomise of pArray) {
			
			priomise.then((id) => {
				
			}).catch((err) => {
				saveScheduleTaskStatus({
					date: schedule_at,
					task: err.code,
					status: "FAIL",
					msg: err.id
				});
			});
		}				
	}).catch(err => {

        console.log("Post Schedule Failed", err);

        saveScheduleTaskStatus({
            date: schedule_at,
            task: "001",
            status: "FAIL",
            msg: err
        });

    });

};

function saveScheduleTaskStatus (data) {
    const scheduleTaskStatusData = new ScheduleTaskStatus(data);
    scheduleTaskStatusData.save().then(()=>{
		
    }).catch(err => {
        console.log("schedule Task Status Failed", err);
    })
}