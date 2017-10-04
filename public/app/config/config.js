(function(app) {
	app.module.config(config);
	config.$inject = ['KeepaliveProvider', 'IdleProvider'];
	
	function config(KeepaliveProvider, IdleProvider) {
		IdleProvider.idle(5);
		IdleProvider.timeout(5);
		KeepaliveProvider.interval(10);
  }
})(app);