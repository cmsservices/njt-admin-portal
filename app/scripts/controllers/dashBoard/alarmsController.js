'use restrict';
var app = angular.module('njTransitApp');

app.controller('alarmsController', ['$rootScope','$scope', '$state', 'dashBoardService', 'ngDialog',
function($rootScope,$scope, $state, dashBoardService, ngDialog) {
	$scope.alarms = [];
	$scope.terminalGridOptions = {};
	$scope.terminalStatus = [];
	$scope.filterClosedAlarms = false;
	$scope.serviceHistoryGridOptions = {};
	$scope.statusGridOptions = {};
	$scope.alarmsGridOptions = {};
	init();
	function init() {
		$scope.alarms = [];
		angular.forEach($scope.terminals, function(terminal, key) {
			if(terminal.alarms) {
				angular.forEach(terminal.alarms, function(alarm, alarmKey) {
					var tempAlarm = alarm;
					tempAlarm.serviceType = terminal.serviceType;
					tempAlarm.line = terminal.lineName;
					tempAlarm.stationName = terminal.stationName;
					tempAlarm.terminalNumber = terminal.terminalNumber;
					tempAlarm.terminalType = terminal.terminalType
					$scope.alarms.push(tempAlarm);
				});
			}
		});	
		var terminalCellTemplate = '<a class="badge badge--info-alt" style="cursor:pointer;" ng-click="grid.appScope.openManageTerminalModal(row.entity);"> {{row.entity.terminalNumber}} </a>'			
		var alarmCodeTemplate = '<span ng-if="row.entity.alarmCode == 5017" style="color : orange;"> {{row.entity.alarmCode}} </span>' +
		'<span ng-if="row.entity.alarmCode == 401" style="color : brown;"> {{row.entity.alarmCode}} </span>' +
		'<span ng-if="row.entity.alarmCode == 380" style="color : orange;"> {{row.entity.alarmCode}} </span>' + 
		'<span ng-if="row.entity.alarmCode == 396" style="color : black;"> {{row.entity.alarmCode}} </span>' + 
		'<span ng-if="row.entity.alarmCode == 1170" style="color : red;"> {{row.entity.alarmCode}} </span>' + 
		'<span ng-if="row.entity.alarmCode != 1170 && row.entity.alarmCode != 401 && row.entity.alarmCode != 5017 && row.entity.alarmCode != 380 && row.entity.alarmCode != 396" ' + 
		' style="color : orange;"> {{row.entity.alarmCode}} </span>'

		 $scope.terminalGridOptions = {
		 	enableFiltering: true,
          	data : $scope.alarms,
          	columnDefs: [
            	{ displayName: 'Terminal', enableColumnMenu : false, field: 'terminalNumber',cellTemplate : terminalCellTemplate, cellClass : 'gridCellClass', width : 100},
            	{ displayName: 'Station', enableColumnMenu : false, field: 'stationName', cellClass : 'gridCellClass', width : 150},
            	{ displayName: 'Type', enableColumnMenu : false, field: 'terminalType', cellClass : 'gridCellClass', width : 100}, 
        		{ displayName: 'Code', cellTemplate : alarmCodeTemplate,  enableColumnMenu : false, field: 'alarmCode', cellClass : 'gridCellClass', width : 100},
            	{ displayName: 'Description', enableColumnMenu : false, field : 'alarmDescription', cellClass : 'gridCellClass', width : 220},
            	{ displayName: 'Alarm Occured', enableColumnMenu : false, field : 'alarmOccured', cellClass : 'gridCellClass', width : 150},
            	{ displayName: 'Dispatch Occured', enableColumnMenu : false, field : 'dispatchOccured', cellClass : 'gridCellClass', width : 120},
            	{ displayName: 'Dispatcher', enableColumnMenu : false, field : 'dispatcher', cellClass : 'gridCellClass', width : 100},
            	{ displayName: 'Door', enableColumnMenu : false, field : 'door', cellClass : 'gridCellClass', width : 100},
            	{ displayName: 'Category', enableColumnMenu : false, field : 'category', cellClass : 'gridCellClass', width : 100}
          	]
        };
	}

	$scope.openManageTerminalModal = function(selectedTerminal) {
		$scope.selectedTerminal = selectedTerminal;
        ngDialog.open ({
        	template: '../njt-admin-portal/partials/views/components/dashboard/terminalDetails.html',
        	className: 'ngdialog-theme-default order-details',
        	showClose : false,
        	scope:$scope,
        	width : '60%'    		
        });
	}

	$scope.getAlarmsByTerminalID = function() {		
		$scope.alarmsByTerminalID = [];
		angular.forEach($scope.services, function(value, key) {
			angular.forEach(value.serviceLines, function(lineValue,lineKey) {
				angular.forEach(lineValue.stations, function(stationValue,stationKey) {
					angular.forEach(stationValue.terminals, function(terminal,terminalKey) {
						if(terminal.terminalNumber === $scope.selectedTerminal.terminalNumber) {
							angular.forEach(terminal.alarms, function(alarm, alarmKey) {
								var tempAlarm = alarm;
								tempAlarm.serviceType = terminal.serviceType;
								tempAlarm.line = terminal.lineName;
								tempAlarm.stationName = terminal.station;
								tempAlarm.terminalNumber = terminal.terminalNumber;
								tempAlarm.terminalType = terminal.terminalType
								$scope.alarmsByTerminalID.push(tempAlarm);
							});
						}						
					});
				});	
			});				
		});
		$scope.alarmsGridOptions   = {
		 	enableFiltering: true,
          	data : $scope.alarmsByTerminalID,
          	columnDefs: [
            	{ displayName: 'Terminal', enableColumnMenu : false, field: 'terminalNumber', cellClass : 'gridCellClass', width : 100},
            	{ displayName: 'Station', enableColumnMenu : false, field: 'stationName', cellClass : 'gridCellClass', width : 120},
            	{ displayName: 'Type', enableColumnMenu : false, field: 'terminalType', cellClass : 'gridCellClass', width : 100}, 
        		{ displayName: 'Code', enableColumnMenu : false, field: 'alarmCode', cellClass : 'gridCellClass', width : 100},
            	{ displayName: 'Description', enableColumnMenu : false, field : 'alarmDescription', cellClass : 'gridCellClass', width : 180},
            	{ displayName: 'Alarm Occured', enableColumnMenu : false, field : 'alarmOccured', cellClass : 'gridCellClass', width : 120},
            	{ displayName: 'Dispatch Occured', enableColumnMenu : false, field : 'dispatchOccured', cellClass : 'gridCellClass', width : 120},
            	{ displayName: 'Dispatcher', enableColumnMenu : false, field : 'dispatcher', cellClass : 'gridCellClass', width : 100},
            	{ displayName: 'Door', enableColumnMenu : false, field : 'door', cellClass : 'gridCellClass', width : 100},
            	{ displayName: 'Category', enableColumnMenu : false, field : 'category', cellClass : 'gridCellClass', width : 100}
          	]
        };
	}

	$scope.constructStatusGridOptions = function() {
		dashBoardService.getTerminalStatus().then(function(terminalStatus) {
			var terminalCellTemplate = '<a class="badge badge--info-alt" style="cursor:pointer;" ng-click="grid.appScope.openManageTerminalModal(row.entity);"> {{row.entity.terminalNumber}} </a>'	;
			var severityTemplate = '<span ng-if="row.entity.severity === \'OK\'" class="badge badge--success-alt"> {{row.entity.severity}} </span>' +
			'<span ng-if="row.entity.severity === \'warning\'" class="badge badge--warning-alt"> {{row.entity.severity}} </span>'	+
			'<span ng-if="row.entity.severity === \'Major\' || row.entity.severity === \'critical\'" class="badge badge--error-alt"> {{row.entity.severity}} </span>'									
			$scope.statusGridOptions= {				
			 	enableFiltering: true,
	          	data : terminalStatus,
	      		columnDefs: [
	            	{ displayName: 'Terminal#', enableColumnMenu : false, field: 'terminalNumber',cellTemplate : terminalCellTemplate, cellClass : 'gridCellClass', width : 150},
	            	{ displayName: 'Station', enableColumnMenu : false, field: 'stationName', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'OP. Status', enableColumnMenu : false, field: 'opStatus', cellClass : 'gridCellClass', width : 120}, 
	        		{ displayName: 'Severity', cellTemplate : severityTemplate, enableColumnMenu : false, field: 'severity', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Time', enableColumnMenu : false, field : 'time', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Printer', enableColumnMenu : false, field : 'printer', cellClass : 'gridCellClass', width : 160},
	            	{ displayName: 'Paper', enableColumnMenu : false, field: 'paper', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Bill', enableColumnMenu : false, field: 'bill', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'BUCO', enableColumnMenu : false, field: 'buco', cellClass : 'gridCellClass', width : 120}, 
	        		{ displayName: 'Bill Vault', enableColumnMenu : false, field: 'billVault', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Coin', enableColumnMenu : false, field : 'coin', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Coin Vault', enableColumnMenu : false, field : 'coinVault', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Drum', enableColumnMenu : false, field: 'drum', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Card Reader', enableColumnMenu : false, field: 'cardReader', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Pinpad', enableColumnMenu : false, field: 'pinpad', cellClass : 'gridCellClass', width : 120}, 
	            	{ displayName: 'Admin Status', enableColumnMenu : false, field : 'adminStatus', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'BNR', enableColumnMenu : false, field : 'BNR', cellClass : 'gridCellClass', width : 80},
	          	]
       		};
		});
	}
	
	$scope.statusByTerminalGridOptions = {};

	$scope.getstatsforTerminalID = function() {
		dashBoardService.getTerminalStatus().then(function(terminalStatus) {
			var terminalCellTemplate = '<a class="badge badge--info-alt" style="cursor:pointer;" ng-click="grid.appScope.openManageTerminalModal(row.entity);"> {{grid.appScope.selectedTerminal.terminalNumber}} </a>'	;
			var severityTemplate = '<span ng-if="row.entity.severity === \'OK\'" class="badge badge--success-alt"> {{row.entity.severity}} </span>' +
			'<span ng-if="row.entity.severity === \'warning\'" class="badge badge--warning-alt"> {{row.entity.severity}} </span>'	+
			'<span ng-if="row.entity.severity === \'Major\' || row.entity.severity === \'critical\'" class="badge badge--error-alt"> {{row.entity.severity}} </span>'									
			$scope.statusByTerminalGridOptions= {				
			 	enableFiltering: true,
	          	data : terminalStatus,
	      		columnDefs: [
	            	{ displayName: 'Terminal#', enableColumnMenu : false, field: 'terminalNumber',cellTemplate : terminalCellTemplate, cellClass : 'gridCellClass', width : 150},
	            	{ displayName: 'Station', enableColumnMenu : false, field: 'stationName', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'OP. Status', enableColumnMenu : false, field: 'opStatus', cellClass : 'gridCellClass', width : 120}, 
	        		{ displayName: 'Severity', cellTemplate : severityTemplate, enableColumnMenu : false, field: 'severity', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Time', enableColumnMenu : false, field : 'time', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Printer', enableColumnMenu : false, field : 'printer', cellClass : 'gridCellClass', width : 160},
	            	{ displayName: 'Paper', enableColumnMenu : false, field: 'paper', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Bill', enableColumnMenu : false, field: 'bill', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'BUCO', enableColumnMenu : false, field: 'buco', cellClass : 'gridCellClass', width : 120}, 
	        		{ displayName: 'Bill Vault', enableColumnMenu : false, field: 'billVault', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Coin', enableColumnMenu : false, field : 'coin', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Coin Vault', enableColumnMenu : false, field : 'coinVault', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Drum', enableColumnMenu : false, field: 'drum', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Card Reader', enableColumnMenu : false, field: 'cardReader', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Pinpad', enableColumnMenu : false, field: 'pinpad', cellClass : 'gridCellClass', width : 120}, 
	            	{ displayName: 'Admin Status', enableColumnMenu : false, field : 'adminStatus', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'BNR', enableColumnMenu : false, field : 'BNR', cellClass : 'gridCellClass', width : 80},
	          	]
       		};
		});
	}

	$scope.constructSHGridOptions = function() {
		var terminalCellTemplate = '<a class="badge badge--info-alt" style="cursor:pointer;" ng-click="grid.appScope.openManageTerminalModal(row.entity);"> {{row.entity.terminalNumber}} </a>'			
		$scope.terminalGridOptions = {
		 	enableFiltering: true,
          	data : $scope.alarms,
          	columnDefs: [
            	{ displayName: 'Terminal#', enableColumnMenu : false, field: 'terminalNumber',cellTemplate : terminalCellTemplate, cellClass : 'gridCellClass', width : 100},
            	{ displayName: 'Station', enableColumnMenu : false, field: 'stationName', cellClass : 'gridCellClass', width : 120},
            	{ displayName: 'Type', enableColumnMenu : false, field: 'terminalType', cellClass : 'gridCellClass', width : 120}, 
        		{ displayName: 'Code', enableColumnMenu : false, field: 'alarmCode', cellClass : 'gridCellClass', width : 120},
            	{ displayName: 'Description', enableColumnMenu : false, field : 'alarmDescription', cellClass : 'gridCellClass', width : 150},
            	{ displayName: 'Alarm Occured', enableColumnMenu : false, field : 'alarmOccured', cellClass : 'gridCellClass', width : 200},
            	{ displayName: 'Dispatch Occured', enableColumnMenu : false, field : 'dispatchOccured', cellClass : 'gridCellClass', width : 120},
            	{ displayName: 'Dispatcher', enableColumnMenu : false, field : 'dispatcher', cellClass : 'gridCellClass', width : 150},
            	{ displayName: 'Door', enableColumnMenu : false, field : 'door', cellClass : 'gridCellClass', width : 100},
            	{ displayName: 'Category', enableColumnMenu : false, field : 'category', cellClass : 'gridCellClass', width : 100}
          	]
        };
	}

	$scope.getServiceHistory = function() {
		$scope.serviceHistoryGridOptions = {};
		var serviceHistory = [];
		dashBoardService.getTerminalServiceHistory().then(function(history) {
			angular.forEach(history, function(value, key) {
				value.terminalNumber  = $scope.selectedTerminal.terminalNumber;
				value.stationName = $scope.selectedTerminal.stationName;
				value.terminalType = $scope.selectedTerminal.terminalType;
				serviceHistory.push(value);
			});
			$scope.serviceHistoryGridOptions = {
				enableFiltering : true,
				data : serviceHistory,
				columnDefs : [
					{ displayName: 'Terminal#', enableColumnMenu : false, field: 'terminalNumber', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'Station', enableColumnMenu : false, field: 'stationName', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Type', enableColumnMenu : false, field: 'terminalType', cellClass : 'gridCellClass', width : 120}, 
	        		{ displayName: 'Date/Time', enableColumnMenu : false, field: 'dateTime', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'User Name', enableColumnMenu : false, field : 'userName', cellClass : 'gridCellClass', width : 120},
	            	{ displayName: 'Shift ID', enableColumnMenu : false, field : 'shiftID', cellClass : 'gridCellClass', width : 100},
	            	{ displayName: 'SF No.', enableColumnMenu : false, field : 'SFNo', cellClass : 'gridCellClass', width : 80},
	            	{ displayName: 'Description', enableColumnMenu : false, field : 'description', cellClass : 'gridCellClass', width : 150},
	            	{ displayName: 'Service Mode', enableColumnMenu : false, field : 'serviceCode', cellClass : 'gridCellClass', width : 150},
	            	{ displayName: 'Door', enableColumnMenu : false, field : 'door', cellClass : 'gridCellClass', width : 100}
				]
			}
		});
	}

	$scope.$watch('terminals', function(oldValue, newValue) {
	    init();
	}, true);

}])