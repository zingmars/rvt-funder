'use strict';

/**
 * User's websites
 */
module.exports = function(sequelize, DataTypes) {
	var UserWebsite = sequelize.define('UserWebsite', 
		{
			URI: DataTypes.STRING	
		},
		{			
			associate: function(models) {
				UserWebsite.belongsTo(models.User);
			}
		}
	);
	
	return UserWebsite;
};
