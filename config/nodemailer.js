/**
 * Set up nodemailer
 */
var nodemailer = require('nodemailer');
var config = require('./config');
var winston = require('./winston');
var mail = {};
var _ = require('lodash');

var transporter = nodemailer.createTransport(config.smtp);
var sendMail = function (transporter, recipient, subject, content) {	
	console.log(transporter);
	var mailOptions = {
		from: config.smtp.fromEmail,
		to: recipient,
		subject: subject,
		html: content
	}

	transporter.sendMail(mailOptions, function(error, info) {
		if(error) {
			return winston.info(error);
		}
		winston.info('Message "' + subject + '" sent to mailto://' + recipient + '/. Response: ' + info.response);
	});
}

/*
 * Usage:
 * mail.send(mail.transporter, "test@email.com", "Test message", "Hello word!");
 */
module.exports = _.extend({
    transporter: transporter,
    send: sendMail
}, mail);