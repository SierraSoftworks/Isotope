angular.module('ngHLJS', [])
	.directive('code', function() {
		return {
			restrict: 'E',
			terminal: true,
			scope: {
				code: '@',
				lang: '@'
			},
			link: function(scope, element, attrs) {
				var insideCode = element.html();

				hljs.configure({ tabReplace: '  ' });

				function reloadMarkup() {
					var code = attrs.code ? scope.code : insideCode;
					if(!code) return element.html('');

					code = hljs.fixMarkup(code);
					var highlighted = null;

					if(scope.lang) highlighted = hljs.highlight(scope.lang, code);
					else highlighted = hljs.highlightAuto(code);

					element.html(highlighted.value);
				}

				if(!attrs.lang) {
					var match = /lang-(\S+)/.exec(element[0].className);
					scope.lang = match && match[1];
				}
				else scope.$watch('lang', function() { reloadMarkup(); });	

				scope.$watch('code', function(code) { reloadMarkup(); });
			}
		};
	});

var highlightApp = angular.module('highlight', ['ngHLJS']);

highlightApp.controller('MainCtrl', function($scope) {
	$scope.style = 'github';
	$scope.styles = ['arta', 'ascetic', 'dark', 'default', 'docco', 'far', 'foundation', 'github', 'googlecode', 'hybrid', 'idea', 'vs'];

	$scope.setStyle = function(s) {
		$scope.style = s;
	};
}).controller('HighlightCtrl', function($scope) {
	$scope.code = "";
});