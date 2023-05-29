'use strict';

/**
 * Main page's controller.
 */
exports.render = function(req, res) {		
    res.render('index', {
    	user: req.user ? JSON.stringify(req.user.toIndex()) : "null",
        title: 'crowdfunding for your projects!'
    });
};
