"use strict";
// Required
var app = angular.module('mean', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ui.route', 'mean.project', 'mean.system', 'mean.aboutus', 'mean.payment', 'mean.profileview', 'jm.i18next', 'mean.profile', 'mean.user', 'cgNotify']);

// Page controllers
angular.module('mean.system', []);
angular.module('mean.aboutus', []);
angular.module('mean.user', []);
angular.module('mean.payment', []);
angular.module('mean.profile', []);
angular.module('mean.profileview', []);
angular.module('mean.project', []);

// Factories
// Pull CSRF Cookie
angular.module('mean').factory('$csrf', function () {
	var cookies = document.cookie.split('; ');
	for (var i=0; i<cookies.length; i++) {
		var cookie = cookies[i].split('=');
		if(cookie[0].indexOf('XSRF-TOKEN') > -1) {
			return cookie[1];
		}
	}
	return 'none';
});
// Field comparison
var compareTo = function() {
	return {
		require: "ngModel",
		scope: {
			otherModelValue: "=compareTo"
		},
		link: function(scope, element, attributes, ngModel) {
			ngModel.$validators.compareTo = function(modelValue) {
				return modelValue === scope.otherModelValue.$viewValue;
			};

			scope.$watch("otherModelValue", function() {
				ngModel.$validate();
			});
		}
	};
};
app.directive("compareTo", compareTo);
// Flash module
app.factory("flash", function ($rootScope) {
	var queue = [], currentMessage = '';

	$rootScope.$on('$routeChangeStart', function() {		
		if (queue.length > 0) {
		  currentMessage = queue.shift();
		}
		else {
		  currentMessage = '';
		}    
	});

	return {
		set: function(message) {
		  queue.push(message);		  
		},
		get: function() {		  
		  return currentMessage;
		}
	};
});