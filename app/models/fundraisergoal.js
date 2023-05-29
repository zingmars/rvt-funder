'use strict';

/**
 * Database containing the goals set forward by the project.
 */
module.exports = function(sequelize, DataTypes) {
	var FundraiserGoal = sequelize.define('FundraiserGoal', {
			sum: DataTypes.DECIMAL(13,4),
			title: DataTypes.STRING,
			description: DataTypes.STRING,
			isReward: DataTypes.BOOLEAN,
			isDigitalReward: DataTypes.BOOLEAN,
			isLimitedAmount: DataTypes.BOOLEAN,
			limitedAmountCount: DataTypes.INTEGER
		},
		{
			associate: function(models){				
				FundraiserGoal.belongsTo(models.Fundraiser);				
			}
		}
	);
	
	return FundraiserGoal;
};
