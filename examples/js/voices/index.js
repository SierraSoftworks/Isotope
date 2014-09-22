var PocketSphinx = require('pocketsphinx'),
	express = require('express'),
	socket_io = require('socket.io'),
	http = require('http');

var app = express();
app.get('/', function(req, res) { return res.sendFile('index.html'); });


var server = http.Server(app),
	io = socket_io(server);

io.on('connection', function(socket) {
	var sphinx = new PocketSpinx();
	sphinx.on('utterance', function(phrase, id, score) {
		socket.emit('utterance', { phrase: phrase, id: id, score: score });
	});

	socket.on('audio', function(data) {
		sphinx.write(data);
	});
});

server.listen(process.env.port || 3000, function() {
	console.log('Listening on port %d', process.env.port || 3000);
});