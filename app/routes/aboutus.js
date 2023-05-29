'use strict';

// Article Routes
module.exports = function(app) {
	var aboutus = require('../../app/controllers/aboutus');

	app.get('/aboutus', function(req,res) {
		res.redirect('/#!/aboutus');
	});
	app.get('/faq', function(req,res) {
		res.redirect('/#!/faq');
	});
};

