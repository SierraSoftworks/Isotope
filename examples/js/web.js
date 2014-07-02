var Isotope = require('libisotope'),
	http = require('http'),
	url = require('url');

var isotope = new Isotope("/dev/ttyAMA0");

http.createServer(function(req, res) {
	req.url = url.parse(req.url, true);

	var page = [
		'<html>',
			'<head><title>Isotope Test</title></head>',
			'<body>',
				'<p>Enter some text, press Type and it will be typed in 5 seconds</p>',
				'<form method="GET">',
					'<textarea name="text" placeholder="Enter Text"/>',
					'<button type="submit">Type</button>', 
				'</form>',
			'</body>',
		'</html>'
	].join("\n");

	if(req.url.search) setTimeout(function() { isotope.keyboard.write(req.url.query.text); }, 5000);
	return res.end(page);
}).listen(3000);