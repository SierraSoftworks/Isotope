angular.module('ngDirectives', ['ngServices'])
	.directive('editable', ['$parse', function($parse) {
		return {
			restrict: 'EA',
			replace: true,
			scope: {
				original: '=editable',
				active: '=?active',
				type: '@type',
				name: '@name',
				placeholder: '@placeholder',
				title: '@title',
				save: '&save',
				hasSave: '@save'
			},
			controller: ['$scope', function($scope) {
				$scope.value = $scope.original;
				var lastChange = $scope.original;

				$scope.$watch('original', function(newValue) {
					if($scope.value == lastChange) $scope.value = lastChange = newValue;
				});

				if($scope.hasSave) {
					$scope.onBlur = function() {
						if(lastChange != $scope.value)
							$scope.save({ $original: $scope.original, $oldValue: lastChange, $newValue: $scope.value });
						lastChange = $scope.value;
					};

					$scope.onKeypress = function(event) {
						if(event.keyCode == 27) {
							$scope.value = $scope.original;
							lastChange = $scope.original;
						} else if(event.keyCode == 13) {
							$scope.save({ $original: $scope.original, $oldValue: lastChange, $newValue: $scope.value });
							lastChange = $scope.value;
						}
					};
				} else {
					$scope.onKeypress = $scope.onBlur = angular.noop;
					$scope.$watch('value', function(newValue) {
						$scope.original = newValue;
					});
				}
			}],
			template: [
				'<div class="input-plain-container">',
					'<input class="input-plain" type="{{type || \'text\'}}" name="{{name}}" placeholder="{{placeholder}}"',
						'title="{{title}}" ng-model="value" ng-class="{ \'active\': active }" ng-blur="onBlur()" ng-keypress="onKeypress($event)"/>',
					'<div class="input-plain-sizer">{{value || placeholder}}</div>',
				'</div>'
				].join('\n')
		}
	}])
	.directive('fill', ['$window', function($window) {
		return {
			restrict: 'A',
			scope: {
				offset: '=fill'
			},
			link: function (scope, element) {
				var w = angular.element($window);

				scope.getWindowDimensions = function () {
					return { 'h': w.height(), 'w': w.width() };
				};
				scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
					element.css({ 
						'min-height': newValue.h - (scope.offset && scope.offset.h || 0)
					});
				}, true);

				w.bind('resize', function () {
					scope.$apply();
				});
			}
		}
	}])
	.directive('matchHeight', ['$window', function($window) {
		return {
			restrict: 'A',
			scope: {
				target: '@matchHeight'
			},
			link: function(scope, element) {
				var w = angular.element($window);
				var t = angular.element(scope.target);

				scope.getHeight = function() {
					if(!t) return null;
					return t.outerHeight();
				};

				scope.$watch(scope.getHeight, function(newValue) {
					if(typeof newValue == 'number') element.height(newValue);
				}, true);

				scope.$watch('target', function(newTarget) {
					t = angular.element(scope.target);
				});
				w.bind('resize', function () {
					scope.$apply();
				});
			}
		}
	}])
	.directive('json', [function() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attr, ngModel) {
				ngModel.$parsers.push(function(json) {
					try {
						return JSON.parse(json);
					} catch(ex) {
						return null;
					}
				});
				ngModel.$formatters.push(function(obj) {
					return JSON.stringify(obj, null, 2);
				});
			}
		};
	}]).directive('ngEnter', function() {
		return function(scope, element, attrs) {
			element.bind("keydown keypress", function(event) {
				if(event.which === 13) {
					scope.$apply(function(){
						scope.$eval(attrs.ngEnter, {'event': event});
					});

					event.preventDefault();
				}
			});
		};
	}).directive('skrollr', ['skrollr', '$window', '$document', function(skrollr, $window, $document) {
		return {
			scope: {
				watch: '@skrollr',
				element: '@skrollElement',
				watchTree: '@?'
			},
			link: function(scope, element) {
				var refresh = _.throttle(function() {
					scope.element ? skrollr.refresh(document.querySelector(scope.element)) : skrollr.refresh();
				}, 100, { trailing: true });

				var watchElement;
				if(scope.watch) {
					switch(scope.watch) {
						case 'document': watchElement = $document; break;
						case 'window': watchElement = $window; break;
						default: watchElement = angular.element(document.querySelector(scope.element)); break;
					}
				} else watchElement = element;

				if(scope.watchTree) {
					var observer = new MutationObserver(refresh);

					observer.observe(watchElement[0], {
						childList: true,
						subtree: true
					});

					scope.$on('$destroy', function() {
						observer.disconnect();
					});
				}

				scope.$watch(function() {
					return watchElement.height();
				}, function(oldValue, newValue) {
					if(oldValue != newValue) refresh();
				});
			}
		}
	}]).directive('slide', ['skrollr', function(skrollr) {
		return {
			scope: {
				offset: '@?slide'
			},
			link: function(scope, element) {
				var id = element[0].id,
					offset = scope.offset || 0;
				element = $(element[0]);

				function tag(spec, offset) {
					if(offset) return 'data-' + offset + '-' + spec;
					return 'data-' + spec;
				}

				var background = $(element.children('.background')[0]);
				var foreground = $(element.children('.container')[0]);

				background.attr('data-anchor-target','#' + id);
				foreground.attr('data-anchor-target', '#' + id);

				background.attr(tag('bottom-top'), "opacity: 0;");
				background.attr(tag('5p-top-top'), "opacity: 1;");
				background.attr(tag('5p-bottom-bottom'), "opacity: 1;");
				background.attr(tag('top-bottom'), "opacity: 0;");

				foreground.attr(tag('bottom-top'), "opacity: 0.8; top: 200px;");
				foreground.attr(tag('25p-top-top'), "opacity: 1; top: 0;");
				foreground.attr(tag('25p-bottom-bottom'), "opacity: 1; top: 0;");
				foreground.attr(tag('top-bottom'), "opacity: 0.8;");

				skrollr.refresh(element);
			}
		}
	}]);