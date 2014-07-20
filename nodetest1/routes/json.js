var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/mynotebook', function(req, res) {
	if (req.db && req.session.user) {
		req.db.get('usercollection').findOne(
			{ '_id': req.session.user._id },
			function(err, data) {
				if (err) {
					console.log('error finding user');
					return;
				}
				res.json(data.labels);
			});
	}
	else {
		console.log('error finding user in session');
	}
});

module.exports = router;