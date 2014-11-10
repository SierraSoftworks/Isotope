/*jslint node: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
var express = require('express'),
    Isotope = require('libisotope');

var app = express(),
    isotope = new Isotope("/dev/ttyAMA0");

app.use(express.static('public'));
app.use(require('body-parser').json());

app.use(function(req, res, next) {
	console.log('%s - %j', req.url, req.body);
	return next();
});

app.post('/api/mouse', function(req, res) {
    isotope.mouse.move(req.body.x || 0, req.body.y || 0);
    isotope.mouse.scroll(req.body.scroll || 0);
    ['left', 'right', 'middle'].forEach(function(key) {
        if(req.body.key)
            isotope.mouse.press(Isotope.mouse[key]);
        else
            isotope.mouse.release(Isotope.mouse[key]);
    });

    isotope.mouse.now();
    if(req.body.release)
        isotope.mouse.releaseAll.now();
    return res.status(200).end();
});

app.post('/api/keyboard', function(req, res) {
    isotope.keyboard.releaseAll;
    (req.body.keys || []).forEach(function(key) {
        if(Isotope.keyboard.keys[key])
            isotope.keyboard.press(Isotope.keyboard.keys[key]);
        else
            return res.status(400).json({ error: 'Invalid Key Code', message: "The key code '" + key + "' could not be found in the list of available keys. Please check it and try again." });
    });

    (req.body.modifiers || []).forEach(function(key) {
        if(Isotope.keyboard.modifiers[key])
            isotope.keyboard.pressModifiers(Isotope.keyboard.modifiers[key]);
        else
            return res.status(400).json({ error: 'Invalid Modifier Key Code', message: "The modifier key code '" + key + "' could not be found in the list of available keys. Please check it and try again." });
    });

    isotope.keyboard.now();
    if(req.body.release)
        isotope.keyboard.releaseAll.now();
	console.log(isotope.buffer);
    return res.status(200).end();
});

app.post('/api/write', function(req, res) {
    if(typeof req.body.text != 'string')
        return res.status(400).json({ error: 'Invalid Value', message: "Expected a string to be provided as the body's text, but got " + typeof req.body + " instead." });

    isotope.keyboard.write(req.body.text);
    return res.status(200).end();
});

app.get('/api/*', function(req, res) {
    return res.status(404).json({ error: 'Not Found', message: "We could not find the API method you requested, please check that it is correct and try again" });
});

app.get('*', function(req, res) {
    return res.sendFile('public/index.html', { root: __dirname });
});

isotope.on('error', function(err) {
    console.error('Failed to instantiate Isotope instance:\n%s\n\n%s', err.message, err.stack);
	process.exit(1);
});

isotope.on('open', function() {
    console.log('Isotope connected, listening on http://127.0.0.1:%d', process.env.port || 3000);
    app.listen(process.env.port || 3000);
});
