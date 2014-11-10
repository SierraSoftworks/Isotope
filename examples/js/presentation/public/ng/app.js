angular.module('SierraApp', ['ngRoute', 'ngFilters', 'ngServices', 'ngDirectives', 'SierraControllers', 'duScroll', 'mgcrea.ngStrap', 'ui.bootstrap.collapse'])
.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
	$httpProvider.defaults.headers.common = {
		Accept: 'application/json, text/plain, text/html, */*',
		'Content-Type': 'application/json'
	};

	$locationProvider.html5Mode(true).hashPrefix('!');
	$routeProvider
		.when('/', {
			title: 'Home',
			templateUrl: '/ngt/home.html',
			controller: 'HomeCtrl'
		})
        .otherwise({
			title: 'Not Found',
			templateUrl: '/ngt/errors.html',
			controller: ['$rootScope', function($rootScope) {
				$rootScope.statusCode = 404;
			}]
		});
}])
.run(['$rootScope', '$location', '$window', '$anchorScroll', function($rootScope, $location, $window, $anchorScroll) {
	$rootScope.appUrl = $location.url();

	var title = 'Home';
	$rootScope.appTitle = function(t) {
		if(t !== undefined) title = t;
		else return title;
	};

	var loading = true;
	$window.prerenderReady = false;
	$rootScope.appLoading = function(state) {
		if(state !== undefined) $window.prerenderReady = !(loading = state);
		else return loading;
	};

	$rootScope.$on('$routeChangeStart', function(e, current, previous) {
		$rootScope.appLoading(true);
		$window.scrollTo(0,0);
		$rootScope.appError = null;
	});

	$rootScope.$on('$routeChangeSuccess', function(e, current, previous) {
		$rootScope.appUrl = $location.url();

		if(!current.$$route) {
			$rootScope.appTitle('Not Found');
			$rootScope.appLoading(false);
			$rootScope.statusCode = 404;
			$rootScope.appError = {
				status: 404,
				data: {
					error: 'Not Found',
					message: "The page you were looking for could not be found on this server."
				}
			};
		} else {
			$rootScope.appTitle(current.$$route.title);
			$rootScope.appError = null;
		}
	});

	$rootScope.$on('$routeChangeError', function(e, current, previous, error) {
		$rootScope.appUrl = $location.url();
		$rootScope.appTitle(error.data.error || 'Error');
		$rootScope.appLoading(false);
		$rootScope.appError = error;
	});
}]);
