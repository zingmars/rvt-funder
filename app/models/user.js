'use strict';

/**
 * User Model
 */
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', 
		{
			active: DataTypes.BOOLEAN,			
			email: DataTypes.STRING,			
			emailConfirmed: DataTypes.BOOLEAN,			
			hashedPassword: DataTypes.STRING,
			salt: DataTypes.STRING, 
			verified: DataTypes.BOOLEAN,
			privlvl: DataTypes.INTEGER,
			timezone: DataTypes.INTEGER,
			language: DataTypes.ENUM('English', 'Latvian')
		},
		{
			instanceMethods: {
				toJSON: function () {
					var values = this.get();
					delete values.hashedPassword;
					delete values.salt;
					return values;
				},
				toIndex: function() {
					//console.log(this);
					var values = this.get();

					return {
						id: values.id,
						name: "User",						
						email: values.email,
						registrationDate: values.createdAt,
					};
				},
				makeSalt: function() {
					return crypto.randomBytes(16).toString('base64'); 
				},
				authenticate: function(plainText){
					return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
				},
				encryptPassword: function(password, salt) {
					if (!password || !salt) {
                        return '';
                    }
					salt = new Buffer(salt, 'base64');
					return crypto.pbkdf2Sync(password, salt, 100000, 64).toString('base64');
				},				
			},
			associate: function(models) {				
				//1:1								
				User.hasOne(models.UserProfile);
				User.hasOne(models.UserNewsletterState);
			}
		}
	);

	return User;
};
