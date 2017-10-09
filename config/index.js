var config = require('./config');

module.exports = {
    getDbConnectionString: function(){
		//return 'mongodb://localhost/blog';
        return 'mongodb://' + config.uname + ':' + config.pwd + '@ds161574.mlab.com:61574/blog';
    }
}