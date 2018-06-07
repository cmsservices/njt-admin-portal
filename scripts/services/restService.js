'use restrict';
var app = angular.module('njTransitApp');

app.factory('restService', ['$http', '$q', 
	function($http, $q) {
		var restService = {};
		restService.getData = function(params) { 
            var deferred = $q.defer();           
            $http({
                    method : 'POST',
                    url    : "https://www.etikcloud.com/njt-web-portal/rs",
                    data   : $.param({
	                            'action'      : params.action,
	                            'version'     : params.version,
	                            'data'        : JSON.stringify(params.data),
	                            'device_type' : 'WEB',
	                            'f'           : 'json'
                   			 }),
                    headers : {
                        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                        
                    }  
            }).success(function(data) {
                deferred.resolve(data.data);
                console.log("applicationservice success  data: "+JSON.stringify(data));
            }).error(function(error) {
                console.log("applicationservice failure data: "+JSON.stringify(error));
                deferred.reject(error);
            });
            return deferred.promise;
        }

        return restService;
	}
]);