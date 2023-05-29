'use strict';

/**
 * Database containing project's comments
 */
module.exports = function(sequelize, DataTypes) {

	var FundraiserComment = sequelize.define('FundraiserComment', {
			comment: DataTypes.TEXT,
			isVisible: DataTypes.BOOLEAN
			//TODO: ResponseTo
		},
		{
			timestamps: true,
			updatedAt: false,
			associate: function(models){
				FundraiserComment.belongsTo(models.User);
				FundraiserComment.belongsTo(models.Fundraiser);
				FundraiserComment.belongsTo(models.FundraiserPledge);
			}
		}
	);
	
	return FundraiserComment;
};
