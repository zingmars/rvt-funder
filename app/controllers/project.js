'use strict';

/**
 * Contains methods for getting project data
 */
var db = require('../../config/sequelize');
exports.getProjectData = function(req, res) {
	db.Fundraiser.findOne({where: {id: req.params.id}}).then(function(project) {
		if(project){			
			if(!project.isOngoing && (req.user === undefined || project.UserId !== req.user.id)) {
				res.status(400).send("incorrectid");
			}
			delete project.dataValues.projectType;
			delete project.dataValues.isVerified;
			delete project.dataValues.isApproved;
			delete project.dataValues.isActive;
			delete project.dataValues.isDeleted;			
			delete project.dataValues.isPaidOut;
			delete project.dataValues.successfulMessage;
			delete project.dataValues.successfulVideoURI;
			delete project.dataValues.createdAt;
			delete project.dataValues.updatedAt;

			db.UserProfile.findOne({where: {id: project.UserId}}).then(function(owner) {
				var UserInfo = {
					owner_name: owner.name,
					owner_country: owner.country,
					owner_avatar: owner.avatarid
				};
				var extend = require('util')._extend;
				extend(project.dataValues, UserInfo);
				res.send(project);
			});
		} else {
			res.status(400).send("incorrectid");
		}
	});
};

/*exports.handlePayment = function(req, res) {
};
exports.getComments = function(req, res) {
};
exports.getArticles = function(req, res) {
};
exports.getArticleComments = function(req, res) {
};
exports.saveComment = function(req, res) {
};
exports.saveArticle = function(req, res) {
};
exports.saveArticleComment = function(req, res) {
};*/