(function(app){

    app.module.filter('replaceSpaceWithDash', function () { 
        return function (str) {
            return str ? str.replace(/ /g, "-") : "";  
        }    
    });

    app.module.filter('userAvatarText', function () { 
        return function (str) {
            var arr = [];
            angular.forEach(str.split(" "), function(item) {
              if (item) arr.push(item);
            });
                      
            return arr[0].charAt(0) + arr.pop().charAt(0);  
        }    
    });    

    app.module.filter('getShortDescription', function () { 
        return function (str, len) {
            len = len || 350;
            var elem = angular.element("<div>"+ str +"</div>");
            var txt = elem.text();

            return txt.substr(0, len) + "...";
        }    
    });   
    
})(app);