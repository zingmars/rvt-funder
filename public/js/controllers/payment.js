'use strict';

angular.module('mean.payment').controller('PaymentController', ['$routeParams', '$scope', 'Global', function ($routeParams, $scope, Global) {
    $scope.global = Global;    
    $scope.params = $routeParams;
    

}]);