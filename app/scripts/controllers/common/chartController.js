'use restrict';
var app = angular.module('njTransitApp');

app.controller('chartController', ['$rootScope','$scope','dashBoardService', '$state', '$filter',
	function($rootScope,$scope, dashBoardService, $state, $filter) {
	$scope.stationSeries = [];
	$scope.drilldownSeries = {};
	$scope.drilldownSeries.series = [];
	$scope.transactionSeries = [];
	$scope.transactionhrs = "1";
	$scope.alarmHrs = "1";
	$scope.serviceHrs = "1";
	$scope.transactionDrilldownSeries = {};
	$scope.transactionDrilldownSeries.series = [];
	$scope.SChrs = "1";
	$scope.viewAlarmsAs = "grid";
	$scope.toggleTerminals = true;
	$scope.selectedStation = $scope.stations[0];
	$scope.filerBy = "all"

	$scope.alarmColorCodes = {
		"Security Alarm" : "#FF0066",
		"Critical Alarm" : "red",
		"Major/minor/warning Alarm" : "#7E3517",
		"Communication Failure" : "#F88017",
		"Full Service" : "green",
		"No Configured Terminals" : "yellow"
	};

	function constructSystemLevelChartData(alarms) {
		console.log("alarms", alarms);
		angular.forEach(alarms, function(alarm, alarmKey) {
			var stationSeries = {};
			stationSeries.name = alarm.alarmName;
			stationSeries.y = alarm.alarmCount;
			stationSeries.color = $scope.alarmColorCodes[alarm.alarmName];
			stationSeries.drilldown = alarm.alarmName+alarmKey;
			$scope.stationSeries.push(stationSeries);
			var drilldownSeries = {};
			drilldownSeries.data = [];
			drilldownSeries.name = "Stations";
			drilldownSeries.id = alarm.alarmName+alarmKey;
			angular.forEach(alarm.stations, function(station, stationKey) {
				var data = {};
				data = {"name" : station.stationName,
					"y" : station.terminalCount,
					"drilldown" : station.stationCode+stationKey
				};
				drilldownSeries.data.push(data);
				$scope.drilldownSeries.series.push(drilldownSeries)				
				var deepDrillDownSeries = {};
				deepDrillDownSeries.name = station.stationName;
				deepDrillDownSeries.id=station.stationCode+stationKey;
				deepDrillDownSeries.data = [];
				angular.forEach(station.terminals, function(terminal, key) {					
					var data = {};
					data.name = terminal.terminalName;
					data.y = terminal.count;
					deepDrillDownSeries.data.push(data);
				});		
				$scope.drilldownSeries.series.push(deepDrillDownSeries);		
			});
		});
	}

	function constructStationLevelChartData(alarms) {
		angular.forEach(alarms, function(alarm, alarmKey) {
			var stationSeries = {};
			
			var drilldownSeries = {};
			drilldownSeries.data = [];
			drilldownSeries.name = "Terminals";
			drilldownSeries.id = alarm.alarmName+alarmKey;
			angular.forEach(alarm.stations, function(station, stationKey) {		
				if(station.stationCode === $scope.selectedStation.stationId) {	
					stationSeries.name = alarm.alarmName;
					stationSeries.y = station.terminalCount;
					stationSeries.color = $scope.alarmColorCodes[alarm.alarmName];
					stationSeries.drilldown = alarm.alarmName+alarmKey;
					
					angular.forEach(station.terminals, function(terminal, key) {	
						var data = {};											
						data.name = terminal.terminalName;
						data.y = terminal.count;	
						drilldownSeries.data.push(data);
					});			
						
				}
			});
			$scope.stationSeries.push(stationSeries);

			$scope.drilldownSeries.series.push(drilldownSeries);
		});
		
	}


	function constructChartConfiguration(alarms) {
		if($scope.filerBy === 'station') {
			constructStationLevelChartData(alarms);
		} else {
			constructSystemLevelChartData(alarms);
		}
		
		$('#pChart').highcharts({
		 	chart: {
	            type: 'pie'
	        },
	        title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },
	        plotOptions: {
	            series: {
	                dataLabels: {
	                    enabled: true,
	                    format: '{point.name}'
	                },
	                showInLegend: true
	            }
	        },
	        tooltip: {
	            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
	        },
	        series: [{
	            name: 'System Health',
	            colorByPoint: true,
	            data: $scope.stationSeries
	        }],
	        drilldown: $scope.drilldownSeries
		});
	}

	function loadAllTransactionsChart() {
		var transactionhrs = Number($scope.transactionhrs);
		$scope.transactionSeries = [];
		$scope.transactionDrilldownSeries.series = [];
		angular.forEach($scope.transactions, function(transaction, transactionKey) {
			var transactionSeries = {};
			transactionSeries.name = transaction.transactionType;
			transactionSeries.y = transaction.noOfTransactions * transactionhrs;
			transactionSeries.drilldown = transaction.transactionType;
			$scope.transactionSeries.push(transactionSeries);
			var drilldownSeries = {};
			drilldownSeries.data = [];
			drilldownSeries.name = "Stations";
			drilldownSeries.id = transaction.transactionType;
			angular.forEach(transaction.transactionsByStation, function(station, stationKey) {
				var data = {};
				data.name = station.stationName;
				data.y = station.noOfTransactions * transactionhrs;
				drilldownSeries.data.push(data);
				$scope.transactionDrilldownSeries.series.push(drilldownSeries);	
			});
		});	

	}

	function loadTransactionsByStationChart() {

/*		var transactionhrs = Number($scope.transactionhrs);
		$scope.transactionSeries = [];
		$scope.transactionDrilldownSeries.series = [];
		angular.forEach($scope.transactions, function(transaction, transactionKey) {
			angular.forEach(transaction.transactionsByStation, function(station, stationKey) {
				if(station.stationCode === $scope.selectedStation.stationId) {	
					var transactionSeries = {};
					transactionSeries.name = transaction.transactionType;
					transactionSeries.y = station.noOfTransactions * transactionhrs;
					transactionSeries.drilldown = transaction.transactionType;
					$scope.transactionSeries.push(transactionSeries);
				}					
			});
		});	*/

		var transactionhrs = Number($scope.transactionhrs);
		$scope.transactionSeries = [];
		$scope.transactionDrilldownSeries.series = [];
		angular.forEach($scope.transactions, function(transaction, transactionKey) {
			var drilldownSeries = {};
			drilldownSeries.data = [];
			drilldownSeries.name = "Machines";
			drilldownSeries.id = transaction.transactionType;
			angular.forEach(transaction.transactionsByStation, function(station, stationKey) {
				if(station.stationCode === $scope.selectedStation.stationId) {	
					angular.forEach(station.terminals, function(terminal, terminalKey) {
						var transactionSeries = {};
						transactionSeries.name = transaction.transactionType;
						transactionSeries.y = station.noOfTransactions * transactionhrs;
						transactionSeries.drilldown = transaction.transactionType;
						$scope.transactionSeries.push(transactionSeries);
						var data = {};
						data.name = terminal.terminalName;
						data.y = terminal.count * transactionhrs;
						drilldownSeries.data.push(data);
						$scope.transactionDrilldownSeries.series.push(drilldownSeries);	
					});
				}
			});
		});	
	}

	function loadTransactionsChart() {	

		if($scope.filerBy === 'station') {
			loadTransactionsByStationChart();
		} else {
			loadAllTransactionsChart();
		}
		
		$('#colChart1').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },
	        plotOptions: {
	            series: {
	                dataLabels: {
	                    enabled: true,
	                    format: '{point.y}'
	                },
	                showInLegend: false
	            }
	        },

            xAxis: {
            	title: {
	                text: 'Last transaction : TVM : 9980, Type : Credit, Amount : $12'
	            },
           		 type: 'category'
   			},
   			yAxis: {
	            title: {
	                text: 'Number Of Transactions'
	            }
            },
	        tooltip: {
	            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	            pointFormat: '<span style="color:{point.color}">{point.name}</span><br/>'
	        },
	        series: [{
	            name: 'Transactions',
	            colorByPoint: true,
	            data: $scope.transactionSeries
	        }],
	        drilldown: $scope.transactionDrilldownSeries
		});
		 
	}

	function loadColumnChartsAllAlarms() {
		 var alarmHrs = Number($scope.alarmHrs);
		 $('#colChart2').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },

	        plotOptions: {
	            series: {
	                dataLabels: {
	                    enabled: true,
	                    format: '{point.y}'
	                },
	                showInLegend: false
	            }
	        },

            xAxis: {
            	title: {
	                text: 'Type Of Alarm'
	            },
           		 type: 'category'
   			},
   			yAxis: {
	            title: {
	                text: 'Number Of Alarms'
	            }
            },
	        tooltip: {
	            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
	        },
	        series: [{
	            name: 'Alarms',
	            colorByPoint: true,
	            data: [{
	                name: 'Critical',
	                y: 10 * alarmHrs,
	                color : 'red',
	                drilldown: 'critical'
	            }, {
	                name: 'Major',
	                y: 15 * alarmHrs,
	                color : '#FF0066',
	                drilldown: 'major'
	            }, {
	                name: 'Minor',
	                y: 36 * alarmHrs,
	                color : '#7E3517',
	                drilldown: 'minor'
	            }, {
	                name: 'Warning',
	                y: 16 * alarmHrs,
	                color : '#F88017',
	                drilldown: 'warning'
	            }, {
	                name: 'Ok',
	                y: 150 * alarmHrs,
	                color : 'green',
	                drilldown: 'ok'
	            }]
	        }],
	        drilldown: {
	            series: [{
	                name: 'critical',
	                id: 'critical',
	                data: [
	                    ['New Brunswick', 1 * alarmHrs],
	                    ['Newark', 2 * alarmHrs],
	                    ['New York', 3 * alarmHrs],
	                    ['Seacaucus', 2 * alarmHrs],
	                    ['Metropark', 1 * alarmHrs],
	                    ['Edison', 1 * alarmHrs]
	                ]
	            }, {
	                name: 'Major',
	                id: 'major',
	                data: [
	                    ['New Brunswick', 2 * alarmHrs],
	                    ['Newark', 4 * alarmHrs],
	                    ['New York', 4 * alarmHrs],
	                    ['Seacaucus', 3 * alarmHrs],
	                    ['Metropark', 1 * alarmHrs],
	                    ['Edison', 1 * alarmHrs]
	                ]
	            }, {
	                name: 'Minor',
	                id: 'minor',
	                data: [
	                    ['New Brunswick', 3 * alarmHrs],
	                    ['Newark', 10 * alarmHrs],
	                    ['New York', 10 * alarmHrs],
	                    ['Seacaucus', 8 * alarmHrs],
	                    ['Metropark', 2 * alarmHrs],
	                    ['Edison', 3 * alarmHrs]
	                ]
	            }, {
	                name: 'Warning',
	                id: 'warning',
	                data: [
	                    ['New Brunswick', 2 * alarmHrs],
	                    ['Newark', 4 * alarmHrs],
	                    ['New York', 6 * alarmHrs],
	                    ['Seacaucus', 2 * alarmHrs],
	                    ['Metropark', 1 * alarmHrs],
	                    ['Edison', 1 * alarmHrs]
	                ]
	            }, {
	                name: 'OK',
	                id: 'ok',
	                data: [
	                    ['New Brunswick', 10 * alarmHrs],
	                    ['Newark', 40 * alarmHrs],
	                    ['New York', 50 * alarmHrs],
	                    ['Seacaucus', 30 * alarmHrs],
	                    ['Metropark', 10 * alarmHrs],
	                    ['Edison', 10 * alarmHrs]
	                ]
	            }]
	        }
		});

	}
	
	$scope.loadColumnChartsByStation = function () {
		 var alarmHrs = Number($scope.alarmHrs);
		 $('#colChart2').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },

	        plotOptions: {
	            series: {
	                dataLabels: {
	                    enabled: true,
	                    format: '{point.y}'
	                },
	                showInLegend: false
	            }
	        },

            xAxis: {
            	title: {
	                text: 'Type Of Alarm'
	            },
           		 type: 'category'
   			},
   			yAxis: {
	            title: {
	                text: 'Number Of Alarms'
	            }
            },
	        tooltip: {
	            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
	        },
	        series: [{
	            name: 'Alarms',
	            colorByPoint: true,
	            data: [{
	                name: 'Critical',
	                y: 10 * alarmHrs,
	                color : 'red',
	                drilldown: 'critical'
	            }, {
	                name: 'Major',
	                y: 15 * alarmHrs,
	                color : '#FF0066',
	                drilldown: 'major'
	            }, {
	                name: 'Minor',
	                y: 36 * alarmHrs,
	                color : '#7E3517',
	                drilldown: 'minor'
	            }, {
	                name: 'Warning',
	                y: 16 * alarmHrs,
	                color : '#F88017',
	                drilldown: 'warning'
	            }, {
	                name: 'Ok',
	                y: 150 * alarmHrs,
	                color : 'green',
	                drilldown: 'ok'
	            }]
	        }],
	        drilldown: {
	            series: [{
	                name: 'critical',
	                id: 'critical',
	                data: [
	                    ['TVM', 1 * alarmHrs],
	                    ['TOM', 2 * alarmHrs],
	                    ['VDS', 3 * alarmHrs],
	                    ['VD', 2 * alarmHrs]
	                ]
	            }, {
	                name: 'Major',
	                id: 'major',
	                data: [
	                    ['TVM', 2 * alarmHrs],
	                    ['TOM', 3 * alarmHrs],
	                    ['VDS', 1 * alarmHrs],
	                    ['VD', 2 * alarmHrs]
	                ]
	            }, {
	                name: 'Minor',
	                id: 'minor',
	                data: [
	                    ['TVM', 1 * alarmHrs],
	                    ['TOM', 2 * alarmHrs],
	                    ['VDS', 3 * alarmHrs]
	                ]
	            }, {
	                name: 'Warning',
	                id: 'warning',
	                data: [
   	                    ['TVM', 4 * alarmHrs],
	                    ['TOM', 2 * alarmHrs],
	                    ['VDS', 3 * alarmHrs],
	                    ['VD', 2 * alarmHrs]
	                ]
	            }, {
	                name: 'OK',
	                id: 'ok',
	                data: [
   	                    ['TVM', 10 * alarmHrs],
	                    ['TOM', 2 * alarmHrs],
	                    ['VDS', 3 * alarmHrs],
	                    ['VD', 2 * alarmHrs]
	                ]
	            }]
	        }
		});
	}

	$scope.loadColumnCharts = function () {
		if($scope.filerBy === 'station') {
			$scope.loadColumnChartsByStation();
		} else {
			loadColumnChartsAllAlarms();			
		}
	}


	$scope.paperReplacemetCalls = [{
		"name" : "Linda",
		"terminal" : 9998		
	}, {
		"name" : "Bruce",
		"terminal" : 7988		
	}, {
		"name" : "John",
		"terminal" : 9996
	},{
		"name" : "Chris",
		"terminal" : 9974
	},{
		"name" : "Meghan",
		"terminal" : 9979 
	},{
		"name" : "Lisa",
		"terminal" : 9972		
	},{
		"name" : "Shannon",
		"terminal" : 7973		
	},{
		"name" : "Hardley",
		"terminal" : 7972		
	},{
		"name" : "kelsey",
		"terminal" : 9972		
	},{
		"name" : "John",
		"terminal" : 6972		
	}];

	$scope.getServiceCallsTooltipTemplate = function(seriesName, color, name, y) {
		var paperReplacemetCalls =   $scope.paperReplacemetCalls.slice(y, 10);
		if(seriesName === 'TVM' || seriesName === 'TOM' || seriesName === 'VD' || seriesName === 'VDS' ) {
			var count = 0;
			var template = '<table>' ;
			angular.forEach(paperReplacemetCalls, function(call, key) {
				count = count +1;
				if(count <= y) {
			        var innterTemplate = ' <tr>' + 
					 '<td>'+  call.terminal + ' : </td> <br/>' +
				   '<td>'+ call.name  +  ' </td>' +
				  
				   '</tr>' ;
				    template = template + innterTemplate;
				} 
			});
			template = template +'</table>';
		} else {
			template = '<span style="color:' + color + '">' + name + '</span>: <b>' + y + '</b><br/>';
		}
		return template;
	};
	$scope.getShiftTooltipTemplate = function(seriesName, y) {
		var membersList = [];
		if(seriesName === "Morning Shift") {
			membersList = $scope.paperReplacemetCalls.slice(0,3);
		} else if(seriesName === "Afternoon Shift") {
			membersList = $scope.paperReplacemetCalls.slice(4,7);
		} else if(seriesName === "Night Shift") {
			membersList = $scope.paperReplacemetCalls.slice(8,10);
		} 
		var template = '<table>' ;
		angular.forEach(membersList, function(member, key) {
	        var innterTemplate = ' <tr>' + 
		   '<td>'+ member.name  +  '</td> <br/>' +				   
		   '</tr>' ;
		    template = template + innterTemplate;
		});
		template = template +'</table>';
		return template;
	};
	$scope.refreshServiceCallsChart = function() {
		loadBarChart();
	}
	function loadBarChart() {
		var SChrs = Number($scope.SChrs);
		 $('#barChart').highcharts({
		 		chart: {
	            type: 'column'
	        },
	        title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },

	        plotOptions: {
	            series: {
	                dataLabels: {
	                    enabled: true,
	                    format: '{point.y}'
	                },
	                showInLegend: false
	            }
	        },

            xAxis: {
            	title: {
	                text: 'Terminal'
	            },
           		 type: 'category'
   			},
   			yAxis: {
	            title: {
	                text: 'Number Of Calls'
	            }
            },


	        tooltip: {
	        	formatter: function() {
	        		var template = $scope.getServiceCallsTooltipTemplate(this.series.name, this.point.color, this.point.name, this.point.y);
	        		return template;
	        	}
 
	        },
	        series: [{
	            name: 'Terminals',
	            colorByPoint: true,
	            data: [{
	                name: 'TVM',
	                y: 10 * SChrs,
	                drilldown: 'TVM'
	            }, {
	                name: 'TOM',
	                y: 6 * SChrs,
	                drilldown: 'TOM'
	            }, {
	                name: 'VD',
	                y:  2 * SChrs,
	                drilldown: 'VD'
	            }, {
	                name: 'VDS',
	                y: 4 * SChrs,
	                drilldown: 'VDS'
	            }]
	        }],
	        drilldown: {
	            series: [{
	                name: 'TVM',
	                id: 'TVM',
	                data: [
	                    ['Paper Replacement Call', 2 * SChrs],
	                    ['Maintenance Call', 5 * SChrs],
	                    ['Hardware Replacement Call', 1 * SChrs],
	                    ['BUCO2 Maintainance', 1 * SChrs],
	                    ['Power Off', 1 * SChrs]
	                ]
	            }, {
	                name: 'TOM',
	                id: 'TOM',
	                data: [
	                     ['Paper Replacement Call', 1 * SChrs],
	                    ['Maintenance Call', 2 * SChrs],
	                    ['Hardware Replacement Call', 1 * SChrs],
	                    ['BUCO2 Maintainance', 1 * SChrs],
	                    ['Power Off', 1 * SChrs]
	                ]
	            }, {
	                name: 'VD',
	                id: 'VD',
	                data: [
	                    ['Paper Replacement Call', 1 * SChrs],
	                    ['Maintenance Call', 1 * SChrs]
	                   
	                ]
	            }, {
	                name: 'VDS',
	                id: 'VDS',
	                data: [
	                    ['Paper Replacement Call', 1 * SChrs],
	                    ['Maintenance Call', 2 * SChrs],
	                    ['Power Off', 1 * SChrs]
	                ]
	            }]
        	}
	    });
	}

	function loadStackedBarChart() {
		$('#stackedBarChart').highcharts({
	        chart: {
	            type: 'bar'
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
	        },
	        yAxis: {
	        	
	            min: 0,
	            title: {
	                text: 'Shifts'
	            }
	        },
	        tooltip: {
	        	formatter: function() {
	        		var template = $scope.getShiftTooltipTemplate(this.series.name, this.point.y);
	        		return template;
	        	}
 
	        },
			legend: {
	            reversed: true
	        },
	        plotOptions: {
	            series: {
	                stacking: 'normal'
	            }
	        },
	        series: [{
	            name: 'Night Shift',
	            data: [8,8,8,8,8,8,8]
	        }, {
	            name: 'Afternoon Shift',
	            data: [8,8,8,8,8,8,8]
	        },{
	            name: 'Morning Shift',
	            data: [8,8,8,8,8,8,8]
	        }]
	    });
	}

	$scope.topTencheckedGridOptions = {
		enableColumnMenus : false,
		enableFiltering: true,
        columnDefs: [
            { displayName : 'Terminal', field: 'terminal', enableColumnMenu : false, width:100},
            { displayName : 'Station', field: 'station', enableColumnMenu : false, width:100},
            { displayName : 'Type', field : 'type', enableColumnMenu : false, width:75},
            { displayName : 'Code', field : 'code', enableColumnMenu : false, width:75},
            { displayName : 'Description', field : 'description', enableColumnMenu : false, width:200},
            { displayName : 'Alarm Occured', field : 'alarmOccured', enableColumnMenu : false, width:150},
            { displayName : 'Dispatch Occured', field : 'dispatchOccured', enableColumnMenu : false, width:150},
            { displayName : 'Dispatcher', field : 'dispatcher', enableColumnMenu : false, width:100},
            { displayName : 'Category', field : 'category', enableColumnMenu : false, width:100}
        ]
	};

	$scope.refreshGridData = function() {
		if($scope.filerBy === 'station') {
			var topTencheckedData = $scope.topTencheckedGridOptions.data;
			$scope.topTencheckedGridOptions.data = $filter('filter')(topTencheckedData, {stationCode: $scope.selectedStation.stationId});
			var toptenunchecked = $scope.topTenUncheckedGridOptions.data;
			$scope.topTenUncheckedGridOptions.data = $filter('filter')(toptenunchecked, {stationCode: $scope.selectedStation.stationId});
		} else {
			
		}
		
	}

	$scope.topTencheckedGridOptions.data = [{
		"terminal" : 9998,
		"station" : "Absecon",
		"stationCode": "2_ATLC",
		"type" : "TVM",
		"code" : 380,
		"description" : "No Change is Available",
		"alarmOccured" : "07/25/16 14:59:08",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" :  "close",
		"category" : "Technical"
	}, {
		"terminal" : 9998,
		"station" : "Absecon",
		"stationCode": "2_ATLC",
		"type" : "TVM",
		"code" : 332,
		"description" : "BUCO2 not in place",
		"alarmOccured" : "07/25/16 14:58:39",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "close",
		"category" : "Revenue"
	}, {
		"terminal" : 9996,
		"station" : "Allenhurst",
		"stationCode": "4_NJCL",
		"type" : "TVM",
		"code" : 100,
		"description" : "Power Off",
		"alarmOccured" : "07/22/16 16:03:58",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "close",
		"category" : "Technical"

	},{
		"terminal" : 9974,
		"station" : "Absecon",
		"stationCode": "2_ATLC",
		"type" : "TVM",
		"code" : 5017,
		"description" : "BNR Needs Maintenance.",
		"alarmOccured" : "06/23/16 09:20:53",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" :   "Open",
		"category" : "Revenue"
	},{
		"terminal" : 9979 ,
		"station" : "Allenhurst",
		"stationCode": "4_NJCL",
		"type" : "TVM",
		"code" : 880,
		"description" : "Pin pad processing error",
		"alarmOccured" : "07/18/16 04:08:10",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "NA",
		"category" : "Technical"
	},{
		"terminal" : 9972,
		"station" : "Allendale",
		"stationCode" : "3_MNBN",
		"type" : "TOM",
		"code" : 195,
		"description" : "Paper 4 not inserted",
		"alarmOccured" : "04/30/14 03:48:48",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "NA",
		"category" : "Paper"
	}];

	$scope.topTenUncheckedGridOptions = {
		enableColumnMenus : false,
		enableFiltering: true,
        columnDefs: [
            { displayName : 'Terminal', field: 'terminal', enableColumnMenu : false, width:100},
            { displayName : 'Station', field: 'station', enableColumnMenu : false, width:100},
            { displayName : 'Type', field : 'type', enableColumnMenu : false, width:75},
            { displayName : 'Code', field : 'code', enableColumnMenu : false, width:75},
            { displayName : 'Description', field : 'description', enableColumnMenu : false, width:200},
            { displayName : 'Alarm Occured', field : 'alarmOccured', enableColumnMenu : false, width:150},
            { displayName : 'Dispatch Occured', field : 'dispatchOccured', enableColumnMenu : false, width:150},
            { displayName : 'Dispatcher', field : 'dispatcher', enableColumnMenu : false, width:100},
            { displayName : 'Category', field : 'category', enableColumnMenu : false, width:100}
        ]
	};
	$scope.topTenUncheckedGridOptions.data = [{
		"terminal" : 8998,
		"station" : "Allendale",
		"stationCode" : "3_MNBN",
		"type" : "TVM",
		"code" : 380,
		"description" : "No Change is Available",
		"alarmOccured" : "07/25/16 14:59:08",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" :  "close",
		"category" : "Technical"
	}, {
		"terminal" : 8998,
		"station" : "Allendale",
		"stationCode" : "3_MNBN",
		"type" : "TVM",
		"code" : 332,
		"description" : "BUCO2 not in place",
		"alarmOccured" : "07/25/16 14:58:39",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "close",
		"category" : "Revenue"
	}, {
		"terminal" : 8996,
		"station" : "Allenhurst",
		"stationCode": "4_NJCL",
		"type" : "TVM",
		"code" : 100,
		"description" : "Power Off",
		"alarmOccured" : "07/22/16 16:03:58",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "close",
		"category" : "Technical"

	},{
		"terminal" : 8974,
		"station" : "Allendale",
		"stationCode" : "3_MNBN",
		"type" : "TVM",
		"code" : 5017,
		"description" : "BNR Needs Maintenance.",
		"alarmOccured" : "06/23/16 09:20:53",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" :   "Open",
		"category" : "Revenue"
	},{
		"terminal" : 8979 ,
		"station" : "Allenhurst",
		"stationCode": "4_NJCL",
		"type" : "TVM",
		"code" : 880,
		"description" : "Pin pad processing error",
		"alarmOccured" : "07/18/16 04:08:10",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "NA",
		"category" : "Technical"
	},{
		"terminal" : 8972,
		"station" : " Aberdeen Matawan",
		"stationCode" : "37169_NJCL",
		"type" : "TVM",
		"code" : 195,
		"description" : "Paper 4 not inserted",
		"alarmOccured" : "04/30/14 03:48:48",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "NA",
		"category" : "Paper"
	}, ,{
		"terminal" : 8973,
		"station" : " Aberdeen Matawan",
		"stationCode" : "37169_NJCL",
		"type" : "TVM",
		"code" : 195,
		"description" : "Paper 4 not inserted",
		"alarmOccured" : "04/30/14 03:48:48",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "NA",
		"category" : "Paper"
	},{
		"terminal" : 7972,
		"station" : "Allenhurst",
		"stationCode": "4_NJCL",
		"type" : "TVM",
		"code" : 195,
		"description" : "Paper 4 not inserted",
		"alarmOccured" : "04/30/14 03:48:48",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "NA",
		"category" : "Paper"
	},{
		"terminal" : 7998,
		"station" : "Allendale",
		"stationCode" : "3_MNBN",
		"type" : "TVM",
		"code" : 380,
		"description" : "No Change is Available",
		"alarmOccured" : "07/25/16 14:59:08",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" :  "close",
		"category" : "Technical"
	}, {
		"terminal" : 7998,
		"station" : "Allendale",
		"stationCode" : "3_MNBN",
		"type" : "TVM",
		"code" : 332,
		"description" : "BUCO2 not in place",
		"alarmOccured" : "07/25/16 14:58:39",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "close",
		"category" : "Revenue"
	}, {
		"terminal" : 7996,
		"station" : "Allenhurst",
		"stationCode": "4_NJCL",
		"type" : "TVM",
		"code" : 100,
		"description" : "Power Off",
		"alarmOccured" : "07/22/16 16:03:58",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" : "close",
		"category" : "Technical"

	},{
		"terminal" : 7974,
		"station" : "Allendale",
		"stationCode" : "3_MNBN",
		"type" : "TVM",
		"code" : 5017,
		"description" : "BNR Needs Maintenance.",
		"alarmOccured" : "06/23/16 09:20:53",
		"dispatchOccured" : "Dispatch",
		"dispatcher" : "",
		"door" :   "Open",
		"category" : "Revenue"
	}];

	$scope.loadTerminalPieChart = function() {
		$scope.stationSeries = [];
		$scope.drilldownSeries = {};
		$scope.drilldownSeries.series = [];
   		dashBoardService.getSystemStatus().then(function(alarms) {
			constructChartConfiguration(alarms);
		});
	}

	$scope.loadTransactionsChart = function() {
		dashBoardService.getTransactions().then(function(transactions) {
			$scope.transactions = transactions;
			loadTransactionsChart();
		});
	}

	$scope.loadStackedBarChart =  function() {
		loadStackedBarChart();
	}

	$scope.loadCharts = function() {
		dashBoardService.getTransactions().then(function(transactions) {
			$scope.transactions = transactions;
			loadTransactionsChart();
		});
		$scope.loadTerminalPieChart();
	    $scope.loadColumnCharts();
	    loadBarChart();
	    loadStackedBarChart();
	}
	$scope.toggleAlarms = function() {
		$scope.toggleTerminals = !$scope.toggleTerminals;
	}

}]);