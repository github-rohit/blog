(function(app){
    app.module.filter('replaceSpaceWithDash', replaceSpaceWithDash);

    function replaceSpaceWithDash() { 
        return function (str) {
            return str.replace(/ /g, "-");  
        }    
    }

})(app);