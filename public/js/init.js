'use strict';

angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === "#_=_") {
        window.location.hash = "#!";
    }

    //Then init the app
    angular.bootstrap(document, ['mean']);
});


// i18n localisation support
// Load the angular plugin
angular.module('jm.i18next').config(function ($i18nextProvider) {	
    $i18nextProvider.i18next = window.i18next;	
	
	// Load i18next modules
    $i18nextProvider.i18next
	  .use(window.i18nextXHRBackend)
	  .use(window.i18nextLocalStorageCache)
	  .use(window.i18nextBrowserLanguageDetector)
	  .use(window.i18nextSprintfPostProcessor);    
	
	// Configure i18next
    $i18nextProvider.options = {
    	debug: false,
    	languages: ['en', 'lv'],
    	load: 'all',        
        useCookie: true,
        useLocalStorage: false,
        fallbackLng: 'en',
        ns: {
            namespaces: ['translation'],
            defaultNs: 'translation'
        },
        defaultLoadingValue: 'Loading...',        
		backend: {
		    loadPath: '../locales/{{lng}}/{{ns}}.json',
		    //addPath: '../locales/{{lng}}/{{ns}}.missing.json',
		    allowMultiLoading: false,
		    crossDomain: false
        },
        cache: {
        	enabled: false,
        	prefix: 'i18next_',
        	expirationTime: 24*60*60*1000
        },
        detector: {
        	order: ['querystring', 'cookie', 'localstorage'],
        	lookupQuerystring: 'lng',
        	lookupCookie: 'lng',
        	lookuplocalstorage: 'i18nextLng',
        	caches: ['localStorage', 'cookie'],        	
        },
      	compatibilityAPI: 'v1',
  		compatibilityJSON: 'v1',
    };    
});

