
'use restrict';
var app = angular.module('njTransitApp');

app.controller('notificationController', ['$rootScope','$scope', '$state', 'notificationService', 'ngDialog','$filter',
	function($rootScope,$scope, $state, notificationService, ngDialog, $filter) {
		$scope.notifications = [];
		$scope.alertHistory = [];		
		$scope.selectedUsergroup = "default";
		$scope.selectedPriority = "default";
		$scope.selectedColorCode;	
		$scope.selectedAlert = "default";
		$scope.selectedAlertMessage = "Alert Message";
		$scope.alertHistory = {};
		$scope.alertHistoryGridOptions = {};
		
		init();
		function init() {
			notificationService.getPushNotificattions().then(function(data) {
				$scope.notifications = data;
			});
			notificationService.getAlertHistory().then(function(data) {
				$scope.alertHistory = data;
				$scope.constructHistoryAlerts();
			});
		}

	    $scope.getColorCodeDisplayValue=function(option){
	       return $filter('date')(option.start, 'MMM d, h:mma')+" - "+$filter('date')(option.end, 'MMM d, h:mma')+" "+option.color_code;
	    };

	    $scope.setSelectedAlert = function() {
	    	$scope.selectedAlertMessage= JSON.parse($scope.selectedAlert).messages;
	    }

	    $scope.constructHistoryAlerts = function() {
	    	$scope.alertHistoryGridOptions = {
	         	enableGridMenu : false,
	         	enableFiltering: true,
				data : $scope.alertHistory,
	            columnDefs: [
	          		{ displayName: 'Group', field: 'user_group_id', cellClass : 'gridCellClass', width : 120},
		            { displayName: 'Title', field: 'title', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Message', field: 'message', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Scheduled Date', field: 'schedule_date', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Sent Date', field: 'create_date', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Expiration Date', field: 'expire_date', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'ID', field: 'id', cellClass : 'gridCellClass', width : 100}
	            ]
	        };
	    }
}]);