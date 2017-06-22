var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    nunjucks = require('nunjucks'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// var env = nunjucks.configure('views', {
//     autoescape: true,
//     express: app
// });

MongoClient.connect('mongodb://localhost:27017/movie_information', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

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
					js_source: true,
					'instructions': "Write your own <strong>plaintext message of at least 5 \
									letters</strong> and <strong>password of at least 5 letters\
									</strong> such that the encrypted text is composed of all \
									<strong>unique letters</strong> (i.e. no letter is in the \
									encrypted text twice)!"});
	});

	app.get("/password/sandbox", function(req, res, next){
		res.render('base_password_exercise', {'title': 'Password Shift Sandbox',
					'image_path': '../images/password-sandbox.png',
					'exercise_type': 'Sandbox',
					'input_label': 'Starting Text',
					'output_label': 'Ending Text',
					js_source: true,
					'instructions': 'pass'});
	});

	// Running the web server
	var server = app.listen(3000, function() {
	    var port = server.address().port;
	    console.log('Express server listening on port %s.', port);
	});
}); 