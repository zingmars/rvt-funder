'use strict';

var crypto = require('crypto');
/**
 * Table that stores e-mail verification, password and account deletion tokens.
 */
module.exports = function(sequelize, DataTypes) {
	var UserVerificationToken = sequelize.define('UserVerificationToken', {
			verificationCode: {
				type: DataTypes.STRING,
				primaryKey: true
			},
			type: DataTypes.ENUM('password', 'email', "deletion"),
			expiration: { 
				type: DataTypes.DATE,
				allowNull: false,				
				set: function(val) {
					this.setDataValue('expiration', new Date(new Date().getTime() + (24 * 60 * 60 * 1000)));
				}
			}
		},
		{
			timestamps: true,
			updatedAt: false,
			instanceMethods: {
				createToken: function() {					
					return crypto.randomBytes(100).toString('hex'); 
				}
			},
			associate: function(models){
				UserVerificationToken.belongsTo(models.User);
			}
		}
	);

	return UserVerificationToken;
};
