
'use restrict';
var app = angular.module('njTransitApp');

app.controller('reportsController', ['$rootScope','$scope', '$state', 'requestService', 'ngDialog',
	function($rootScope,$scope, $state, requestService, ngDialog) {
		$scope.reports = [];
		$scope.AlarmReports = [{
			"reportName" : "Alarm Count Report"			
		},{
			"reportName" : "Agent's Monthly",			
		}];

		$scope.cashReports = [{
			"reportName" : "Cash Statistic - Bill Vault"
		},{
			"reportName" : "Cash Statistic - BUCO Changes"
		},{
			"reportName" : "Cash Statistic - Coin Drum Changes"
		},{
			"reportName" : "Cash Statistic - Coin Drum Refill"
		},{
			"reportName" : "Cash Statistic - Coin Vault"
		},{
			"reportName" : "Cash Statistic - ELCO"
		},{
			"reportName" : "Cash Statistic - Money Account Status"
		},{
			"reportName" : "Cash Statistic - Recycler Changes"
		}];

		$scope.dailyReports = [{
			"reportName" : "Daily Balance Sheet"
		},{
			"reportName" : "Daily Overage & Shortage"
		},{
			"reportName" : "Daily Station Activity Report"
		},{
			"reportName" : "Date_Test_P_TRX"
		}];

		$scope.EFTReports = [{
			"reportName" : "EFT Bank Diff Details"
		},{
			"reportName" : "EFT Report"
		},{
			"reportName" : "EFT Summary Report"
		}];

		$scope.mobileReports = [{
			"reportName" : "Mobile Feedback"
		},{
			"reportName" : "Mobile Flash Report"
		},{
			"reportName" : "Mobile Ticket Details"
		}];
		$scope.revenueReports = [{
			"reportName" : "Mobile Feedback"
		},{
			"reportName" : "Mobile Flash Report"
		},{
			"reportName" : "Mobile Ticket Details"
		}];
		$scope.salesReports = [{
			"reportName" : "Sales Balance"
		},{
			"reportName" : "Sales Statistic Payment Details"
		},{
			"reportName" : "Sales Statistics"
		},{
			"reportName" : "Sales Statistics Multipayment"
		},{
			"reportName" : "Sales Statistics MySQL"
		}];
		$scope.terminalReports = [{
			"reportName" : "Terminal Error Report"
		},{
			"reportName" : "Terminal Error Service Correlation Report"
		},{
			"reportName" : "Terminal Service Report"
		}];

		$scope.selectedReport;


		function init() {
			if($scope.reportName === 'Alarm Reports') {
				$scope.reports = $scope.AlarmReports;
			} else if($scope.reportName === 'Cash Reports') {
				$scope.reports = $scope.cashReports;
			} else if($scope.reportName === 'Daily Reports') {
				$scope.reports = $scope.dailyReports;
			} else if($scope.reportName === 'EFT Reports') {
				$scope.reports = $scope.EFTReports;
			} else if($scope.reportName === 'Mobile Reports') {
				$scope.reports = $scope.mobileReports;
			} else if($scope.reportName === 'Revenue Reports') {
				$scope.reports = $scope.revenueReports;
			} else if($scope.reportName === 'Sales Reports') {
				$scope.reports = $scope.salesReports;
			} else if($scope.reportName === 'Terminal Reports') {
				$scope.reports = $scope.terminalReports;
			} 

			$scope.selectedReport = $scope.reports[0];
		}
		
		 $scope.$watch('reportName', function(oldValue, newValue) {
		    init();
	  	 }, true);
	}]);