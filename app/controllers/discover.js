'use strict';

/**
 * Project list
 */
var db = require('../../config/sequelize');

// Get a list of active projects
// TODO: Fine tune the selection mechanism to have some sort of favouritism.
exports.getList = function(req, res) {
	// Pagination
	var offset = 0;
	if (req.params.offset !== undefined && !isNaN(parseInt(offset))) {		
		offset = parseInt(req.params.offset);		
	}

	db.Fundraiser.findAndCountAll({
		where: {
			isOngoing: {
				$not: false
			},
			isVerified: {
				$not: false
			},
			isApproved: {
				$not: false
			},
			isActive: {
				$not: false
			}
		},
		offset: offset,
		limit: 10,
	}).then(function(list) {
		res.send(filterData(list));
	});	
};

// Get a list of search results
exports.getSearch = function(req, res) {
	// Pagination
	var offset = 0;
	if (req.params.offset !== undefined && !isNaN(parseInt(offset))) {		
		offset = parseInt(req.params.offset);		
	}

	var terms = req.query.string;
	db.Fundraiser.findAndCountAll({
		where: {
			name: {
				$like: terms+"%"
			},
			isOngoing: {
				$not: false
			},
			isVerified: {
				$not: false
			},
			isApproved: {
				$not: false
			},
			isActive: {
				$not: false
			}
		},
		offset: offset,
		limit: 10,
	}).then(function(list) {		
		res.send(filterData(list));
	});
};

function filterData(list) {
	var response = [];
	var projectsLeft = list.count;
	
	// Filter out unneeded data
	list.rows.forEach(function(project) {
	var projectData = {};
		projectData.id = project.dataValues.id;
		projectData.name = project.dataValues.name;
		projectData.nsfw = project.dataValues.nsfw;
		projectData.description = project.dataValues.shortDescription;
		projectData.category = project.dataValues.category;
		projectData.expireDate = project.dataValues.expireDate;
		// TODO: Project image
		projectData.image = project.dataValues.id+".png";
		projectData.projectsLeft = --projectsLeft;

		response.push(projectData);
	});

	return response;
}