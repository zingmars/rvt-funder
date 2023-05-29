'use strict';

/**
 * Database that tracks payments.
 */
module.exports = function(sequelize, DataTypes) {

	var Payment = sequelize.define('Payment', {
			amount: DataTypes.DECIMAL(13,4),			
			paymentMethod: DataTypes.ENUM('PayPal'),
			isProcessed: DataTypes.BOOLEAN,
			isApproved: DataTypes.BOOLEAN,
			isRefundable: DataTypes.BOOLEAN,
			data: DataTypes.STRING
		},
		{
			paranoid: true,
			associate: function(models){
				Payment.belongsTo(models.User);
			}
		}
	);

	return Payment;
};
