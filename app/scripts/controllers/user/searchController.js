'use restrict';
var app = angular.module('njTransitApp');

app.controller('searchController', ['$rootScope','$scope','userService', '$state', '$location',
	function($rootScope,$scope, userService, $state, $location) {
    $scope.searchBy = "user";
    $scope.searchPayment = "card";
		
	}]);