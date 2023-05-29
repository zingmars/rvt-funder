'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'views/index.html'
		}).
		when('/home/:state?', {
			redirectTo: '/'
		}).        
		when('/aboutus', {
			templateUrl: 'views/aboutus/index.html'
		}).
		when('/statistics', {
			templateUrl: 'views/aboutus/statistics.html'
		}).
		when('/terms', {
			templateUrl: 'views/aboutus/terms.html'
		}).
		when('/privacy', {
			templateUrl: 'views/aboutus/privacy.html'
		}).
		when('/faq', {
			templateUrl: 'views/aboutus/faq.html'
		}).
		when('/rules', {
			templateUrl: 'views/aboutus/rules.html'
		}).
		when('/contacts', {
			templateUrl: 'views/aboutus/contacts.html'
		}).
		when('/tutorials', {
			templateUrl: 'views/tutorials/index.html'
		}).
		when('/resetpassword', {
			templateUrl: 'views/users/resetpassword.html'
		}).
		when('/changepassword/:email?/:code?', {
			templateUrl: '/views/users/passwordreset.html'
		}).
		when('/signin/:state?', {
			templateUrl: 'views/users/signin.html'            
		}).
		when('/signup', {
			templateUrl: 'views/users/signup.html'
		}).
		when('/discover', {
			templateUrl: 'views/discover/index.html',			
		}).
		when('/profile', {
			templateUrl: 'views/users/profile.html' 
		}).
		when('/settings', {
			templateUrl: 'views/users/settings.html' 
		}).
		when('/deleteaccount', {
			templateUrl: 'views/users/deleteaccount.html'
		}).
		when('/support', {
			redirectTo: '/support'
		}).
		when('/create', {
			templateUrl: 'views/projects/new.html'
		}).
		when('/create/step2', {
			templateUrl: 'views/projects/step2.html'
		}).
		when('/create/step3', {
			templateUrl: 'views/projects/step3.html'
		}).
		when('/create/step4', {
			templateUrl: 'views/projects/step4.html'
		}).
		when('/project/delete', {
			templateUrl: 'views/projects/delete.html'
		}).
		when('/user/:id', {
			templateUrl: 'views/users/view.html'
		}).
		when('/project/:id', {
			templateUrl: 'views/projects/view.html'
		}).
		when('/project/:id/pay', {
			templateUrl: 'views/payment/index.html'
		}).
		when('/project/:id/pay/success', {
			templateUrl: 'views/payment/success.html'
		}).
		when('/project/:id/publish', {
			templateUrl: 'views/projects/publish.html'
		}).
		when('/followedProjects', {
			templateUrl: 'views/users/followedprojects.html'
		}).
		when('/project/:id/rewards', {
			templateUrl: 'views/projects/viewrewards.html'
		}).
		when('/project/:id/rewards/:reward', {
			templateUrl: 'views/projects/viewreward.html'
		}).
		when('/messages', {
			templateUrl: 'views/users/messages.html'
		}).
		when('/verifyUser/:token', {
			controller: 'userVerification'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]).run(function($rootScope, $location) {
	$rootScope.$on("$routeChangeStart", function (event, next, current) {		
		if(window.user) {
			var publicOnlyPages = ["views/users/signin.html", "views/users/signup.html"];
			if(publicOnlyPages.indexOf(next.templateUrl) !== -1) {
				$location.path("/");
			}
		} else {            
			// TODO: Add a redirect to the page after login
			// (Don't forget to set up this from restricted controllers as well)
			var restrictedPages = ["views/users/profile.html", "views/users/profile.html", "views/users/deleteaccount.html", "views/articles/create.html", "views/articles/edit.html", "views/users/profile.html", "views/users/settings.html",  "views/users/deleteaccount.html", "views/projects/new.html", "views/projects/step2.html", "views/projects/step3.html", "views/projects/step4.html", "views/projects/delete.html"];
			if(restrictedPages.indexOf(next.templateUrl) !== -1) {
				$location.path("/signin");
			}
		}
	});
}).controller('userVerification', function ($scope, $routeParams) {
	if($routeParams.token) {
		return 0;
	} else {
		return 0;		
	}
});

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix("!");
	}
]);