'use restrict';
var app = angular.module('njTransitApp');

app.factory('userService', ['$http', '$q', 
	function($http, $q) {
	var userService = {};
	userService.getUserData = function() {
		var deffered = $q.defer();
		$http.get('mock/users.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	} 

	userService.getEvents = function() {
		var deffered = $q.defer();
		$http.get('mock/events.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	userService.getTicketTypes = function() {
		var deffered = $q.defer();
		$http.get('mock/tickets.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	userService.getTransactions = function() {
		var deffered = $q.defer();
		$http.get('mock/transactionHistory.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}

	userService.getDevices = function() {
		var deffered = $q.defer();
		$http.get('mock/devices.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}

	userService.getUserTransactions = function() {
		var deffered = $q.defer();
		$http.get('mock/userTransactions.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	userService.getTicketTransactions = function() {
		var deffered = $q.defer();
		$http.get('mock/ticketTransactions.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	userService.getPaymentTransactions = function() {
		var deffered = $q.defer();
		$http.get('mock/paymentTransactions.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	userService.getStations = function() {
		var deffered = $q.defer();
		$http.get('mock/trainStations.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	return userService;
}])