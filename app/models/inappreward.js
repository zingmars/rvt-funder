'use strict';

/**
 * Database that contains pointers to project's digital rewards.
 */
module.exports = function(sequelize, DataTypes) {
	var InAppReward = sequelize.define('InAppReward', {
			rewardType: DataTypes.ENUM('picture', 'video', 'text', 'physical'),			
			rewardData: DataTypes.TEXT,
			rewardURI: DataTypes.STRING
		},
		{
			associate: function(models){				
				InAppReward.belongsToMany(models.User, {through: 'UserInAppReward'});
				InAppReward.belongsTo(models.Fundraiser);
			}
		}
	);

	return InAppReward;
};
