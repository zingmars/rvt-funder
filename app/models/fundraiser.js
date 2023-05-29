'use strict';

/**
 * Fundraiser page model
 */
module.exports = function(sequelize, DataTypes) {

	var Fundraiser = sequelize.define('Fundraiser', 
		{			
			name: DataTypes.STRING(140),
			goal: DataTypes.DECIMAL(13,4),
			nsfw: DataTypes.BOOLEAN,
			shortDescription: DataTypes.STRING,
			longDescription: DataTypes.TEXT('long'),
			projectType: DataTypes.ENUM('paidpertime', 'paidperwork', 'fundraising'),			
			category: DataTypes.ENUM('undefined', 'videos', 'music', 'literature', 'art', 'photography', 'games', 'crafts', 'education', 'charity', 'sports', 'other'),
			expireDate: DataTypes.DATE,			
			isVerified: DataTypes.BOOLEAN,
			isApproved: DataTypes.BOOLEAN,
			isActive: DataTypes.BOOLEAN,
			isDeleted: DataTypes.BOOLEAN,
			isOngoing: DataTypes.BOOLEAN,
			isPaidOut: DataTypes.BOOLEAN,			
			successfulMessage: DataTypes.STRING,
			successfulVideoURI: DataTypes.STRING
		},
		{
			instanceMethods: {
				
			},
			associate: function(models) {
				// Owner
				Fundraiser.belongsTo(models.User);				
				// Staff
				Fundraiser.belongsToMany(models.User, {through: 'FundraiserStaff'});
			}
		}
	);

	return Fundraiser;
};
