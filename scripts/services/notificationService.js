'use restrict';
var app = angular.module('njTransitApp');

app.factory('notificationService', ['$http', '$q', 
	function($http, $q) {
	var notificationService = {};
	notificationService.getPushNotificattions = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/pushNotifications.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	} 
	notificationService.getAlertHistory = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/alertHistory.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	} 

	return notificationService;
}])