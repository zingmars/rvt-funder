'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var flash = require('connect-flash');
var helpers = require('view-helpers');
var compression = require('compression');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var sessionMiddleware = require('./middlewares/session');
var multipartMiddleware = require('./middlewares/multipart');
var config = require('./config');
var winston = require('./winston');
var csrf = require('csurf');

module.exports = function(app, passport) {

    winston.info('Initializing Express');    

    app.set('showStackError', true);

    //Prettify HTML
    app.locals.pretty = true;

    //Should be placed before express.static
    app.use(compression({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    //Setting the fav icon and static folder
    app.use(favicon(config.root + '/public/img/icons/favicon.ico'));
    app.use(express.static(config.root + '/public'));

    //Don't use logger for test env
    if (config.NODE_ENV !== 'test') {
        app.use(logger('dev', { "stream": winston.stream }));
    }

    //Set views path, template engine and default layout
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    //Enable jsonp
    app.enable("jsonp callback");

    //cookieParser should be above session
    app.use(cookieParser(config.cookieSessionSecret, { httpOnly: true }));

    //request body parsing middleware should be above methodOverride
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(methodOverride());

    //express session configuration
    app.use(sessionMiddleware);    

    //connect flash for flash messages
    app.use(flash());

    //dynamic helpers
    app.use(helpers(config.app.name));

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //File upload
    //app.use(multipartMiddleware);

    //CSRF cookie setup
    winston.info('Initializing CSRF protection.');
    app.use(csrf( { cookie: { path: '/', httpOnly: true } }));
    //CSRF Protection
    app.use(function(err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err)
        res.status(403);
        res.send('HTTP 403: Session has expired or form tampered with.'); //TODO: Send the user to an error page.
    });
    app.use(function (req, res, next) {        
        res.cookie("XSRF-TOKEN",req.csrfToken());
        return next();
    });

    //Globbing routing files
    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
      require(path.resolve(routePath))(app);
    });

    //Error page routing
    app.use('*',function(req, res){
/*        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Error: Site not found'
        });*/
        res.status(404).redirect('/');
        res.status(403).redirect('/');
    });

    app.use(function(err, req, res, next) {
        //Log it
        winston.error(err);

        //Error page        
        res.status(500).render('500', {
            error: err.stack
        });
    });    
};
