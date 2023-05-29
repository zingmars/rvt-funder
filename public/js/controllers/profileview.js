/* global i18next,nullToEmpty */
'use strict';

angular.module('mean.system').controller('ProfileViewController', ['$routeParams', '$scope', 'Global', '$http', 'notify', 'flash', function ($routeParams, $scope, Global, $http, notify, flash) {
    $scope.global = Global;    
    $scope.params = $routeParams;
    Global.page = "profileView";  
    
    $(document).ready(function () {
        // Get user's data              
        $http({
            method: 'GET',
            url: '/profile/get/'+$routeParams.id
        }).then (function success(response) {
            var profile = response.data.profile;
            var websites = response.data.websites;
            var socialNetworks = response.data.socialNetworks;

            $("#profile-avatar img").attr("src", "/img/users/"+profile.image);
            $("#profile-userdata-name").text(nullToEmpty(profile.name));
            $("#profile-userdata-country").text(i18next.t("countries."+profile.country));
            $("#profile-userdata-zip").text(nullToEmpty(profile.zip));
            $("#profile-userdata-phone").text(nullToEmpty(profile.phone));
            $("#profile-bio").text(nullToEmpty(profile.bio));

            websites.forEach(function(website) {                
                //Add HTTP
                if(website.URI.indexOf("http") === -1) {
                    website.URI = "http://"+website.URI;
                }
                $("#profile-webdata").append('<a href="'+website.URI+'"><img class="website-icon" src="/img/icons/website.png"></a>');
            });
            socialNetworks.forEach(function(network) {
                $("#profile-webdata").append('<a href="'+network.URI+'"><img class="website-icon" src="/img/icons/'+network.network+'.png"></a>');                
            });
        });

    	/*if ($routeParams.state !== undefined) {
    		notify(i18next.t("home."+$routeParams.state));
    	}
	    if(flash.get().length !== 0) {
	    	notify(i18next.t(flash.get()));
	    }*/
    });
}]);