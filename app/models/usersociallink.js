'use strict';

/**
 * User's social links for oAuth.
 */
module.exports = function(sequelize, DataTypes) {
	var UserSocialLink = sequelize.define('UserSocialLink', 
		{
			network: DataTypes.ENUM('facebook', 'draugiem', 'vk', 'google'),
			profileUserId: DataTypes.STRING,
			profileKey: DataTypes.STRING,
			profileSecret: DataTypes.STRING
		},
		{			
			associate: function(models) {
				UserSocialLink.belongsTo(models.User);
			}
		}
	);
	
	return UserSocialLink;
};
