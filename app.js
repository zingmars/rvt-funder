'use strict';

/**
 * Module dependencies.
 */
var express     		= require('express');
var i18n 				= require('i18next');
var middleware  		= require('i18next-express-middleware');
var FilesystemBackend 	= require('i18next-node-fs-backend');
var sprintf 			= require('i18next-sprintf-postprocessor');
var https 				= require('https');
var fs 			        = require('fs');
var passport			= require('passport');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load Configurations
var config          = require('./config/config');
var winston         = require('./config/winston');

winston.info('Starting '+config.app.name+'...');
winston.info('Config loaded: '+config.NODE_ENV);
winston.debug('Accepted Config:',config);

var db              = require('./config/sequelize');
var passport        = require('./config/passport');
var mail	        = require('./config/nodemailer');
var app = express();

// Force SSL
app.use(function(req, res, next) {
  if(!req.secure) {  	  	
    return res.redirect(['https://', req.hostname, ':', config.SSLPORT, req.url].join(''));    
  }
  next();
});
// End Force SSL

// Load the localisation library
i18n
	.use(middleware.LanguageDetector)
	.use(FilesystemBackend)
	.use(sprintf)
	.init({
		detectFromHeaders: true,
		preload: ['lv', 'en'],
		useCookie: true,
		fallbackLng: 'en',
		cookieName: 'lng',
		ns: 'translation',
		//lng: 'en',
		load: 'unspecific',
		backend: ({
			loadPath: 'locales/{{lng}}/{{ns}}.json',
  			addPath: 'locales/{{lng}}/{{ns}}.missing.json',
			jsonIndent: 2
		}),
		detection: ({
			order: ['querystring', 'cookie', 'header'],
			lookupQuerystring: 'lng',
			lookupCookie: 'lng',
			lookupSession: 'lng',
			lookupFromPathIndex: 0,
			caches: false, 
		}),
    	debug: false,
    	saveMissing: false,
    	sendMissingTo: 'en',
    	saveMissingKeys: false,
    	resGetPath: "locales/__lng__/__ns__.json",
	}, function (t) {});
app.use(middleware.handle(i18n));

// Initialize Express
require('./config/express')(app, passport);

// Load SSL config
var secureServer = https.createServer({
	key: fs.readFileSync(config.sslKey),
	cert: fs.readFileSync(config.sslCert),
}, app); 
secureServer.listen(config.SSLPORT);
winston.info('Express app with SSL started on port 3001');

//Start the app by listening on <port>
app.listen(config.PORT);
winston.info('Express app started on port ' + config.PORT);

//expose app
module.exports = app;