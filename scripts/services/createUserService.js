'use restrict';
var app = angular.module('njTransitApp');

app.factory('userService', ['$http', '$q', 
	function($http, $q) {
	var userService = {};
	userService.getUserData = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/users.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	} 

	userService.getEvents = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/events.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	userService.getTicketTypes = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/tickets.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	userService.getTransactions = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/transactionHistory.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}

	userService.getDevices = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/devices.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}

	userService.getUserTransactions = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/userTransactions.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	userService.getTicketTransactions = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/ticketTransactions.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	userService.getPaymentTransactions = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/paymentTransactions.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	userService.getStations = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/trainStations.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	return userService;
}])