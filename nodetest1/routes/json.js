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
				var returnObj = {};
				returnObj.id = data._id;
				returnObj.labels = data.labels;
				res.json(returnObj);
			});
	}
	else {
		console.log('error finding user in session');
	}
});

router.post('/save/:id', function(req, res) {
	//console.dir(req.body);
	//console.dir(req.body.labels);
	//console.dir(req.params.id)

	if (req.db && req.session.user._id === req.params.id) {
		if (req.body) {
			req.db.get('usercollection').update(
						{ _id: req.params.id },
						{ $set: { labels: req.body.labels } },
						function(err) {
							if (err)
								console.log('error saving labels to db');
						}
					);
		}
	}
	else {
		console.log('insufficient permission for db access request');
	}
});

module.exports = router;