'use strict';

// Project's routes.
var multipartMiddleware = require('../../config/middlewares/multipart');

module.exports = function(app) {
	var profile = require('../../app/controllers/profile');
	app.get("/profile/get/:id", profile.getProfile);
	app.get("/profile/edit", profile.getProfileForEditing);
	
	app.post("/profile/save", profile.saveProfileData);
	app.post("/profile/save/website", profile.saveProfileWebsite);
	app.post("/profile/delete/website", profile.deleteProfileWebsite);
	app.post("/profile/save/socialNetwork", profile.saveProfileSocialNetwork);
	app.post("/profile/delete/socialNetwork", profile.deleteProfileSocialNetwork);	
	app.post("/profile/upload/picture", multipartMiddleware, profile.uploadProfilePicture);
};