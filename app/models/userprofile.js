'use strict';

/**
 * User Profile's DB.
 */
module.exports = function(sequelize, DataTypes) {
	var UserProfile = sequelize.define('UserProfile', 
		{
			bio: DataTypes.STRING,
			name: DataTypes.STRING(32),			
			country: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			},
			phone: DataTypes.STRING(32),
			address: DataTypes.STRING,
			zip: DataTypes.STRING(6),
			areacode: DataTypes.STRING(3),
			avatarid: DataTypes.STRING(32)
		},
		{
			timestamps: true,
			createdAt: false,	
			associate: function(models) {
				//UserProfile.belongsTo(models.User);
			}
		}
	);

	return UserProfile;
};
