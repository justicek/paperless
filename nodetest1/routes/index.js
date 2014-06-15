var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page */
router.get('/', function(req, res) {
	if (!req.session.user)
  		res.redirect('/login');
  	else {
  		res.redirect('/home');
  	}
});

/* GET login page */
router.get('/login', function(req, res) {
  	res.render('login', {});
});

/* POST login */
router.post('/login', passport.authenticate('local'),
	function(req, res) {
		// store user object into session
		if (req.session) {
			req.session.user = req.user;
		}
		res.redirect('/home');
	}
);

/* GET home page */
router.get('/home', function(req, res) {
	res.render('home', {
		title: 'paperless',
		user: req.session.user
	});
});

/* GET new note page */
router.get('/new', function(req, res) {
	res.render('new', {});
});

/* POST new note */
// todo //

/* GET control panel page */
router.get('/cp', function(req, res) {
	// todo //
});

module.exports = router;
