'use restrict';
var app = angular.module('njTransitApp');

app.controller('userTransactionsController', ['$rootScope','$scope', '$state', 'userService', 'ngDialog',
	function($rootScope,$scope, $state, userService, ngDialog) {
		$scope.transactionsGridOptions = {
        	enableRowSelection : true,
	        multiSelect : false,
	        enableRowHeaderSelection : false,
	        enableFiltering: true
		};
		$scope.transactionID;
		$scope.devicesGridOptions = {
			enableRowSelection : true,
	        multiSelect : false,
	        enableRowHeaderSelection : false,
	        enableFiltering: true
		};
		$scope.ticketTransactionsGridOptions = {};
		$scope.ticketTrxDetailGridOptions = {
			enableRowSelection : true,
	        multiSelect : false,
	        enableRowHeaderSelection : false,
	        enableFiltering: true
		};
		$scope.paymentTransactionsGridOptions = {};
		$scope.paymentTrxGridOptions = {};
		$scope.paymentTrxGridOptions = {
			enableRowSelection : true,
	        multiSelect : false,
	        enableRowHeaderSelection : false,
	        enableFiltering: true
		};
		$scope.transactions = [];
		$scope.ticketTransactions = [];
		$scope.paymentTransactions = [];
		$scope.devices = [];
		function init() {
    		userService.getUserTransactions().then(function(data) {
    			$scope.transactions = data;    			
    		});

    		userService.getTicketTransactions().then(function(data) {
    			$scope.ticketTransactions = data;
    			$scope.constructTicketTransactionsGridOptions();
    			$scope.constructTicketTrxDetailGridOptions();
    		});

			userService.getPaymentTransactions().then(function(data) {
    			$scope.paymentTransactions = data;
    			$scope.constructPayTransGridOptions();
    			$scope.constructPayTrxGridOptions();
    		});

			userService.getDevices().then(function(data) {
				$scope.devices.push(data[0]);
				$scope.constructDevicesGridOptions();
			});
    	}
    	$scope.constructTransactionsGridOptions = function() {
    		var transactions = $scope.transactions;
    		$scope.transactions = [];
    		angular.forEach(transactions, function(transaction, key) {
    			if($scope.transactionID) {
    				transaction.trxSeqID = $scope.transactionID;
    			}
    			$scope.transactions.push(transaction);
    		})

	        $scope.transactionsGridOptions = {
	        	enableRowSelection : true,
		        multiSelect : false,
		        enableRowHeaderSelection : false,
		        enableFiltering: true,
	          	data : $scope.transactions,	          	
	          	columnDefs: [
	            	{ displayName: 'Sequence ID', field: 'trxSeqID', cellClass : 'gridCellClass', width : 200}, 
	          	  	//{ displayName: 'User ID', field: 'userID', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Email ID', field: 'emailID', cellClass : 'gridCellClass', width : 200},
            		{ displayName: 'Transaction Date', field: 'trxDate', cellClass : 'gridCellClass', width : 200},
	            	{ displayName: 'Amount', field : 'amount', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Last 4 of the CC#', field : 'deviceID', cellClass : 'gridCellClass', width : 200}
	          	]
	        };
    	};

    	$scope.transactionsGridOptions.onRegisterApi = function( gridApi ) {
		    $scope.gridApi = gridApi;
		    gridApi.selection.on.rowSelectionChanged($scope,function(row){
		        ngDialog.open ({
		        	template: '../njt-admin-portal/partials/views/components/user/transactionDetails.html',
		        	className: 'ngdialog-theme-default order-details',
		        	showClose : false,
		        	scope:$scope,
		        	width : '60%'    		
		        });
			});
		}

		$scope.constructTicketTransactionsGridOptions = function() {
			var actionCellTemplate = '<button class="btn btn--secondary btn--small btn--mobile-block"> {{row.entity.action}} </button>'
	        $scope.ticketTransactionsGridOptions = {
	          	data : $scope.ticketTransactions,
	          	enableFiltering: true,
	          	columnDefs: [
	            	{ displayName: 'Action', field: 'action', cellTemplate : actionCellTemplate, cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Seq ID', field: 'seqID', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Term No', field: 'termNo', cellClass : 'gridCellClass', width : 120}, 
	            	{ displayName: 'Ticket Type', field: 'ticketType', cellClass : 'gridCellClass', width : 120},
            		{ displayName: 'Trx No', field: 'trxNo', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Ztt.No.', field : 'zttNo', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Origin', field : 'origin', cellClass : 'gridCellClass', width : 200},
	            	{ displayName: 'Destination', field : 'destination', cellClass : 'gridCellClass', width : 200},
	            	{ displayName: 'Ticket Fare', field : 'ticketFare', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Activation Date', field : 'activationDate', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Deactivation Date', field : 'deactivationDate', cellClass : 'gridCellClass', width : 120}
	          	]
	        };
    	};

    	$scope.constructTicketTrxDetailGridOptions = function() {
    	 $scope.ticketTrxDetailGridOptions = {
	          	data : $scope.ticketTransactions,
	          	enableFiltering: true,
	          	columnDefs: [
	            	
	            	{ displayName: 'Seq ID', field: 'seqID', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Term No', field: 'termNo', cellClass : 'gridCellClass', width : 120}, 
	            	{ displayName: 'TT Id.', field : 'zttNo', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Ticket Type', field: 'ticketType', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Origin', field : 'origin', cellClass : 'gridCellClass', width : 200},
	            	{ displayName: 'Destination', field : 'destination', cellClass : 'gridCellClass', width : 200},
	            	{ displayName: 'Rider', field : 'rider', cellClass : 'gridCellClass', width : 200},
            		{ displayName: 'Amount', field : 'ticketFare', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Activation Date', field : 'activationDate', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Deactivation Date', field : 'deactivationDate', cellClass : 'gridCellClass', width : 120}
	          	]
	        };
    	};

    	$scope.constructPayTransGridOptions = function() {
	        $scope.paymentTransactionsGridOptions = {
	          	data : $scope.paymentTransactions,
	          	enableFiltering: true,
	          	columnDefs: [
	            	{ displayName: 'Term No', field: 'termNo', cellClass : 'gridCellClass', width : 100}, 
            		{ displayName: 'Trx No', field: 'trxNo', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Payment Amount.', field : 'paymentAmount', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Payment Abb 3', field : 'paymentAbb3', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Payment No', field : 'paymentNumber', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Credit Card No', field : 'creditCardNo', cellClass : 'gridCellClass', width : 150},
	            	{ displayName: 'Auth Code', field : 'authCode', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Retrival Reference No', field : 'retrivalRefNo', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'TPS Response Code', field : 'tfsResponseCode', cellClass : 'gridCellClass', width : 100}
	          	]
	        };
    	};

    	$scope.constructPayTrxGridOptions = function() {
	        $scope.paymentTrxGridOptions = {
	          	data : $scope.paymentTransactions,
	          	enableFiltering: true,
	          	columnDefs: [
	            	{ displayName: 'Sequence Id', field: 'termNo', cellClass : 'gridCellClass', width : 100}, 
            		{ displayName: 'Transaction Seq. Id', field: 'trxNo', cellClass : 'gridCellClass', width : 100},
            		{ displayName: 'Payment Type', field : 'paymentAbb3', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Payment Amount.', field : 'paymentAmount', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Credit Card No', field : 'creditCardNo', cellClass : 'gridCellClass', width : 150},
					{ displayName: 'retRefNo', field : 'retrivalRefNo', cellClass : 'gridCellClass', width : 100},	            	         	
	            	{ displayName: 'tpsRespCode', field : 'tfsResponseCode', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Auth Code', field : 'authCode', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Billing Id', field : 'billinId', cellClass : 'gridCellClass', width : 120}
	            	
	            	
	          	]
	        };
    	};

    	$scope.constructDevicesGridOptions = function() {
          $scope.devicesGridOptions = {
          data : $scope.devices,
          columnDefs: [
            { displayName: 'Device ID', field : 'deviceID', cellClass : 'gridCellClass', width : 150},
            { displayName: 'Carrier Name', field: 'carrierName',cellClass : 'gridCellClass', width : 150},
            { displayName: 'Device Manufacture Version', field : 'version',  cellClass : 'gridCellClass', width : 150},
			{ displayName: 'Device Model', field : 'model', cellClass : 'gridCellClass', width : 150},
			{ displayName: 'OS SDK Version', field : 'osSDKVersion', cellClass : 'gridCellClass', width : 150},
            { displayName: 'User ID', field: 'userID', cellClass : 'gridCellClass', width : 150},
            { displayName: 'Email ID', field: 'emailID', cellClass : 'gridCellClass', width : 150},
            { displayName: 'User Activity', field: 'userActivity', cellClass : 'gridCellClass', width : 150}, 
            { displayName: 'OS Release Version', field : 'osRelease', cellClass : 'gridCellClass', width : 150},
            { displayName: 'App Version', field : 'appVersion', cellClass : 'gridCellClass', width : 150}      
          ]
        };
      }
    	init();
	}
]);