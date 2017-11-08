const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const schedule = require('node-schedule');
const config = require('./config/config');
const serverConfig = require('./config/server');
const loginController = require('./controllers/login.controller');
const registerController = require('./controllers/register.controller');
const updateUserController = require('./controllers/update.user.controller');
const blogCreateController = require('./controllers/post/create.controller');
const blogReadController = require('./controllers/post/read.controller');
const blogUpdateController = require('./controllers/post/update.controller');
const postScheduleController = require('./controllers/post/postSchedule.controller');
const commentReadController = require('./controllers/comment/read.controller');
const createReadController = require('./controllers/comment/create.controller');
const categoriesController = require('./controllers/categories.controller');

const server = express();
const port = process.env.PORT;

server.use('/assets', express.static(__dirname + '/public'));
server.set('view engine', 'ejs');
	
// serve angular front end files from root path
server.use('/', express.static('views', { redirect: false }));

serverConfig(server);
loginController(server);
registerController(server);
updateUserController(server);
blogCreateController(server);
blogReadController(server);
blogUpdateController(server);

commentReadController(server);
createReadController(server);
categoriesController(server);
 
// rewrite virtual urls to angular app to enable refreshing of internal pages
server.get('*', function (req, res, next) {
    res.sendFile(path.resolve('views/index.html'));
});

server.listen(port, () => {
    console.log('SERVER UP AND RUNNING AT PORT: ' + port);
});

// schedule.scheduleJob("00 00 1 * * *", () => {
//     postScheduleController(new Date());
// });