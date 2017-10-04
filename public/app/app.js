var app = app || {};

(function(){

	return app.module = angular.module('app', ['ngRoute', 'ngResource', 'ngSanitize', 'ngCookies', 'ui.tinymce', 'angularMoment']);

})(app);