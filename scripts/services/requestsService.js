'use restrict';
var app = angular.module('njTransitApp');

app.factory('requestService', ['$http', '$q', 
	function($http, $q) {
	var requestService = {};
	requestService.getNewImports = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/newImports.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	} 
	requestService.getRefundRequests = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/refundRequests.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	} 

	return requestService;
}])