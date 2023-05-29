'use strict';

/**
 * 2FA token store.
 */
module.exports = function(sequelize, DataTypes) {
	var UserTwoFactorAuthToken = sequelize.define('UserTwoFactorAuthToken', 
		{
			token: DataTypes.STRING,
			type: DataTypes.ENUM('hotp', 'totp'),
			codeLength: {
				type: DataTypes.INTEGER,
				defaultValue: 6
			},
			recoveryKeyOne: DataTypes.STRING,
			recoveryKeyTwo: DataTypes.STRING,
			recoveryKeyThree: DataTypes.STRING,
			recoveryKeyFour: DataTypes.STRING,
			recoveryKeyFive: DataTypes.STRING,
			recoveryKeySix: DataTypes.STRING
		},
		{			
			associate: function(models) {
				UserTwoFactorAuthToken.belongsTo(models.User);
			}
		}
	);

	UserTwoFactorAuthToken.removeAttribute('id');
	return UserTwoFactorAuthToken;
};
