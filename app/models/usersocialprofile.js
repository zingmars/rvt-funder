'use strict';

/**
 * User's social profiles
 */
module.exports = function(sequelize, DataTypes) {
	var UserSocialProfile = sequelize.define('UserSocialProfile', 
		{
			network: DataTypes.ENUM('facebook', 'twitter', 'draugiem', 'vk', 'google', 'youtube'),
			URI: DataTypes.STRING,
			username: DataTypes.STRING			
		},
		{			
			associate: function(models) {
				UserSocialProfile.belongsTo(models.User);
			}
		}
	);
	
	return UserSocialProfile;
};
