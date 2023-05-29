/*global i18next*/
'use strict';

// Global service for global variables
angular.module('mean.system').factory("Global", [
    function() {
        var _this = this;
        _this._data = {
            user: window.user,
            authenticated: !! window.user
        };

        return _this._data;
    }
]);

// Change i18next's language
function changeLanguage(language) {		
	i18next.changeLanguage(language);
    document.cookie="lng="+language;
	location.reload();
    return false;
}

// Redirect non-https connections to https
function forceSSL() {
    if (location.protocol() !== 'https') {
        window.location.href = location.absUrl().replace('http', 'https');
    }
    return false;
}

// Convert null strings to empty ones.
function nullToEmpty(string) {
    if (string === null) {
        return "";
    } else {
        return string;
    }
}

// Input delay before sending data to server
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
  clearTimeout (timer);
  timer = setTimeout(callback, ms);
 };
})();