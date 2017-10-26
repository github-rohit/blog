const Categories = require('../models/dbCategories');

module.exports =  function(app) {
	
    app.get('/api/getcategorylist', (req, res) => {

        Categories.find({}, (err, category) => {
            if (err) {
                console.log("API category", err)
                res.send({})
            } else {
                res.send(category); 
            }
        })
    });
  
};