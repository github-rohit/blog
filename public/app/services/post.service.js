(function (app) {
	'use strict';

 	app.module.factory('PostService', PostService);
 	
	PostService.$inject = ['$http'];

	function PostService($http) {
		
		var service = {
			list: [],
			category: {
				"technology": "Technology",
				"music": "Music",
				"fashion": "Fashion",
				"movie": "Movie",
				"law": "law",
				"history": "History",
			},
			tags: {
				"technology": "Technology",
				"music": "Music",
				"fashion": "Fashion",
				"movie": "Movie",
				"law": "law",
				"history": "History",
			},
			create: function (data, callback) {
				$http.post('/api/create', data).then(function(response){
					callback(response);
				}, function(response){

				});
			},
			getPosts: function (data, callback) {
				$http.post('/api/post/posts', data).then(function(response){
					callback(response);
				}, function(response){
					callback(response);
				});
			},
			getPostsById: function (data, callback) {
				$http.post('/api/post/posts/id', data).then(function(response){
					callback(response);
				}, function(response){
					callback(response);
				});
			},
			getComments: function (data, callback) {
				$http.post('/api/comments', data).then(function(response){
					callback(response);
				}, function(response){
					callback(response);
				});
			},
			saveComment: function (data, callback) {
				$http.post('/api/comment', data).then(function(response){
					callback(response);
				}, function(response){
					callback(response);
				});
			},
			update: function (data, callback) {
				$http.post('/api/post/update', data).then(function(response){
					callback(response);
				}, function(response){

				});
			},
			delete: function (data, callback) {
				$http.delete('/api/post/delete', data).then(function(response){
					callback(response);
				}, function(response){

				});
			}
		};

		return service;
	}
 
})(app);