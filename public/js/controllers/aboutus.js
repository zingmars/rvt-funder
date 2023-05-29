'use strict';

angular.module('mean.aboutus').controller('AboutusController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;
    Global.page = "aboutus";
}]);