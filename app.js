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
	res.render('base_caesar_shift_exercise', {'exercise_type': 'Encrypt',
				'next_route': '/caesar-shift/decrypt',
				'red': 40,
				'green': 40,
				'blue': 20,
				'opacity': 0.2});
});

app.get("/caesar-shift/decrypt", function(req, res, next){
	res.render('base_caesar_shift_exercise', {'exercise_type': 'Decrypt',
				'next_route': '/password/encrypt',
				'red': 80,
				'green': 20,
				'blue': 40,
				'opacity': 0.2})
});

app.get("/caesar-shift/sandbox", function(req, res, next){
	res.render('base_caesar_shift_exercise', {'exercise_type': 'Sandbox',
				'next_route': '',
				'red': 40,
				'green': 20,
				'blue': 40,
				'opacity': 0.2});
});

app.get("/password/encrypt", function(req, res, next){
	res.render('base_password_exercise', {'title': 'Vigenere Cipher Encryption',
				'exercise_type': 'Encrypt',
				'input_label': 'Plaintext',
				'output_label': 'Ciphertext',
				'next_route': '/password/decrypt',
				'red': 0,
				'green': 0,
				'blue': 100,
				'opacity': 0.2,
				js_source: true});
});

app.get("/password/decrypt", function(req, res, next){
	res.render('base_password_exercise', {'title': 'Vigenere Cipher Decryption',
				'exercise_type': 'Decrypt',
				'input_label': 'Ciphertext',
				'output_label': 'Plaintext',
				'next_route': '/enigma/encrypt',
				'red': 0,
				'green': 50,
				'blue': 50,
				'opacity': 0.2,
				js_source: true});
});

app.get("/password/sandbox", function(req, res, next){
	res.render('base_password_exercise', {'title': 'Vigenere Cipher Sandbox',
				'exercise_type': 'Sandbox',
				'input_label': 'Starting Text',
				'output_label': 'Ending Text',
				'red': 50,
				'green': 0,
				'blue': 50,
				'opacity': 0.2,
				js_source: true});
});

app.get("/enigma/encrypt", function(req, res, next){
	res.render('base_enigma_exercise', {'title': 'Enigma Machine Encryption',
				'image_path': '../images/password-sandbox.png',
				'exercise_type': 'Encrypt',
				'input_label': 'Plaintext',
				'output_label': 'Ciphertext',
				'next_route': '/enigma/decrypt'
				});
});

app.get("/enigma/decrypt", function(req, res, next){
	res.render('base_enigma_exercise', {'title': 'Enigma Machine Decryption',
				'image_path': '../images/password-sandbox.png',
				'exercise_type': 'Decrypt',
				'input_label': 'Ciphertext',
				'output_label': 'Plaintext',
				'next_route': '/'
				});
});

app.get("/enigma/sandbox", function(req, res, next){
	res.render('base_enigma_exercise', {'title': 'Enigma Machine Sandbox',
				'image_path': '../images/password-sandbox.png',
				'exercise_type': 'Sandbox',
				'input_label': 'Starting Text',
				'output_label': 'Ending Text',
				});
})

// Running the web server
var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s.', port);
});
