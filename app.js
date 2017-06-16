var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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
	})

	app.get("/password/encrypt", function(req, res, next){
		res.render('password-encrypt', {});
	})

	// Running the web server
	var server = app.listen(3000, function() {
	    var port = server.address().port;
	    console.log('Express server listening on port %s.', port);
	});
}); 