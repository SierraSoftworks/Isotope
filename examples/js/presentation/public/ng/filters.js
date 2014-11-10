angular.module('ngFilters', [])
	.filter('skip', function() {
		return function(array, skip, enable) {
			if(!enable) return array;
			if(!Array.isArray(array)) return null;
			if(skip >= array.length) return null;
			return array.slice(skip);
		};
	})
	.filter('markdown', ['$sce', function($sce) {
		return function(text) {
			if(text === undefined || text === null) return "";
			return $sce.trustAsHtml(marked(text, { gfm: true, breaks: true, sanitize: true }));
		};
	}]).filter('timespan', function() {
		return function(milliseconds, prefix, suffix, approximate) {
			if(prefix === undefined)
				prefix = milliseconds >= 0 ? 'in' : '';
			if(suffix === undefined)
				suffix = milliseconds < 0 ? 'ago' : '';
			if(approximate === undefined)
				approximate = true;

			var seconds = milliseconds / 1000;

			if(seconds < 0) seconds *= -1;

			if(seconds === undefined || seconds === null) return "";
			function prep(output) {
				return (prefix + ' ' + (approximate ? 'about ' : '') + output + ' ' + suffix).trim();
			}

			if(!Math.round(seconds/60)) return (prefix + " less than a minute " + suffix).trim();
			if(Math.round(seconds/60) < 2) return prep("a minute");
			if(!Math.round(seconds/3600)) return prep(Math.round(seconds / 60) + " minutes");
			if(Math.round(seconds/3600) < 2) return prep("an hour");
			if(!Math.round(seconds/86400)) return prep(Math.round(seconds / 3600) + " hours");
			if(Math.round(seconds/86400) < 2) return prep("a day");
			if(!Math.round(seconds/(7 * 86400))) return prep(Math.round(seconds / 86400) + " days");
			if(Math.round(seconds/(7 * 86400)) < 2) return prep("a week");
			if(!Math.round(seconds/(28 * 86400))) return prep(Math.round(seconds / (7*86400)) + " weeks");
			if(Math.round(seconds/(28 * 86400)) < 2) return prep("a month");
			if(!Math.round(seconds/(365 * 86400))) return prep(Math.round(seconds / (7*86400)) + " months");
			if(Math.round(seconds/(365 * 86400)) < 2) return prep("a year");
			return prep(Math.round(seconds / (365*86400)) + " years");
		};
	}).filter('shorttime', function() {
		return function(milliseconds) {
			var seconds = milliseconds / 1000;

			if(seconds < 0) seconds *= -1;

			var time = "", tmp = seconds;

			function update(unit, mod, divide) {
				tmp = Math.round(tmp / divide);
				if(tmp % mod) time = (tmp % mod) + unit + time;
			}

			update('s', 60, 1);
			update('m', 60, 60);
			update('h', 24, 60);
			update('d', 7, 24);
			update('w', 52, 7);
			update('y', 10, 52);
			update('D', 100, 10);

			return time;
		};
	}).filter('toDate', function() {
		return function(d) {
			if(d instanceof Date) return d;
			return new Date(d);
		}
	}).filter('relativeDate', function() {
		return function(date, to) {
			if(!(date instanceof Date)) date = new Date(date);
			if(!to) to = new Date();
			return date.getTime() - to.getTime();
		}
	}).filter('toFixed', function() {
		return function(number, decimals) {
			if(decimals === undefined)
				decimals = 2;
			if(!number) return 0;
			return number.toFixed(decimals);
		}
	}).filter('camelCase', function() {
		return function(string, separator) {
			if(!string) return string;
			return string.split(separator || ' ').map(function(s) {
				return s.substr(0, 1).toUpperCase() + s.substr(1);
			}).join(separator || ' ');
		};
	}).filter('toReadable', function() {
		return function(number, spacer) {
			if(spacer === undefined) spacer = ' ';

			if(!number) return number;

			var result = "";
			number = number.toString();
			for(var i = 0; i < number.length; i++) {
				if(i && !(i % 3)) result = spacer + result;
				result = number[number.length - i - 1] + result;
			}

			return result;
		};
	}).filter('toGeneral', function() {
		return function(number, precision) {
			if(!number) return 0;
			var high = Math.pow(10, precision);
			var low = Math.pow(10, precision - 1);
			var difference = 0;
			while(number > high) { difference++; number = number / 10; }
			while(number < low) { difference--; number = number * 10; }
			number = Math.round(number)
			while(number > 0 && !(number % 10)) { difference++; number = number / 10; }
			number = number * Math.pow(10, difference);
			if(difference < 0)
				number = number.toFixed(-difference);
			return number;
		};
	}).filter('niceBytes', function() {
		var suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

		return function(bytes) {
			var magnitude = 0;
			while(bytes >= 1024) {
				magnitude++;
				bytes = Math.round(bytes / 1024);
			}
			return Math.round(bytes) + ' ' + suffixes[magnitude];
		};
	}).filter('niceNumber', function() {
		var suffixes = ['', 'k', 'M', 'B', 'T'];

		return function(bytes) {
			var magnitude = 0;
			var tmp = bytes;
			while(tmp >= 1000) {
				magnitude++;
				tmp = Math.round(tmp / 1000);
			}

			return (bytes / Math.pow(1000, magnitude)) + ' ' + suffixes[magnitude];
		};
	}).filter('clamp', function() {
		return function(value, min, max) {
			return Math.min(Math.max(value, min), max);
		};
	}).filter('sum', function() {
		return function(array, property) {
			if(property)
				array = _.pluck(array, property);
			return _.reduce(array, function(sum, value) {
				sum += value;
				return sum;
			});
		};
	});