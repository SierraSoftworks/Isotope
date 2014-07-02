var Isotope = require('isotope'),
	http = require('http'),
	url = require('url');

var isotope = new Isotope("/dev/ttyAMA0");

http.createServer(function(req, res) {
	var req.url = url.parse(req.url, true);

	var page = [
		'<html>'
			'<head><title>Isotope Test</title></head>',
			'<body>',
				'<form method="GET">',
					'<textarea name="text" placeholder="Enter Text"/>',
					'<button type="submit">Type</button>', 
				'</form>',
			'</body>',
		'</html>'
	].join("\n");

	if(req.url.search) isotope.keyboard.write(req.url.query.text);
	return res.end(page);

}).listen(3000);