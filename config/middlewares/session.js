'use strict';

/* Sessionstore's middleware */
var session = require('express-session'),
    config = require('./../config'),
    sessionStore = require('./../session_store');

var sessionMiddleware = session({
    resave: false,
    rolling: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
    	maxAge: null,
    	path: '/',
    	httpOnly: 'true',    	
    },
    secret: config.expressSessionSecret
});

module.exports = sessionMiddleware;