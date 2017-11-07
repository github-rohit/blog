const Config = require('../../config/config');
const PostSchedule = require('../../models/dbPostSchedule');
const ScheduleTaskStatus = require('../../models/dbScheduleTaskStatus');
const Posts = require('../../models/dbPosts');

module.exports =  function(schedule_at) {
    var idsArray = [];

    PostSchedule.find({
        schedule_at: {
            $lte: new Date(schedule_at)
        }       
    }).then((posts) => {
        if (!posts.length) {
            return;
        }
        
        idsArray = [];

        for (const post of posts) {
            idsArray.push(post._id);
        }

        return Posts.updateMany({
            _id: {
                $in: idsArray
            }
        }, {
            status: Config.postStatus.published
        });

    }).then((post) => {
        console.log("Post Schedule Published Done!");

        return PostSchedule.remove({
            _id: {
                $in: idsArray
            }
        });

    }).then(() => {
        saveScheduleTaskStatus({
            date: schedule_at,
            task: "Published",
            status: "SUCCESS"
        });
        console.log("Post Schedule Published Done!");
    }).catch(err => {

        console.log("Post Schedule Failed", err);

        saveScheduleTaskStatus({
            date: schedule_at,
            task: "Published",
            status: "FAIL",
            error: err
        });

    });

};

function saveScheduleTaskStatus (data) {
    const scheduleTaskStatusData = new ScheduleTaskStatus(data);
    scheduleTaskStatusData.save().then(()=>{
        console.log("schedule Task Status Done!");
    }).catch(err => {
        console.log("schedule Task Status Failed", err);
    })
}