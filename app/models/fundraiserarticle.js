'use strict';

/**
 * Database containing project's articles
 */
module.exports = function(sequelize, DataTypes) {

	var FundraiserArticle = sequelize.define('FundraiserArticle', {
			title: DataTypes.STRING,
			content: DataTypes.TEXT('long'),
			commentsEnabled: DataTypes.BOOLEAN,
			isPublished: DataTypes.BOOLEAN
		},
		{
			associate: function(models){
				FundraiserArticle.belongsTo(models.User);
				FundraiserArticle.belongsTo(models.Fundraiser);
			}
		}
	);

	return FundraiserArticle;
};
