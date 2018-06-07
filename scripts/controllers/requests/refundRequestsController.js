
'use restrict';
var app = angular.module('njTransitApp');

app.controller('refundRequestsController', ['$rootScope','$scope', '$state', 'requestService', 'ngDialog',
	function($rootScope,$scope, $state, requestService, ngDialog) {
		$scope.refunds = [];		
		$scope.pendingRefundGridOptions = {};
		$scope.refundHistoryGridOptions = {};

		init();

		function init() {
			requestService.getRefundRequests().then(function(data) {
				$scope.refunds = data;
				$scope.constructRefundGridOptions();
			});
		}

		$scope.constructRefundGridOptions = function() {
			var actionCellTemplate = '<a><i class="fa fa-thumbs-up fa-lg" style="color:green;" aria-hidden="true"></i> </a>'
		       +'<a><i class="fa fa-thumbs-down fa-lg" style="color:red;" aria-hidden="true"></i> </a>';
			$scope.pendingRefundGridOptions = {
	         	data : $scope.refunds,
	         	enableGridMenu : false,
	         	enableFiltering: true,
	            columnDefs: [
	          		{ displayName: 'Action', field: 'action', cellTemplate: actionCellTemplate, cellClass : 'gridCellClass', width : 120},
		            { displayName: 'Ref. ID', field: 'refID', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Ref. Status', field: 'refundStatus', cellClass : 'gridCellClass', width : 250},
    	          	{ displayName: 'User ID', field: 'userID', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Email ID', field: 'emailID', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Refund Request Date', field: 'refundRequestDate', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Term. No.', field: 'termNo', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Ticket Fare', field: 'ticketFare', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Ticket. Type', field: 'ticketType', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'TRX. Date', field: 'trxDate', cellClass : 'gridCellClass', width : 250}
	            ]
	        };

			$scope.refundHistoryGridOptions = {
	         	data : $scope.refunds,
	         	enableGridMenu : false,
	         	enableFiltering: true,
	            columnDefs: [
	          		{ displayName: 'User ID', field: 'userID', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Email ID', field: 'emailID', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Ref. ID', field: 'refID', cellClass : 'gridCellClass', width : 100},
		            { displayName: 'Ref. Status', field: 'refundStatus', cellClass : 'gridCellClass', width : 150},
		            { displayName: 'Refund Request Date', field: 'refundRequestDate', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Refund Amount', field: 'refundAmount', cellClass : 'gridCellClass', width : 100},
					{ displayName: 'Ticket Fare', field: 'ticketFare', cellClass : 'gridCellClass', width : 120},
		            { displayName: 'TRX. Date', field: 'trxDate', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Ticket. Type', field: 'ticketType', cellClass : 'gridCellClass', width : 100},
		            { displayName: 'Origin - Destination', field: 'originDestination', cellClass : 'gridCellClass', width : 150},
		            { displayName: 'Term. No.', field: 'termNo', cellClass : 'gridCellClass', width : 100}		           
	            ]
	        };
		}		

	}]);