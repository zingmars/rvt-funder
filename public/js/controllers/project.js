/* global i18next */
'use strict';

angular.module('mean.project').controller('ProjectController', ['$scope', '$http', '$routeParams', 'notify', 'Global', function ($scope, $http, $routeParams, notify, Global) {
    $scope.global = Global;
    Global.page = "discover";

    //TODO: Goals
    //TODO: Pašreizējais projekta naudas stāvoklis un procenti
    //TODO: Saite uz autora profilu
    $(document).ready(function () {
    	$http({
    		method: 'GET',
    		url: '/project/get/'+$routeParams.id
    	}).then(function (response) {
    		if(response.statusText === "OK") {
    			$("#project-title").html(response.data.name);
    			$("#project-short-description").html(response.data.shortDescription);
    			var date = new Date(response.data.expireDate);
            	$("#expire-date").html(date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
            	if(!response.data.isOngoing) {
            		$("#publish-status").show();
            	}
            	$("#project-view-long-description").html(response.data.longDescription);
            	$("#project-view-totalmoney").html(response.data.goal);
            	$("#owner-name").html(response.data.owner_name);
            	$("#owner-profile").attr('href', "/#!/user/"+response.data.UserId);
    		} else {
    			window.location = "/#!/discover";
    			notify(i18next.t("discoverPage.connectionError"));
    		}
    	}, function(response) {
    		window.location = "/#!/discover";
			notify(i18next.t("discoverPage.connectionError"));
    	});
    });
    //project-view-currentmoney
    //project-view-percentage
}]);