/* global i18next */
'use strict';

angular.module('mean.system').controller('IndexController', ['$routeParams', '$scope', 'Global', 'notify', 'flash', function ($routeParams, $scope, Global, notify, flash) {
    $scope.global = Global;    
    $scope.params = $routeParams;
    Global.page = "index";  
    
    $(document).ready(function () {        
    	// FIXME: Passing parameters directly to the notification is unsafe, should find a safer way of doing things.
        // FIXME: For whatever reason this message will be shown before the locale files exist.
    	/*if ($routeParams.state !== undefined) {
    		notify(i18next.t("home."+$routeParams.state));            
    	}
	    if(flash.get().length !== 0) {
	    	notify(i18next.t(flash.get()));
	    }*/
    });
}]);