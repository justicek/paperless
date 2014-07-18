var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET index page */
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

/* GET control panel page */
router.get('/cp', function(req, res) {
	res.render('cp', {
		sessionuser: req.session.user
	});
});

/* POST control panel page */
router.post('/cp', function(req, res) {
	var prevUsername = req.session.user.username;

	var user = req.session.user;
	user.username = req.body.username;
	user.email = req.body.email;

	req.db.get('usercollection').update(
		{ username: prevUsername },
		{ 
			$set: {	username: user.username,
					email: user.email,
					password: user.password }
		}, function(err, doc) {		// todo: replace with real error handling
			if (err) {
				console.log('error updating the database');
			}
			else {
				console.log('database successfully updated');
			}
		}
	);
	res.redirect('/cp');
});

module.exports = router;
