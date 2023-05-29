'use strict';

/**
 * Database that stores user message data.
 */
module.exports = function(sequelize, DataTypes) {
	var UserMessage = sequelize.define('UserMessage', 
		{	
			title: DataTypes.STRING,
			message: DataTypes.TEXT
			//TODO: owner/direction
		},
		{			
			timestamps: true,
			updatedAt: false,
			associate: function(models) {
				UserMessage.belongsToMany(models.User, {through: 'UserMessageOwners'});
			}
		}
	);

	return UserMessage;
};
