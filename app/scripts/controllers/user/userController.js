'use restrict';
var app = angular.module('njTransitApp');

app.controller('userController', ['$rootScope','$scope','userService', '$state', '$location', 'ngDialog',
	function($rootScope,$scope, userService, $state, $location, ngDialog) {
		$scope.devices =[];
    $scope.users = [];
		$scope.devicesGridOptions = {
      enableFiltering: true,
      enableGridMenu : false
    };
    $scope.user = {};
    $scope.user.blocked = false;
    $scope.searchUserGridOptions = {
        enableRowSelection : true,
        multiSelect : false,
        enableRowHeaderSelection : false,
        enableFiltering : true
    };

    $scope.userTransactionsGridOptions = {
          enableRowSelection : true,
          multiSelect : false,
          enableRowHeaderSelection : false,
          enableFiltering: true
    };

    $scope.isRefund1 = false; 
    $scope.isRefund2 = false;
    $scope.isCreateNote = false;
    $scope.userTransactions = [];

    $scope.userId;
    $scope.comments;

    $scope.refundType = "standard";
    
    function init() {
        userService.getUserTransactions().then(function(data) {
          $scope.userTransactions = data;         
          $scope.constructUserTransactionsGridOptions();
        });
    }

		$scope.getDevices = function() {
			userService.getDevices().then(function(data) {
				$scope.devices = data;
				$scope.constructDevicesGridOptions();
			});
		}

    $scope.refund1 = function() {
      $scope.isRefund1 = !$scope.isRefund1;
    }
    $scope.refund2 = function() {
      $scope.isRefund2 = !$scope.isRefund2;
    }


    $scope.createNote = function() {
      $scope.isCreateNote = !$scope.isCreateNote;
    }

    $scope.getUsers = function() {
      $scope.users = [];
      userService.getDevices().then(function(data) {
        $scope.users.push(data[0]);
        if($scope.userId) {
          $scope.users[0].userID = $scope.userId;
        }        
        $scope.constructUserGridOptions();
      });
    }

    $scope.constructUserGridOptions = function() {
          $scope.searchUserGridOptions.data = $scope.users;
          $scope.searchUserGridOptions.columnDefs = [
            { displayName: 'User ID', field: 'userID', cellClass : 'gridCellClass', width : 150},
            { displayName: 'Email ID', field: 'emailID', cellClass : 'gridCellClass', width : 150},
            { displayName: 'User Activity', field: 'userActivity', cellClass : 'gridCellClass', width : 150}, 
            { displayName: 'Carrier Name', field: 'carrierName',cellClass : 'gridCellClass', width : 150},
            { displayName: 'Phone', field : 'phone', cellClass : 'gridCellClass', width : 150},
            { displayName: 'Device ID', field : 'deviceID', cellClass : 'gridCellClass', width : 150},
            { displayName: 'App ID', field : 'appID', cellClass : 'gridCellClass', width : 150}           
          ]
      }

      $scope.constructDevicesGridOptions = function() {
          $scope.devicesGridOptions = {
          data : $scope.devices,
          columnDefs: [
            { displayName: 'User Activity',enableColumnMenu : false, field: 'userActivity', cellClass : 'gridCellClass', width : 150}, 
            { displayName: 'Carrier Name',enableColumnMenu : false, field: 'carrierName',cellClass : 'gridCellClass', width : 150},
            { displayName: 'Model',enableColumnMenu : false, field : 'model', cellClass : 'gridCellClass', width : 150},
            { displayName: 'Version',enableColumnMenu : false, field : 'version',  cellClass : 'gridCellClass', width : 150},
            { displayName: 'OS SDK Version',enableColumnMenu : false, field : 'osSDKVersion', cellClass : 'gridCellClass', width : 150},
            { displayName: 'OS Release',enableColumnMenu : false, field : 'osRelease', cellClass : 'gridCellClass', width : 150},
            { displayName: 'Phone',enableColumnMenu : false, field : 'phone', cellClass : 'gridCellClass', width : 150},
            { displayName: 'Device ID',enableColumnMenu : false, field : 'deviceID', cellClass : 'gridCellClass', width : 150},
            { displayName: 'App ID',enableColumnMenu : false, field : 'appID', cellClass : 'gridCellClass', width : 150},
            { displayName: 'IMEI',enableColumnMenu : false, field : 'IMEI', cellClass : 'gridCellClass', width : 150},
            { displayName: 'App Version',enableColumnMenu : false, field : 'appVersion', cellClass : 'gridCellClass', width : 150}
          ]
        };
      }


      $scope.searchUserGridOptions.onRegisterApi = function( gridApi ) {
        $scope.gridApi = gridApi;       
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
           $scope.user = row.entity;
           $scope.manageUser($scope.user);
        });
      }  
      
      $scope.openCreateNoteDialog = function(action) {
        $scope.action = action;
        ngDialog.open ({
              template: '../njt-admin-portal/partials/views/components/user/createNote.html',
              className: 'ngdialog-theme-default order-details',
              showClose : false,
              scope:$scope                   
          });     

      };


      $scope.updateAccountInfo = function() {
        if($scope.action === 'updateAccountInfo') {
            ngDialog.open ({
                template: '../njt-admin-portal/partials/views/components/user/accountInformation.html',
                className: 'ngdialog-theme-default order-details',
                showClose : false,
                scope:$scope,
                width : '60%'       
          });
        } else if($scope.action === 'refund') {
            ngDialog.open ({
                template: '../njt-admin-portal/partials/views/components/user/refund.html',
                className: 'ngdialog-theme-default order-details',
                showClose : false,
                scope:$scope    
          });
        } else if($scope.action === 'deactivate') {

        } else {
            $state.go('welcome.meadowLandsTicketing');      
        }
          
      }

      

      $scope.constructUserTransactionsGridOptions = function() {
          var transactions = $scope.userTransactions;
          $scope.userTransactions = [];
          angular.forEach(transactions, function(transaction, key) {          
            transaction.userID = $scope.userID;
            transaction.emailID = $scope.userID;
            $scope.userTransactions.push(transaction);
          });

          $scope.userTransactionsGridOptions = {
            enableRowSelection : true,
            multiSelect : false,
            enableRowHeaderSelection : false,
            enableFiltering: true,
              data : $scope.userTransactions,             
              columnDefs: [
                { displayName: 'Transaction ID', field: 'trxSeqID', cellClass : 'gridCellClass', width : 200},
                { displayName: 'Transaction Date', field: 'trxDate', cellClass : 'gridCellClass', width : 250},
                { displayName: 'Amount', field : 'amount', cellClass : 'gridCellClass', width : 100},
                { displayName: 'Device ID', field : 'deviceID', cellClass : 'gridCellClass', width : 200}
              ]
          };
      };

      $scope.userTransactionsGridOptions.onRegisterApi = function( gridApi ) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
            ngDialog.open ({
              template: '../njt-admin-portal/partials/views/components/user/userTransactionDetails.html',
              className: 'ngdialog-theme-default order-details',
              showClose : false,
              scope:$scope   
            });
        });
      }

      init();
	}]);