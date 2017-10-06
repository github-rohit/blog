(function(app) {
	app.module.config(config);
	config.$inject = ['$httpProvider', 'KeepaliveProvider', 'IdleProvider'];
	
	function config($httpProvider', KeepaliveProvider, IdleProvider, ) {
		IdleProvider.idle(5);
		IdleProvider.timeout(5);
		KeepaliveProvider.interval(10);
		$httpProvider.interceptors.push('HttpInterceptor');
  }
})(app);