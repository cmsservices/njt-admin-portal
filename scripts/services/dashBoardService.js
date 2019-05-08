'use restrict';
var app = angular.module('njTransitApp');

app.factory('dashBoardService', ['$http', '$q', 
	function($http, $q) {
	var dashBoardService = {};
	dashBoardService.getUserData = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/users.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}, 
	dashBoardService.getSystemStatus = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/stations.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}, 
	dashBoardService.getTransactions = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/transactions.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	},
	dashBoardService.getNjtTransactions = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/njtTransactions.JSON').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	},

	dashBoardService.getSupportCalender = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/supportCalender.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	dashBoardService.getTerminals = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/terminals.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	dashBoardService.getTerminalStatus = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/terminalStatus.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	dashBoardService.getTerminalServiceHistory = function() {
		var deffered = $q.defer();
		$http.get('resources/mock/terminalServiceHistory.json').then(function(response) {
			deffered.resolve(response.data);
		},function(error) {
			deffered.reject(error);
		});
	 	return deffered.promise;
	}
	return dashBoardService;
}])