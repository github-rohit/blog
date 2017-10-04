const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const serverConfig = require('./config/server');
const loginController = require('./controllers/login.controller');
const registerController = require('./controllers/register.controller');
const updateUserController = require('./controllers/update.user.controller');
const blogCreateController = require('./controllers/post/create.controller');
const blogReadController = require('./controllers/post/read.controller');
const blogUpdateController = require('./controllers/post/update.controller');
const commentReadController = require('./controllers/comment/read.controller');
const createReadController = require('./controllers/comment/create.controller');

const server = express();
const port = process.env.PORT || 3000;

server.use('/assets', express.static(__dirname + '/public'));
server.set('view engine', 'ejs');
	
// serve angular front end files from root path
server.use('/', express.static('views', { redirect: false }));
 
// rewrite virtual urls to angular app to enable refreshing of internal pages
server.get('*', function (req, res, next) {
    res.sendFile(path.resolve('views/index.html'));
});

serverConfig(server);
loginController(server);
registerController(server);
updateUserController(server);
blogCreateController(server);
blogReadController(server);
blogUpdateController(server);

commentReadController(server);
createReadController(server);

server.listen(port);