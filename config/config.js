const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
	const config = require('./config.json');
	var envConfig = config[env];

	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];
	});
}

module.exports = {
    getDbConnectionString: function(){	
		return process.env.MONGODB_URI;
    },
	"status": {
		"pending": "pending",
		"active": "active"
	},
	"postStatus": {
		"published": "published",
		"draft": "draft",
		"deleted": "deleted"
	}	
}