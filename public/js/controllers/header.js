'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$http', 'Global', function ($scope, $http, Global) {
    $scope.global = Global;    

    $scope.menu = [{
        "title": "app.followedProjects",
        "link": "followedProjects"
    }];
    $scope.createproject = [{
        "title": "app.fundraiserCreate",
        "link": "create"
    }];
    $scope.defaultmenu = [{
    	"title": "aboutus",
    	"link": "aboutus"
    },{
        "title": "FAQ",
        "link": "faq"
    }];
    $scope.authmenu = [{
        "title": "signin",
        "link": "signin"
    }, {
        "title": "signup",
        "link": "signup"}];        
    $scope.isCollapsed = false;

    $scope.logout = function() {        
        return $http
            .post('/signout')
            .error(function(res) {
                window.location.href = '/';
            })
            .success(function (res) {                                       
                window.location.href = '/';
            });
    };
}]);