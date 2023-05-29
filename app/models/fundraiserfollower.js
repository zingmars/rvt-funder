'use strict';

/**
 * Tracks whether an user follows updates from a fundraising campaign.
 */
module.exports = function(sequelize, DataTypes) {
	var FundraiserFollower = sequelize.define('FundraiserFollower', 
		{
			news: DataTypes.BOOLEAN,
			comments: DataTypes.BOOLEAN,
			goals: DataTypes.BOOLEAN
		},
		{
			instanceMethods: {
				
			},
			associate: function(models) {
				FundraiserFollower.belongsTo(models.Fundraiser);
				FundraiserFollower.belongsTo(models.User);
			}
		}
	);
		
	return FundraiserFollower;
};
