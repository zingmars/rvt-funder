/* global i18next */
'use strict';
// Project list's controller.
angular.module('mean.system').controller('DiscoverController', ['$http', '$scope', 'notify', 'Global', function ($http, $scope, notify, Global) {
    $scope.global = Global;    
    Global.page = "discover";
    // TODO: Rather than building HTML from JSON manually, use ng directives instead.

    // Pagination
    var projectOffset = 0;
    var requestType = 0; //0 - Full request, 1 - search

    var paginate = function () {    	
    	// Repeat the last request
    	if(requestType === 0) {
    		$http({
    			method: 'GET',
    			url: '/discover/get/'+projectOffset
    		}).then (function success(response) {
    			if(response.data === "[]") {
					notify(i18next.t("discoverPage.paginationError"));
    			} else {
    				addProjectsToList(response.data);
    			}
    		}, function failure(response) {
				notify(i18next.t("discoverPage.connectionError"));
    		});
    	} else if (requestType === 1) {
    		var terms = $("#discover-search-box").val();
			$http({
    			method: 'GET',
    			url: '/discover/search/'+projectOffset+'?string='+terms
    		}).then (function success(response) {
    			if(response.data === "[]") {
					notify(i18next.t("discoverPage.paginationError"));
    			} else {
    				addProjectsToList(response.data);
    			}
    		}, function failure(response) {
				notify(i18next.t("discoverPage.connectionError"));
    		});
    	}
    };
    $scope.paginate = paginate;

    // Search
    // TODO: Introduce a small delay to avoid blasing the server with search requests.
    $scope.search = function() {    	
    	var terms = $("#discover-search-box").val();
    	if(terms === "") {
    		getProjects();
    	} else {
	    	$http({
				method: 'GET',
				url: '/discover/search?string='+terms // TODO: Sanitize search string
			}).then (function success(response) {
				clearList();
				if(response.data !== "[]") {				
					addProjectsToList(response.data);
				}
			}, function failure(response) {
				notify(i18next.t("discoverPage.connectionError"));
			});    		
    	}
    };

    // List managament
    var clearList = function() {
    	$("#discover-projects").empty();
    };
    var addProjectsToList = function (list) {		
		// TODO: Create smaller pictures for the discover page and display those instead. Since we'll be having a local demo, the size of the pictures is irrelevant for now.
		var projectsLeft = 0;
		list.forEach(function(project){
			$("#discover-projects").append('<a class="project-element" href="/#!/project/'+project.id+'/"><div class="discover-project"><div class="discover-project-img"><img src="/img/projects/'+project.image+'"></div><div class="discover-project-description"><div class="discover-project-title"><h1>'+project.name+'</h1></div><div class="discover-project-about"><p>'+project.description+'</p></div></div></div></a>');
            if(project.nsfw === true) {
                // TODO: Proper age gate
                $(".project-element:last").on("click", function () {
                    if(!confirm(i18next.t("discoverPage.nsfw"))) {
                        return false;
                    }
                });
            }
			projectsLeft = project.projectsLeft;
		});

		// Since there are no project pages left to show, hide the pagination button.
		if(projectsLeft > 0) {
			$("#discover-pagination").show();
		} else {
			$("#discover-pagination").hide();
		}
    };

    var getProjects = function () {
		$http({
			method: 'GET',
			url: '/discover/get'
		}).then (function success(response) {			
			if (response.data === "[]") {				
				notify(i18next.t("discoverPage.noProjects"));			
			} else {
				projectOffset = response.data.length;				
				clearList();				
				addProjectsToList(response.data);
			}
		}, function failure(response) {
			notify(i18next.t("discoverPage.connectionError"));
		});	    	
    };

	$(document).ready(function () {
		// Get project list
		getProjects();

		// Notifications
  		/*if ($routeParams.state !== undefined) {
    		notify(i18next.t("users."+$routeParams.state));
    	}
	    if(flash.get().length !== 0) {
	    	notify(i18next.t(flash.get()));
	    }   */ 	

    });
}]);