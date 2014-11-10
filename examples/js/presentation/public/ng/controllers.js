/*jslint browser: true, passfail: false, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
angular.module('SierraControllers', ['mgcrea.ngStrap'])
.controller('AppCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
	$scope.httpError = function(data, status) {
		switch(status) {
			case 400:
				$rootScope.appLoading(false);
				return $scope.notify(data.error, data.message, 'warning');
			default:
				$rootScope.statusCode = status;
				$rootScope.appError = {
					status: status,
					data: data
				};
				$rootScope.appLoading(false);
				break;
		}
	};
}]).factory('LoremIpsum', function() {
    /*
     * Code adapted from http://dev-notes.com/code.php?q=37
     */
    var bank = ["lorem","ipsum","dolor","sit","amet,","consectetur","adipisicing","elit,","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua.","enim","ad","minim","veniam,","quis","nostrud","exercitation","ullamco","laboris","nisi","ut","aliquip","ex","ea","commodo","consequat.","duis","aute","irure","dolor","in","reprehenderit","in","voluptate","velit","esse","cillum","dolore","eu","fugiat","nulla","pariatur.","excepteur","sint","occaecat","cupidatat","non","proident,","sunt","in","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum.","sed","ut","perspiciatis,","unde","omnis","iste","natus","error","sit","voluptatem","accusantium","doloremque","laudantium,","totam","rem","aperiam","eaque","ipsa,","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt,","explicabo.","nemo","enim","ipsam","voluptatem,","quia","voluptas","sit,","aspernatur","aut","odit","aut","fugit,","sed","quia","consequuntur","magni","dolores","eos,","qui","ratione","voluptatem","sequi","nesciunt,","neque","porro","quisquam","est,","qui","dolorem","ipsum,","quia","dolor","sit,","amet,","consectetur,","adipisci","velit,","sed","quia","non","numquam","eius","modi","tempora","incidunt,","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem.","ut","enim","ad","minima","veniam,","quis","nostrum","exercitationem","ullam","corporis","suscipit","laboriosam,","nisi","ut","aliquid","ex","ea","commodi","consequatur?","quis","autem","vel","eum","iure","reprehenderit,","qui","in","ea","voluptate","velit","esse,","quam","nihil","molestiae","consequatur,","vel","illum,","qui","dolorem","eum","fugiat,","quo","voluptas","nulla","pariatur?","at","vero","eos","et","accusamus","et","iusto","odio","dignissimos","ducimus,","qui","blanditiis","praesentium","voluptatum","deleniti","atque","corrupti,","quos","dolores","et","quas","molestias","excepturi","sint,","obcaecati","cupiditate","non","provident,","similique","sunt","in","culpa,","qui","officia","deserunt","mollitia","animi,","id","est","laborum","et","dolorum","fuga.","harum","quidem","rerum","facilis","est","et","expedita","distinctio.","Nam","libero","tempore,","cum","soluta","nobis","est","eligendi","optio,","cumque","nihil","impedit,","quo","minus","id,","quod","maxime","placeat,","facere","possimus,","omnis","voluptas","assumenda","est,","omnis","dolor","repellendus.","temporibus","autem","quibusdam","aut","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet,","ut","et","voluptates","repudiandae","sint","molestiae","non","recusandae.","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus,","aut","reiciendis","voluptatibus","maiores","alias","consequatur","aut","perferendis","doloribus","asperiores","repellat"];
    return function(min, max) {
       min = min || 15;
       max = max || 100;

	   var words = Math.floor(Math.random()*(max - min)) + min,
	   	   result = "",
		   i, newText;
	   for(i = 0; i < words; i++) {
            newText = bank[Math.floor(Math.random() * (bank.length - 1))];
            if (result.substring(result.length - 1, result.length) == "." || result.substring(result.length - 1, result.length) == "?") {
                newText = newText.substring(0,1).toUpperCase() + newText.substring(1, newText.length);
			}

            result += " " + newText;
	   }

        return 'Lorem ipsum' + result;
    };
})
.controller('HomeCtrl', ['$scope', '$window', '$document', '$http', 'LoremIpsum', function($scope, $window, $document, $http, loremIpsum) {
    $scope.slides = $('[slide]');
    $scope.loremIpsum = loremIpsum;

	var transitioning = false;

	$scope.previousSlide = 'header';
	$scope.nextSlide = $scope.slides[0].id;
	$scope.lastSlide = $scope.slides[$scope.slides.length - 1].id;


	function getSlideIndex(slide) {
		for(var i = 0; i < $scope.slides.length; i++)
			if($scope.slides[i].id == slide.id) return i;
		return -1;
	}

	function updateSlides() {
		if(transitioning) return onScroll();

		var top = $($window).scrollTop();
		var current = _.findLast($scope.slides, function(slide) {
			var offset = $(slide).offset();
			return offset.top <= top + 50;
		});
		if(!current) return;
		var index = getSlideIndex(current);
		desiredIndex = index;
		if(!index) $scope.previousSlide = 'header';
		else $scope.previousSlide = $scope.slides[index - 1].id;

		if(index < $scope.slides.length - 1) $scope.nextSlide = $scope.slides[index + 1].id;
	}

	$scope.onKeypress = function(event) {
		if(event.key == 'ArrowLeft' || event.keyCode == 37) {
			$scope.switchSlide($scope.previousSlide);
		}
		else if(event.key == 'ArrowRight' || event.keyCode == 39) {
			$scope.switchSlide($scope.nextSlide);
		}
	};

	$scope.switchSlide = function (slide) {
		var actualSlide = _.find($scope.slides, function(s) { return s.id == slide; });
		transitioning = true;

		if(actualSlide) {
			var index = getSlideIndex(actualSlide);
			if(!index) $scope.previousSlide = 'header';
			else $scope.previousSlide = $scope.slides[index - 1].id;

			if(index < $scope.slides.length - 1) $scope.nextSlide = $scope.slides[index + 1].id;
		} else actualSlide = $(slide);

		$document.scrollToElement(actualSlide, 0, 500).then(function() {
			transitioning = false;
			updateSlides();
		});
	};

	var onScroll = _.throttle(function () {
		$scope.$apply(updateSlides);
	}, 100);

	$($window).scroll(onScroll);

    $scope.start = function() {
        $('#presentation').focus();
        $scope.switchSlide('#' + $scope.nextSlide);
    };

    $scope.api = function(method, options) {
        $http.post('/api/' + method, options).then(angular.noop, $scope.httpError);
    };

	$scope.appLoading(false);
}]);
