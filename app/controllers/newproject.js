'use strict';

/**
 * Contains methods for creating a new project.
 */
var db = require('../../config/sequelize');
var fs = require('fs');

exports.checkActiveProjects = function(req, res) {
	db.Fundraiser.findOne({where: {UserId: req.user.id, isVerified: false, isDeleted: false, isApproved: false}}).then(function(project) {
		if(project) {			
			res.send(sanitiseProjectObject(project.dataValues));
		} else {
			var fundraiser = db.Fundraiser.build();			
			fundraiser.name = "";
			fundraiser.nsfw = false;
			fundraiser.goal = 100;
			fundraiser.shortDescription = "";
			fundraiser.longDescription = "";
			fundraiser.category = "undefined";
			fundraiser.projectType = "fundraising";
			fundraiser.expireDate = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000);
			fundraiser.isVerified = false;
			fundraiser.isApproved = false;
			fundraiser.isActive = false;
			fundraiser.isDeleted = false;
			fundraiser.isOngoing = false;
			fundraiser.isPaidOut = false;
			fundraiser.successfulMessage = "";
			fundraiser.successfulVideoURI = "";
			fundraiser.UserId = req.user.id;
			fundraiser.save().then(function () {				
				res.send(sanitiseProjectObject(fundraiser.dataValues));
			});
		}
	});
};
exports.saveProjectField = function(req, res) {
	db.Fundraiser.findOne({where: {UserId: req.user.id, isVerified: false, isDeleted: false, isApproved: false}}).then(function (project) {
		if(project) {
			switch(req.body.type) {
				case "project-name": {
					project.name = req.body.value;
					break;
				}
				case "nsfw": {
					project.nsfw = req.body.value;
					break;
				}
				case "project-shortDesc": {
					project.shortDescription = req.body.value;
					break;
				}
				case "expire-date": {
					var date = req.body.value.split('/');
					for(var iii=0; iii < date.length; iii++) {
						date[iii] = parseInt(date[iii]);
					}
					project.expireDate = new Date(date[2], date[1]-1, date[0], 3, 59, 59);					
					// Lessions learned from implementing this function - 
					// 1) JavaScript's Date function for whatever idiotic reason indexes months starting from 0, while dates - from 1.
					// 2) There are 26 hours in a day (???????????)
					// 3) The Date function doesn't actually turn strings into Ints, and will choke on leading zeroes as far as months are concerned
					// TODO: I should probably wrap this in a try catch block... Damn.
					break;
				}
				case "project-category": {
					project.category = req.body.value;
					break;
				}				
				case "newproject-text": {
					project.longDescription = req.body.value;
					break;					
				}
				case "successfulMessage": {
					project.successfulMessage = req.body.value;
					break;
				}
				case "successfulVideoURI": {
					project.successfulVideoURI = req.body.value;
					break;
				}
				case "goal": {
					var value = parseFloat(req.body.value).toFixed(2);
					if(value < 0) {
						res.status(400).send("invalidamount");
						return;
					}
					project.goal = parseFloat(req.body.value).toFixed(2);
					break;
				}
				default: {
					res.status(400).send("invalidfield");
				}
			}
			project.save().then(function () {res.send("Success");});
		} else {
			res.status(400).send("invalidproject");
		}
	});
};
exports.activateProject = function(req, res) {
	db.Fundraiser.findOne({where: {UserId: req.user.id, isActive: true, isVerified: false, isDeleted: false, isApproved: false}}).then(function(project) {
		if(project) {
			project.isVerified = true;
			project.isApproved = true;
			project.save().then(function () {
				res.send("Success");
			});
		} else {
			res.status(400).send("invalidproject");
		}
	});
};
exports.deleteProject = function(req, res) {
	//TODO
	//Admin-only command
};
exports.finaliseProject = function(req, res) {
	db.Fundraiser.findOne({where: {UserId: req.user.id, isVerified: false, isDeleted: false, isApproved: false}}).then(function(project) {
		if(project) {
			project.isActive = true; //TODO: Rename it to isPublished
			project.save().then(function () {
				res.send("Success");
			});
		} else {
			res.status(400).send("invalidproject");
		}
	});
};
exports.publishProject = function(req, res) {
	db.Fundraiser.findOne({where: {UserId: req.user.id, isVerified: false, isDeleted: false, isApproved: false}}).then(function(project) {
		if(project) {
			project.isVerified = true;
			project.isApproved = true;
			project.isOngoing = true;
			project.save().then(function () {
				fs.createReadStream('public/img/projects/blank_project.png').pipe(fs.createWriteStream('public/img/projects/'+project.id+'.png'));
				res.send("Success");
			});
		} else {
			res.status(400).send("invalidproject");
		}
	});
};
exports.getGoals = function(req, res) {
	db.Fundraiser.findOne({where: {UserId: req.user.id, isVerified: false, isDeleted: false, isApproved: false}}).then(function(project) {
		if(project) {
			db.FundraiserGoal.findAll({where: {FundraiserId: project.id}}).then(function(goals) {
				res.send(goals);
			});		
		} else {
			res.status(400).send("invalidproject");
		}
	});
};
exports.setGoal = function(req, res) {
	db.Fundraiser.findOne({where: {UserId: req.user.id, isVerified: false, isDeleted: false, isApproved: false}}).then(function(project) {
		if(project) {
			db.FundraiserGoal.findOne({where: {FundraiserId: project.id, id: req.body.id}}).then(function(goal) {
				if(goal) {
					switch(req.body.type) {
						case "sum": {
							var value = parseFloat(req.body.value).toFixed(2);
							if(value < 0) {
								res.status(400).send("invalidamount");
								return;
							}
							goal.sum = parseFloat(req.body.value).toFixed(2);							
							break;
						}
						case "title": {
							goal.title = req.body.value; 
							break;
						}
						case "description": {
							goal.description = req.body.value; 
							break;
						}
						case "isReward": {
							goal.isReward = req.body.value; 
							break;
						}
						case "isLimitedAmount": {
							goal.isLimitedAmount = req.body.value; 
							break;
						}
						case "limitedAmountCount": {
							goal.limitedAmountCount = parseInt(req.body.value);
							break;
						}
						default: {
							res.status(400).send("invalidfield");
							return;
						}
					}
					goal.save().then(function () { res.send("Success");});
				} else {
					var newGoal = db.FundraiserGoal.build();
					newGoal.isReward = req.body.type;
					newGoal.save().then(function () {res.send(newGoal.id);});
				}
			});		
		} else {
			res.status(400).send("invalidproject");
		}
	});	
};

/* Sanitise the project object before returning it to client */
function sanitiseProjectObject(project) {
	delete project.isVerified;
	delete project.isApproved;
	delete project.isActive; 
	delete project.isDeleted;
	delete project.isOngoing;
	delete project.isPaidOut;
	delete project.projectType;	
	return project;
}