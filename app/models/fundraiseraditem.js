'use strict';

/**
 * Database containing pointers to advertisement materials
 */
module.exports = function(sequelize, DataTypes) {

	var FundraiserAdItem = sequelize.define('FundraiserAdItem', {
			service: DataTypes.ENUM('youtube', 'vimeo', 'picture'),
			itemID: DataTypes.STRING
		},
		{
			timestamps: true,
			updatedAt: false,
			associate: function(models){
				FundraiserAdItem.belongsTo(models.Fundraiser);
			}
		}
	);
	
	return FundraiserAdItem;
};
