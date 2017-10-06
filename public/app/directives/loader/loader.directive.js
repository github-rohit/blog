(function(app){

	app.module.directive('routeLoader', routeLoader);
	routeLoader.$inject = ['$http'];
	
	function routeLoader($http) {
		return {
			restrict: 'EA',
			link: function(scope, element) {
				// Store original display mode of element
				var shownType = element.css('display');
				var isRequesting = false;

				function showElement() {
					element.css('display', shownType);
				}

				function hideElement() {
					element.css('display', 'none');
				}
				
				scope.isLoading = function () {  
					return $http.pendingRequests.length > 0;  
				};	
				
				scope.$watch(scope.isLoading, function (isReq) {
					if (isReq) {
						isRequesting = true;
						showElement();
					} else {
						isRequesting = false;
						hideElement();
					}
				});
					
				scope.$on('$routeChangeStart', function() {
					showElement();
				});			
				
				scope.$on('$routeChangeSuccess', function () {
					if (!isRequesting)
					hideElement();
				});
				scope.$on('$routeChangeError', hideElement);
				// Initially element is hidden
				hideElement();
			}
		}
	}

})(app);
