/* global i18next */
'use strict';

angular.module('mean.system').controller('UserController', ['$scope', '$location' ,'$csrf', '$http', '$routeParams', 'flash', 'notify', 'Global', function ($scope, $location, $csrf, $http, $routeParams, flash, notify, Global) {
	$scope.params = $routeParams;
	/*$scope.flash = flash;*/
	Global.page = "users";

	$(document).ready(function () {        
    	// FIXME: Passing parameters directly to the notification is unsafe, should find a safer way of doing things.
    	if ($routeParams.state !== undefined) {
    		notify(i18next.t("users."+$routeParams.state));
    	}
	    if(flash.get().length !== 0) {
	    	notify(i18next.t(flash.get()));
	    }    	
    });
	
	$scope.login = function(formData) {
		$(".error").hide();
		$("input[type=password]").val("");
		return $http
			.post('/signin', formData)
			.error(function(res) {			
				if(res === "Unauthorized") {
					$("#wrongcredentials").show();					
				} else {
					$("#signinerror").show();
				}
			})
			.success(function (res) {							
				//TODO: If 2FA, redirect to 2FA form
				window.location.href = '/';
			});
	};
	$scope.register = function(formData) {
		$(".error").hide();
		$("input[type=password]").val("");
		delete formData.passwordRepeat;  

		return $http
			.post('/signup', formData)
			.error(function(res) {			
				$('#registrationerror').show();
			})
			.success(function(res) {
				if(res === "Success") {
					window.location.href = '/#!/home/registrationSuccess';
					window.location.reload();
				} else {
					$('#registrationerror').show();
				}
			});
	};
	$scope.resetPassword = function(email) {
		$(".error").hide();
		return $http
			.post('/resetpassword', email)
			.error(function(res) {
				$("#signinerror").show();				
			})
			.success(function(res) {
				if(res === "Success") {
					flash.set("user.resetSent");
					$location.path("/");
				} else {
					$('#signinerror').show();
				}
			});
	};
	$scope.changePassword = function(formData) {
		$(".error").hide();
		$("input[type=password]").val("");
		delete formData.passwordRepeat;

		return $http
			.post('/changepassword', formData)
			.error(function(res) {
				if(res === "Invalid code") {
					$("#invalidresetcode").show();
				} else {
					$("#reseterror").show();					
				}
			}).success(function(res) {					
				window.location.href = '/#!/signin/passwordChanged';
			});
	};
	$scope.deleteAccount = function(formData) {
		$(".error").hide();
		$("input[type=password]").val("");

		return $http
			.post('/deleteaccount', formData)
			.error(function(res) {
				$("#wrongcredentials").show();
			})
			.success(function(res) {
				if(res === "Deletion initiated") {
					flash.set("user.deleteinitiated");
					window.location.href = '/#!/home/deleteinitiated';
				} else {
					flash.set("user.deletesuccessful");
					window.location.href = '/#!/home/deletesuccess';
				}
			});
	};	
}]);