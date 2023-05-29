'use strict';

/**
* Account action routes.
*/
var passport    = require('passport');
module.exports = function(app) {
    // User Routes
    var users = require('../../app/controllers/users');

    // Authorisation with local data
    app.post('/signin', passport.authenticate('local'), users.signin);
    app.post('/signup', users.signup);
    app.post('/signout', users.signout);
    app.post('/resetpassword', users.resetPassword);
    app.post('/changepassword', users.changePassword);
    app.post('/deleteaccount', users.deleteAccount);
    app.post('/checkauth', users.checkAuth);
};

// Old oAuth routes
/*
// Setting the facebook oauth routes
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signin'
}), users.signin);

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
}), users.authCallback);

// Setting the twitter oauth routes
app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
}), users.signin);

app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
}), users.authCallback);

// Setting the google oauth routes
app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}), users.signin);

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
}), users.authCallback);
*/