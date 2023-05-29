'use strict';

/**
 * Account related CRUD functions.
 */
var db = require('../../config/sequelize');
var mail = require('../../config/nodemailer');
var fs = require('fs');

/**
 * Log in
 */
exports.signin = function (req, res) {    	
	if(req.body.rememberme) {
		req.session.cookie.maxAge = 1000*60*60*24*14;
	}

	var userData = {
		name: req.user.name,		
	};	
	res.send(userData);
};

/**
 * Register a user
 */
exports.signup = function(req, res, next) {        
	//Check if user with that name already exists
	db.User.find({where : { email: req.body.email }}).then(function(dbUser){
		if (!dbUser) {          
			//Check if the email is valid
			var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
			if(re.test(req.body.email)) {
				// Build a new user
				var user = db.User.build(req.body);
				user.active = true;
				user.verified = false;
				user.emailConfirmed = false;
				user.privlvl = 0;
				user.timezone = 0;
				user.language = "English";				
				user.salt = user.makeSalt();
				user.hashedPassword = user.encryptPassword(req.body.password, user.salt);        				
				user.save().then(function(){
					// Generate his profile
					var profile = db.UserProfile.build();
					profile.bio = "Newbie";
					profile.UserId = user.id;
					profile.avatarid = user.id;
					profile.name = req.body.name;
					profile.save().then(function() {
						var tomorrow = new Date();
						tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
						
						var confirmationToken = db.UserVerificationToken.build();			
						confirmationToken.verificationCode = confirmationToken.createToken();
						confirmationToken.type = "email";
						confirmationToken.expiration = tomorrow;
						confirmationToken.UserId = user.id;
						confirmationToken.save();

						//signupEmail(req.body.email, confirmationToken.verificationCode);					

						// Create a blank avatar.
						// TODO: Error handling
						fs.createReadStream('public/img/users/blank_avatar.png').pipe(fs.createWriteStream('public/img/users/'+user.id+'.png'));
						req.login(user, function(err){
							if(err) {
								return next(err);
							}
							res.send("Success");
						});						
					});
				});
			} else {
				throw "Invalid email";
			}
		}
		else {
			throw "Already exists";
		}
	}).catch(function(err){
		res.status(400).send(err);              
	});
};

/**
 * Logout
 */
exports.signout = function(req, res) {
	console.log(mail);
	req.logout();
	req.session.destroy();
	res.redirect('/');
};

/**
* Password reset
*/
exports.resetPassword = function(req, res) {	
	db.User.find({where: { email: req.body.email }}).then(function(dbUser) {
		if(!dbUser) {
			throw "Username not found";
		} else {
			var tomorrow = new Date();
			tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);

			var resetToken = db.UserVerificationToken.build();			
			resetToken.verificationCode = resetToken.createToken();
			resetToken.type = "password";
			resetToken.expiration = tomorrow;
			resetToken.UserId = dbUser.id;

			resetToken.save().then(function (err) {
				res.send("Success");
			});
		}
	}).catch(function(err) {
			res.status(400).send(err);
	});
};
exports.changePassword = function(req, res) {	
	db.User.find({where: { email: req.body.email }}).then(function (dbUser) {
		if(!dbUser) {
			throw "Error";
		}
		db.UserVerificationToken.find({where: { UserId: dbUser.id, verificationCode: req.body.resetcode }}).then(function (resetToken) {
			if(!dbUser || !resetToken) {
				throw "Error";
			} else {
				//TODO: Error handling
				var now = new Date();
				if(now < resetToken.expiration) {
					if(req.isAuthenticated()) {
						req.logout();
					}
					dbUser.emailConfirmed = true;
					dbUser.salt = dbUser.makeSalt();
					dbUser.hashedPassword = dbUser.encryptPassword(req.body.password, dbUser.salt);        
					dbUser.save();	
					resetToken.destroy();					
					res.send("Success");
				} else {
					throw "Error";
				}
			}			
		}).catch(function(err){
			res.status(400).send(err);
		});		
	}).catch(function(err) {			
		res.status(400).send(err);
	});
};

/**
 * Delete account
 */
exports.deleteAccount = function(req, res) {
	// TODO: Delete account and everything associated with it. Only allow this to happen if account has no payments or rewards.
	// TODO: If user has an active email address, a request should be sent to the email first.	
	// TODO: If manage cascading using sequelize instead of deleting data manually.
	db.User.findOne({where: { email: req.body.email }}).then(function (dbUser) {		
		if(!dbUser || req.user.email !== req.body.email) {
			throw "Username not found";
		}
		db.Fundraiser.findAll({where: {UserId: dbUser.id}}).then(function (fundraisers) {
			if(fundraisers.length !== 0) {
				throw "Could not delete user, user has fundraising campaigns or rewards associated to him";
			} else {
				db.UserProfile.findOne({where: {UserId: dbUser.id}}).then(function (profile) {
					db.UserSocialProfile.findAll({where: {UserId: dbUser.id}}).then(function (socialNetworkProfiles) {
						db.UserVerificationToken.findAll({where: {UserId: dbUser.id}}).then (function (verificationTokens) {
							db.UserWebsite.findAll({where: {UserId: dbUser.id}}).then(function (websites) {
								req.logout();

								// Destroy ALL the entries
								websites.forEach(function (website) {
									website.destroy();
								});
								verificationTokens.forEach(function (token) {
									token.destroy();
								});
								socialNetworkProfiles.forEach(function (networkProfile) {
									networkProfile.destroy();
								});
								
								profile.destroy();
								dbUser.destroy();

								res.send("Success");
							});
						});
					});
				});				
			}
		});		
	}).catch(function (err) {
		res.status(400).send(err);
	});
};

/**
 * Check user auth status
 */
exports.checkAuth = function(req, res) {
	if (!req.isAuthenticated()) {
		return res.status(401).send('Unauthorised');
	} else {
		return res.send(req.user.email);
	}
};

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send('User is not authorized');
	}
	next();
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
	db.User.find({where : { id: id }}).then(function(user){
		if (!user) {
			return next(new Error('Failed to load User ' + id));
		}
		req.profile = user;
		next();
	}).catch(function(err){
		next(err);
	});
};


/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.profile.id !== req.user.id) {
		return res.status(401).send('User is not authorized');
	}
	next();
};

/**
 * E-mail generators
 */
function signupEmail(email, verificationCode) {
	var URL = "";
	var title = "E-mail verification for " + email;
	var contents = 'Please click here to confirm your e-mail address: <a href="'+URL+'">Verify</a>';
	mail.send(mail.transporter, email, title, contents);
}
function passwordResetEmail(email, verificationCode) {
	var URL = "";
	var title = 'Password reset requested for ' + email;
	var contents = 'A password reset has been requested for your account. To reset your password click <a href="'+URL+'">here</a>.<br> If you didn\'t request this reset, feel free to ignore this message.';
	mail.send(mail.transporter, email, title, contents);
}
function passwordChangeEmail(email) {	
	var passwordResetURL = "";
	var title = 'Password has been changed for ' + email;
	var contents = 'Your password has been changed. If you did not request this change please click <a href="'+passwordResetURL+'">here</a>';
	mail.send(mail.transporter, email, title, contents);
}
function deletionEmail(email, verificationCode) {
	var URL = "";
	var title = 'Account deletion has been requested for ' + email;
	var contents = 'Account deletion has been requested for your account. To confirm deletion please click <a href="'+URL+'">here</a>. Note that doing so will delete your account completely.';
	mail.send(mail.transporter, email, title, contents);
}