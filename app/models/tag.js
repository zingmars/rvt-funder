'use strict';

/**
 * Tags store
 */
module.exports = function(sequelize, DataTypes) {

	var Tag = sequelize.define('Tag', 
		{
			tag: DataTypes.STRING(32)
		},
		{
			timestamps: false,
			instanceMethods: {
				
			},
			associate: function(models) {
				Tag.belongsToMany(models.Fundraiser, {through: 'FundraiserTag'});
			}
		}
	);

	return Tag;
};
