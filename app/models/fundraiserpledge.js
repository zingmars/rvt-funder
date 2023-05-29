'use strict';

/**
 * Database that registers pledges for individual projects.
 */
module.exports = function(sequelize, DataTypes) {

	var FundraiserPledge = sequelize.define('FundraiserPledge', {
			isPrivate: DataTypes.BOOLEAN,
			isSizePrivate: DataTypes.BOOLEAN
		},
		{
			associate: function(models){
				FundraiserPledge.belongsTo(models.User);
				FundraiserPledge.belongsTo(models.Fundraiser);
				FundraiserPledge.hasOne(models.Payment);
			}
		}
	);

	return FundraiserPledge;
};
