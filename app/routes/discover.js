'use strict';

// Main page routes
module.exports = function(app) {
	var discover = require('../../app/controllers/discover');
	app.get('/discover/get/:offset?', discover.getList);
	app.get('/discover/search/:offset?', discover.getSearch);
};

