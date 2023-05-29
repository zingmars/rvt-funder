'use strict';

/**
 * Profile page's controller
 */
var db = require('../../config/sequelize');
/*var USERS = "public/img/users";
var PROJECTS = "public/img/projects";
var IMAGE_TYPES = ['image/jpeg', 'image/png'];*/

exports.getProfile = function(req, res) {
	getUserData(2, req.params.id, function(response) {
		res.send(response);
	});
};
exports.getProfileForEditing = function(req, res) {
	getUserData(1, req.user.id, function(response) {
		res.send(response);
	});
};
exports.saveProfileData = function(req, res) {		
	db.UserProfile.findOne({where: {UserId: req.user.id}}).then(function(profile) {		
		switch(req.body.type) {
			case "username": {
				profile.name = req.body.value;				
				break;
			}
			case "biography": {
				profile.bio = req.body.value;
				break;
			}
			case "location": {				
				var countryCode = parseInt(req.body.value);
				if(isNaN(countryCode)) {
					res.status(400).send("Failure");
				} else {
					profile.country = countryCode;					
				}
				break;
			}
			case "areaCode": {
				var areaCode = parseInt(req.body.value);
				if(isNaN(areaCode)) {
					res.status(400).send("Failure");
				} else {
					profile.areacode = areaCode;					
				}				
				break;
			}
			case "zipCode": {
				profile.zip = req.body.value;
				break;
			}
			case "phone": {
				profile.phone = req.body.value;
				break;
			}
			case "address": {
				profile.address = req.body.value;
				break;
			}			
			default: {
				res.status(400).send("Failure");
				break;
			}
		}
		profile.save();
		res.send("Success");
	});
};
exports.uploadProfilePicture = function(req, res) {
	console.log(req.body, req.files);
	
/*	var input;
	var output;
	var targetPath;
	var targetName;
	var tempPath = req.files.image.path;
	var type = 
    if (IMAGE_TYPES.indexOf(type) == -1) {
      return res.send(415, 'Supported image formats: jpeg, jpg, jpe, png.');
	}*/
	res.send("Request received");
};
exports.saveProfileWebsite = function(req, res) {
	// Check URL
	// TODO: Do a more detailed check	
	if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(req.body.value)) {
		if (req.body.id !== undefined && req.body.id !== 0) {
			db.UserWebsite.findOne({where: {id: req.body.id, UserId: req.user.id}}).then(function (website) {
				website.URI = req.body.value;
				website.save().then(function () {
					res.send("Success");					
				});
			});
		} else {
			var website = db.UserWebsite.build();
			website.URI = req.body.value;
			website.UserId = req.user.id;
			website.save().then(function () {
				res.send({id: website.id});
			});
		}		
	} else {
		res.status(400).send("Failure");
	}
	//
};
exports.saveProfileSocialNetwork = function(req, res) {	
	if(req.body.id !== undefined && req.body.id !== 0) {
		db.UserSocialProfile.findOne({where: {id: req.body.id, UserId: req.user.id}}).then(function (network) {
			network.network = req.body.network;
			network.username = req.body.username;
			network.URI = generateNetworkURL(req.body.network, req.body.username);
			network.save().then(function () {
				res.send("Success");				
			});
		});
	} else {
		var network = db.UserSocialProfile.build();
		network.network = req.body.network;
		network.username = req.body.username;
		network.URI = generateNetworkURL(req.body.network, req.body.username);
		network.UserId = req.user.id;
		network.save().then(function () {
			res.send({id: network.id});
		});
	}
	//res.status(400).send("Failure");
};

// Deletes
exports.deleteProfileWebsite = function(req, res) {	
	db.UserWebsite.findOne({where: {id: req.body.id, UserId: req.user.id}}).then(function(website) {
		if(website) {
			website.destroy();
			res.send("Success");		
		} else {
			res.status(400).send("Failure");			
		}
	});
};
exports.deleteProfileSocialNetwork = function(req, res) {
	db.UserSocialProfile.findOne({where: {id: req.body.id, UserId: req.user.id}}).then(function (network) {
		if(network) {
			network.destroy();
			res.send("Success");
		} else {
			res.status(400).send("Failure");
		}
	});
};

// Generate a full user's profile dump.	
function getUserData(type, userId, callback) {
	db.UserProfile.findOne({where: { UserId: userId }}).then(function(profile) {		
		var userProfile = {};
		
		profile.dataValues.image = profile.avatarid+".png";	
		if (type === 2){ // Remove information that the viewer doesn't need to know from the request.
			delete profile.dataValues.avatarid;
			delete profile.dataValues.UserId;
			delete profile.dataValues.updatedAt;
			delete profile.dataValues.id;		
		}

		userProfile.profile = profile;
		db.UserSocialProfile.findAll({ where: {UserId: userId}}).then(function(socialProfile) {
		if(type === 2) {
			socialProfile.forEach(function (element) {
				delete element.dataValues.UserId;
				delete element.dataValues.createdAt;
				delete element.dataValues.updatedAt;
				delete element.dataValues.id;
			});
		}
		userProfile.socialNetworks = socialProfile;

			db.UserWebsite.findAll({ where: {UserId: userId}}).then(function(userWebsites) {
				if(type === 2) {
					userWebsites.forEach(function (element) {
						delete element.dataValues.UserId;
						delete element.dataValues.createdAt;
						delete element.dataValues.updatedAt;
						delete element.dataValues.id;
					});
				}
				userProfile.websites = userWebsites;
				callback(userProfile);
			});
		});			
	});
}

// Generate social network URL
function generateNetworkURL(network, username) {
	switch(network) {
		case "facebook": {
			return "https://www.facebook.com/" + username;
		}
		case "twitter": {
			return "https://www.twitter.com/" + username;			
		}
		case "vk": {
			return "https://vk.com/" + username;			
		}
		case "google": {
			return "https://plus.google.com/+" + username;			
		}
		case "draugiem": {
			return "https://www.draugiem.lv/" + username;			
		}
		case "youtube": {
			return "https://www.youtube.com/user/" + username;			
		}
		default: return null;
	}
}