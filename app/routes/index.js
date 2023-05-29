'use strict';

// Main page routes
module.exports = function(app) {
	var index = require('../../app/controllers/index');
	app.get('/', index.render);
	app.get('/home', index.render);
	app.get('/support', function (req, res, next) {
		var redirectURL = 'http' + (req.connection.encrypted ? 's' : '') + '://' + 'support.' + req.headers.host + '/';

		res.statusCode = 301;
		res.setHeader('Location', redirectURL);
		res.write('301 MOVED');
		res.end();
	});
};

