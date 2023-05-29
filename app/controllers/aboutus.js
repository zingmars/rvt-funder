'use strict';

/**
 * Controller for all the pages that describe this service. Used as a fallback for when Angular fails.
 */
var _ = require('lodash');

exports.aboutus = function(req, res) {
    res.aboutus('aboutus/aboutus', {        
        title: 'about us',
    });
}; 
exports.faq = function (req, res) {
	res.faq('aboutus/faq', {
		title: 'faq',
	});
};