var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    nunjucks = require('nunjucks'),
    bodyParser = require('body-parser'),
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", function(req, res, next) {
	res.render('splash', {'unit_name': 'Enigma: An Introduction to Cryptography'});
});

app.get("/caesar-shift/encrypt", function(req, res, next) {
	res.render('encrypt', {});
});

app.get("/caesar-shift/decrypt", function(req, res, next){
	res.render('decrypt', {})
});

app.get("/caesar-shift/sandbox", function(req, res, next){
	res.render('caesar-sandbox', {});
});

app.get("/password/encrypt", function(req, res, next){
	res.render('base_password_exercise', {'title': 'Password Shift Encryption',
				'image_path': '../images/password_encrypt.png',
				'exercise_type': 'Encrypt',
				'input_label': 'Plaintext',
				'output_label': 'Ciphertext',
				'next_route': '/password/decrypt',
				js_source: true});
});

app.get("/password/decrypt", function(req, res, next){
	res.render('base_password_exercise', {'title': 'Password Shift Decryption',
				'image_path': '../images/password-sandbox.png',
				'exercise_type': 'Decrypt',
				'input_label': 'Ciphertext',
				'output_label': 'Plaintext',
				'next_route': '/', //To be changed
				js_source: true});
});

app.get("/password/sandbox", function(req, res, next){
	res.render('base_password_exercise', {'title': 'Password Shift Sandbox',
				'image_path': '../images/password-sandbox.png',
				'exercise_type': 'Sandbox',
				'input_label': 'Starting Text',
				'output_label': 'Ending Text',
				js_source: true});
});

// Running the web server
var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s.', port);
});
