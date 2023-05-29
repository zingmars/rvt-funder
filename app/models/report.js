'use strict';

/**
 * Database that tracks user reports about other users or projects.
 */
module.exports = function(sequelize, DataTypes) {

	var Report = sequelize.define('Report', {			
			type: DataTypes.ENUM('user', 'project'),
			reportedId: DataTypes.INTEGER,			
			reason: DataTypes.STRING
		},
		{
			timestamps: true,
			updatedAt: false,
			associate: function(models){
				Report.belongsTo(models.User);
			}
		}
	);

	return Report;
};
