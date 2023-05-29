'use strict';

/**
 * Database storing user's global e-mail subscription settings.
 */
module.exports = function(sequelize, DataTypes) {
	var UserNewsletterState = sequelize.define('UserNewsletterState', 
		{
			subscribedToNews: DataTypes.BOOLEAN,
			subscribedToAnnouncements: DataTypes.BOOLEAN,
			subscribedToFundraiserUpdates: DataTypes.BOOLEAN,
			subscribedToMessages: DataTypes.BOOLEAN
		},
		{
			timestamps: true,
			createdAt: false,
			associate: function(models) {				
			}
		}
	);
	// A primary key is not needed for this kind of table	
	UserNewsletterState.removeAttribute('id');

	return UserNewsletterState;
};
