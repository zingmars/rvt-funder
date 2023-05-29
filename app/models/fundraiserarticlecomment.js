'use strict';

/**
 * Database containing article comments.
 */
module.exports = function(sequelize, DataTypes) {

	var FundraiserArticleComment = sequelize.define('FundraiserArticleComment', {			
			content: DataTypes.TEXT
		},
		{
			timestamps: true,			
			associate: function(models){
				FundraiserArticleComment.belongsTo(models.User);
				FundraiserArticleComment.belongsTo(models.FundraiserArticle);
			}
		}
	);
	
	return FundraiserArticleComment;
};
