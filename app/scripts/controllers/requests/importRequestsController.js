
'use restrict';
var app = angular.module('njTransitApp');

app.controller('importRequestsController', ['$rootScope','$scope', '$state', 'requestService', 'ngDialog',
	function($rootScope,$scope, $state, requestService, ngDialog) {
		$scope.newImportGridOptions = {};
		$scope.pendingImportGridOptions = {};
		$scope.importHistoryGridOptions = {};

		init();
		function init() {
			requestService.getNewImports().then(function(data) {					
				$scope.newImportGridOptions.data = data;	
				$scope.pendingImportGridOptions.data = data;
				$scope.importHistoryGridOptions.data = data;
			});
		}

		$scope.constructImpGridOptions = function() {
			var approveCellTemplate = '<a><i class="fa fa-thumbs-up fa-lg" style="color:green;" aria-hidden="true"></i> </a>';
		   	$scope.newImportGridOptions.enableRowSelection = true;
            $scope.newImportGridOptions.multiSelect = false;
       		$scope.newImportGridOptions.enableRowHeaderSelection = false;
       		$scope.newImportGridOptions.enableFiltering = true;
            $scope.newImportGridOptions.columnDefs = [
          		{ displayName: 'Approve', field: 'approve', cellTemplate: approveCellTemplate, cellClass : 'gridCellClass', width : 120},
	            { displayName: 'User ID', field: 'userID', cellClass : 'gridCellClass', width : 250},
	            { displayName: 'Email ID', field: 'emailID', cellClass : 'gridCellClass', width : 250}
            ];
		}


		$scope.newImportGridOptions.onRegisterApi = function( gridApi ) {
		    $scope.gridApi = gridApi;
		    gridApi.selection.on.rowSelectionChanged($scope,function(row){
		        ngDialog.open ({
		        	template: '../njt-admin-portal/partials/views/components/requests/newImportDetails.html',
		        	className: 'ngdialog-theme-default order-details',
		        	showClose : false,
		        	scope:$scope,
		        	width : '60%'    		
		        });
			});
		}
		$scope.constructPendingImpGridOptions = function() {
			   var cancelCellTemplate = '<a><i class="fa fa-thumbs-down fa-lg" style="color:red;" aria-hidden="true"></i> </a>';
			$scope.pendingImportGridOptions = {
	         	enableGridMenu : false,
	         	enableFiltering: true,
	            columnDefs: [
	          		{ displayName: 'Cancel', field: 'approve', cellTemplate: cancelCellTemplate, cellClass : 'gridCellClass', width : 120},
		            { displayName: 'User ID', field: 'userID', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Email ID', field: 'emailID', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Approved By', field: 'approvedBy', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Approved Date', field: 'approvedDate', cellClass : 'gridCellClass', width : 250}
	            ]
	        };

		}

		$scope.constructImpHisotryGridOptions = function() {
			$scope.importHistoryGridOptions = {
	         	enableGridMenu : false,
	         	enableFiltering: true,
	            columnDefs: [
	          		{ displayName: 'User ID', field: 'userID', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Email ID', field: 'emailID', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Import Date', field: 'importDate', cellClass : 'gridCellClass', width : 250},
		            { displayName: 'Phone Number', field: 'phoneNumber', cellClass : 'gridCellClass', width : 200},
		            { displayName: 'Status', field: 'status', cellClass : 'gridCellClass', width : 150},
		            { displayName: 'Admin Name', field: 'adminName', cellClass : 'gridCellClass', width : 200},
		            { displayName: 'Import Approved Date', field: 'importApproveDate', cellClass : 'gridCellClass', width : 200},
	            ]
	        };
		}


		

	}]);