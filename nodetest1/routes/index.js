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

/* GET logout page */
router.get('/logout', function(req, res) {
	res.render('logout', {});
})

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
		sessionuser: req.session.user
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
	res.render('cp', {
		sessionuser: req.session.user
	});
});

/* POST control panel page */
router.post('/cp', function(req, res) {
	var prevUsername = req.body.hiddenfield;
	var user = {};
	user.username = req.body.username;
	user.email = req.body.email;
	user.password = req.body.password;
		

	req.db.get('usercollection').update(
		{ username: prevUsername },
		{ username: user.username,
		  email: user.email,
		  password: user.password },
		{ upsert: false }
	);

	res.render('cp', {
		sessionuser: user
	});
});

module.exports = router;

// route middleware
function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next;

	res.redirect('/');
}
