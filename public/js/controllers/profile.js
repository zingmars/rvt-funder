/* global i18next, nullToEmpty, delay */
'use strict';

angular.module('mean.profile').controller('ProfileController', ['$scope', '$location' ,'$csrf', '$http', '$routeParams', '$compile', 'flash', 'notify', 'Global', function ($scope, $location, $csrf, $http, $routeParams, $compile, flash, notify, Global) {
	$scope.global = Global;
	Global.page = "profile";
	// TODO: Rather than building HTML from JSON manually, use ng directives instead.
	// TODO: Picture upload
		
	// element builders for networks and websites.
	var addNetwork = function (data) {		
		var $el = $();		
		if(data !== undefined) {
			$el = $('<div class="user-social-network" id="network-'+data.id+'" hasData="true"><select id="user-social-network-'+data.id+'"><option value="facebook">{{"user.facebook" | i18next}}</option><option value="draugiem">{{"user.draugiem" | i18next}}</option><option value="twitter">{{"user.twitter" | i18next}}</option><option value="vk">{{"user.VK" | i18next}}</option><option value="google">{{"user.google" | i18next}}</option><option value="youtube">{{"user.youtube" | i18next}}</option></select><input id="user-social-username-'+data.id+'" type="text" name="socnet" value="'+data.username+'" placeholder="{{\'user.socialNetwork\' | i18next}}"></select><a ng-click="removeNetwork($event);"> {{"remove" | i18next}}</a></div>').appendTo("#socialnetworks");
			$(".user-social-network:last select").val(data.network);
		} else {
			$el = $('<div class="user-social-network" id="network" hasData="false"><select><option value="facebook">{{"user.facebook" | i18next}}</option><option value="draugiem">{{"user.draugiem" | i18next}}</option><option value="twitter">{{"user.twitter" | i18next}}</option><option value="vk">{{"user.VK" | i18next}}</option><option value="google">{{"user.google" | i18next}}</option><option value="youtube">{{"user.youtube" | i18next}}</option><input type="text" name="socnet" placeholder="{{\'user.socialNetwork\' | i18next}}"></select><a ng-click="removeNetwork($event);"> {{"remove" | i18next}}</a></div>').appendTo("#socialnetworks");
		}
		$compile($el)($scope);

		var element = $(".user-social-network:last")[0];
		$(element).find("select").on("change", function () {
			saveNetwork($(element));
		});
		$(element).find("input").on("blur", function () {
			saveNetwork($(element));
		});
		return element;
	};

	var addWebsite = function (data) {
		var	$el = $();
		if(data !== undefined) {
			$el = $('<div id="website-'+data.id+'" class="user-website" hasData="true"><input type="text" id="website-'+data.id+'" class="profile-website" placeholder="{{ \'uri\' | i18next }}" value="'+data.URI+'"><a id="website-remove-'+data.id+'" class="website-remove" ng-click="removeWebsite($event);"> {{"remove" | i18next}}</a></div>').appendTo("#websites");
		} else {
			$el = $('<div id="website" class="user-website" hasData="false"><input type="text" class="profile-website" placeholder="{{ \'uri\' | i18next }}" value=""><a class="website-remove" id="website-remove-" ng-click="removeWebsite($event);"> {{"remove" | i18next}}</a></div>').appendTo("#websites");
		}
		$compile($el)($scope);

		var element = $(".user-website:last")[0];
		$(element).find("input").on("blur", function () {saveWebsite(this);});
		return element;
	};

	// Picture upload
	$scope.uploadPicture = function () {		
		var handler = $("#avatar")[0].files[0];
		if(handler.length === 0) {			
			notify(i18next.t("image.nopicture"));
		} else if(handler.size > 1000000) {
			notify(i18next.t("image.filetoolarge"));
		} else if (handler.type !== 'image/png' && handler.type !== 'image/jpeg') {			
			notify(i18next.t("image.invalidformat"));
		} else {
			var formData = new FormData();
			$.each($("#avatar")[0].files, function(i, file) {
				formData.append('file-'+i, file);
			});

			formData.append('file', handler);
			$.ajax({
				url: '/profile/upload/picture',				
				data: formData,
				cache: false,			
				contentType: false,
				processData: false,
				method: 'POST',
				success: function(response) {
					if(response.data === "Success") {
						$(".profile-avatar").attr("src", $(".profile-avatar").attr("src")+new Date().getTime());
					} else {
						notify(i18next.t("image.uploadfailure"));
					}					
				}
			});

			/*$http({
			}).then(function (response) {
			});*/
		}
	};

	// (+) buttons for social networks and websites.
	$scope.addNetwork = function() {
		if($("#network").length === 0) {
			addNetwork();
		}
	};
	$scope.addWebsite = function() {		
		if($("#website").length === 0) {
			addWebsite();		
		}
	};

	// Remove button effects
	$scope.removeNetwork = function($event) {
		var network = $($event.currentTarget).parent();
		if(network.attr("hasData") === "false") {
			network.remove();
		} else {
			var data = {id: network.attr("id").substr(8)};

			$http({
				method: 'POST',
				url: '/profile/delete/socialNetwork',
				data: data
			}).then(function (response) {
				if(response.data === "Success") {
					network.remove();
				} else {
					notify(i18next.t("user.deleteFailure"));
				}
			});
		}
	};
	$scope.removeWebsite = function($event) {
		var website = $($event.currentTarget).parent();
		if(website.attr("hasData") === "false") {
			website.remove();
		} else {
			var data = {id: website.attr("id").substr(8)};

			$http({
				method: 'POST',
				url: '/profile/delete/website',
				data: data
			}).then(function (response) {
				if(response.data === "Success") {
					website.remove();
				} else {
					notify(i18next.t("user.deleteFailure"));
				}
			});
		}
	};

	// Data saving
	var saveData = function (type) {	
		$http({
			method: 'POST',
			url: '/profile/save',
			data: { type: type, value: $("#"+type).val() }
		}).then(function (response) {			
			if(response.data === "Success") {
				$("#"+type).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
			} else {
				notify(i18next.t("user.saveFailure"));
			}
		});
	};
	var saveWebsite = function(element) {				
		if ($(element).val() !== "") {
			var data = { value: $(element).val() };
			if($(element).attr("id") !== undefined && $(element).attr("id") !== "") {						
				data.id = $(element).attr("id").substr(8);			
			}
			
			$http({
				method: 'POST',
				url: '/profile/save/website',
				data: data
			}).then(function (response) {
				if(response.data.id !== undefined) {
					$(element).attr("id", "website-"+response.data.id);	
					$(element).parent().attr("hasdata", true).attr("id", "website-"+response.data.id).find("a").attr("id", "website-remove-"+response.data.id);					
				}

				if (response.data.id !== undefined || response.data === "Success") {				
					$(element).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
				} else {
					notify(i18next.t("user.saveFailure"));
				}
			});			
		}
	};
	var saveNetwork = function(element) {		
		var network = $(element).find("select").val();
		var username = $(element).find("input").val();

		if(username !== "") {
			var data = { network: network, username: username };
			if($(element).attr("id") !== undefined && $(element).attr("id").length > 7) {
				data.id = $(element).attr("id").substr(8);
			}

			$http({
				method: 'POST',
				url: '/profile/save/socialNetwork',
				data: data
			}).then(function (response) {
				if(response.data.id !== undefined) {
					$(element).attr("id", "network-"+response.data.id).attr("hasdata", true);	
					$(element).find("select").attr("id", "user-social-network-"+response.data.id);
					$(element).find("input").attr("id", "user-social-username-"+response.data.id);
				}

				if (response.data.id !== undefined || response.data === "Success") {				
					$(element).find("input").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
					$(element).find("select").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
				} else {
					notify(i18next.t("user.saveFailure"));
				}
			});		
		}
	};

	// Data filler.
	$(document).ready(function () {
		// Get user's data		
		$http({
			method: 'GET',
			url: '/profile/edit'
		}).then (function success(response) {
			var profile = response.data.profile;
			var websites = response.data.websites;
			var socialNetworks = response.data.socialNetworks;
			
			// Fill user's profile data fields
			$(".profile-avatar").attr("src", "/img/users/"+profile.image);

			$("#username").val(nullToEmpty(profile.name));
			$("#biography").val(nullToEmpty(profile.bio));
			if(profile.country != null) {
				$("#location option[value=\""+profile.country+"\"]").prop('selected', true);
				if(profile.country === 1) {
					$("#areaCode").prop('disabled', false);
					$("#areaCode").val(nullToEmpty(profile.areacode));
				}
			}
			$("#zipCode").val(nullToEmpty(profile.zip));
			$("#phone").val(nullToEmpty(profile.phone));
			$("#address").val(nullToEmpty(profile.address));
			socialNetworks.forEach(function (network) {
				var networkElement = addNetwork(network);
			});
			websites.forEach(function (website) {
				addWebsite(website);				
			});


			// Set up on change handlers
			$("#username").on("blur",function () {saveData("username");});
			$("#biography").on("blur",function () {saveData("biography");});
			$("#areaCode").on("blur",function () {saveData("areaCode");});
			$("#zipCode").on("blur",function () {saveData("zipCode");});
			$("#phone").on("blur",function () {saveData("phone");});
			$("#address").on("blur",function () {saveData("address");});										
		}, function failure(response) {
			notify(i18next.t("discoverPage.connectionError"));
		});

		// Enable Area code if the user's from the US.
		$("#location").on('change', function () {
			saveData("location");

			if(this.value === '1') {
				$("#areaCode").prop('disabled', false);
			} else {
				$("#areaCode").prop('disabled', true);
				$("#areaCode").val("");
			}			
		});
	});    
}]);