var express = require('express'),
    Isotope = require('libisotope');

var app = express();

app.use(express.static('public'));
app.use(require('body-parser').json());

app.get('/api/mouse', function(req, res) {
    ['left', 'right', 'middle'].forEach(function(key) {

    });

    return res.status(200).end();
});

app.get('/api/keyboard', function(req, res) {
    (req.body.keys || []).forEach(function(key) {
        if(!Isotope.keyboard.keys[key])
            return res.status(400).json({ error: 'Invalid Key Code', message: "The key code '" + key + "' could not be found in the list of available keys. Please check it and try again." });
    });

    (req.body.modifiers || []).forEach(function(key) {
        if(!Isotope.keyboard.modifiers[key])
            return res.status(400).json({ error: 'Invalid Modifier Key Code', message: "The modifier key code '" + key + "' could not be found in the list of available keys. Please check it and try again." });
    });

    return res.status(200).end();
});

app.get('/api/write', function(req, res) {
    if(typeof req.body != 'string') return res.status(400).json({ error: 'Invalid Value', message: "Expected a string to be provided as the argument body, but got " + typeof req.body + " instead." });

    return res.status(200).end();
});

app.get('/api/*', function(req, res) {
    return utils.errors.not_found(req, res);
});

app.get('*', function(req, res) {
    return res.sendFile('public/index.html', { root: process.cwd() });
});

app.listen(process.env.port || 3000);
