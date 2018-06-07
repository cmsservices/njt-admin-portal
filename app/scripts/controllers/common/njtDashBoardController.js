'use restrict';
var app = angular.module('njTransitApp');

app.controller('njtDashboardController', ['$rootScope','$scope','dashBoardService', '$state', '$filter',
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
/*		if($scope.filerBy === 'station') {
			constructStationLevelChartData(alarms);
		} else {
			constructSystemLevelChartData(alarms);
		}*/

		$('#pChart').highcharts ({
		    chart: {
		    	height : 250,
		        type: 'column'
		    },		
		      title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },   	   
		    xAxis: {
		        categories: [
		            'One Way',
		            'Round Trip',
		            'Monthly'
		        ],
		        crosshair: true
		    },
		    yAxis: {
		        min: 0,
		        title: {
		            text: 'Activations'
		        }
		    },
		    tooltip: {
		        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		            '<td style="padding:0"><b>{point.y}</b></td></tr>',
		        footerFormat: '</table>',
		        shared: true,
		        useHTML: true
		    },
		    plotOptions: {
		        column: {
		            pointPadding: 0.2,
		            borderWidth: 0
		        }
		    },
		    series: [{
		        name: 'Rail',
		        data: [49, 71, 106]

		    }, {
		        name: 'BUS',
		        data: [83, 78, 98]

		    }, {
		        name: 'Light Rail',
		        data: [48, 38, 39]

		    }]
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
	        	height : 250,
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
            	/*title: {
	                text: 'Last transaction : TVM : 9980, Type : Credit, Amount : $12'
	            },*/
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
	        }]/*,
	        drilldown: $scope.transactionDrilldownSeries*/
		});
		 
	}

	function loadColumnChartsAllAlarms() {
		 var alarmHrs = Number($scope.alarmHrs);
		 $('#colChart2').highcharts({
	         chart: {
	         	height : 250,
		        type: 'column'
		    },	
		      title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },	   	   
		    xAxis: {
		        categories: [
		            'One Way',
		            'Round Trip',
		            'Monthly'
		        ],
		        crosshair: true
		    },
		    yAxis: {
		        min: 0,
		        title: {
		            text: 'Ticket Purchases'
		        }
		    },
		    tooltip: {
		        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		            '<td style="padding:0"><b>{point.y}</b></td></tr>',
		        footerFormat: '</table>',
		        shared: true,
		        useHTML: true
		    },
		    plotOptions: {
		        column: {
		            pointPadding: 0.2,
		            borderWidth: 0
		        }
		    },
		    series: [{
		        name: 'Rail',
		        data: [539, 471, 606]

		    }, {
		        name: 'BUS',
		        data: [383, 278, 398]

		    }, {
		        name: 'Light Rail',
		        data: [208, 138, 139]

		    }]
		});

	}
	
	

	$scope.loadColumnCharts = function () {
		loadColumnChartsAllAlarms();			
	}


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
		 $('#Mapplewood-Mtix1').highcharts({
		 	chart: {
		            type: 'spline',
		            height : 250,
		            animation: Highcharts.svg, // don't animate in old IE
		            marginRight: 10,
		            events: {
		                load: function () {

		                    // set up the updating of the chart each second
		                    var series = this.series[0];
		                    setInterval(function () {
		                        var x = (new Date()).getTime(), // current time
		                            y = Math.random();
		                        series.addPoint([x, y], true, true);
		                    }, 1000);
		                }
		            }
		        },
		        title: {
		            text: 'Mapplewood-Mtix1'
		        },
		        xAxis: {
		            type: 'datetime',
		            tickPixelInterval: 150
		        },
		        yAxis: {
		            title: {
		                text: 'no. of Requests'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		            formatter: function () {
		                return '<b>' + this.series.name + '</b><br/>' +
		                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
		                    Highcharts.numberFormat(this.y, 2);
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        exporting: {
		            enabled: false
		        },
		        series: [{
		            name: 'Requested Time',
		            data: (function () {
		                // generate an array of random data
		                var data = [],
		                    time = (new Date()).getTime(),
		                    i;

		                for (i = -19; i <= 0; i += 1) {
		                    data.push({
		                        x: time + i * 1000,
		                        y: Math.random()
		                    });
		                }
		                return data;
		            }())
		        }, {
		        type: 'pie',
		        name: 'Disk Space',
		        data: [{
		            name: 'Free',
		            y: 200
		        }, {
		            name: 'Backup',
		            y: 100
		        }, {
		            name: 'Used',
		            y: 150
		        }],
		        center: ['85%', '50px'],
		        size: 90,
		      
		    }]
	    });

		  $('#Mapplewood-Mtix2').highcharts({
		 	chart: {
		            type: 'spline',
		            height : 250,
		            animation: Highcharts.svg, // don't animate in old IE
		            marginRight: 10,
		            events: {
		                load: function () {

		                    // set up the updating of the chart each second
		                    var series = this.series[0];
		                    setInterval(function () {
		                        var x = (new Date()).getTime(), // current time
		                            y = Math.random();
		                        series.addPoint([x, y], true, true);
		                    }, 1000);
		                }
		            }
		        },
		        title: {
		            text: 'Mapplewood-Mtix2'
		        },
		        xAxis: {
		            type: 'datetime',
		            tickPixelInterval: 150
		        },
		        yAxis: {
		            title: {
		                text: 'no. of Requests'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		            formatter: function () {
		                return '<b>' + this.series.name + '</b><br/>' +
		                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
		                    Highcharts.numberFormat(this.y, 2);
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        exporting: {
		            enabled: false
		        },
		        series: [{
		            name: 'Requested Time',
		            data: (function () {
		                // generate an array of random data
		                var data = [],
		                    time = (new Date()).getTime(),
		                    i;

		                for (i = -19; i <= 0; i += 1) {
		                    data.push({
		                        x: time + i * 1000,
		                        y: Math.random()
		                    });
		                }
		                return data;
		            }())
		        }, {
		        type: 'pie',
		        name: 'Disk Space',
		        data: [{
		            name: 'Free',
		            y: 200
		        }, {
		            name: 'Backup',
		            y: 100
		        }, {
		            name: 'Used',
		            y: 150
		        }],
		        center: ['85%', '50px'],
		        size: 90,
		      
		    }]
	    });


		   $('#Mapplewood-Mtix3').highcharts({
		 	chart: {
		            type: 'spline',
		            animation: Highcharts.svg, // don't animate in old IE
		            marginRight: 10,
		            height : 250,
		            events: {
		                load: function () {

		                    // set up the updating of the chart each second
		                    var series = this.series[0];
		                    setInterval(function () {
		                        var x = (new Date()).getTime(), // current time
		                            y = Math.random();
		                        series.addPoint([x, y], true, true);
		                    }, 1000);
		                }
		            }
		        },
		        title: {
		            text: 'Mapplewood-Mtix3'
		        },
		        xAxis: {
		            type: 'datetime',
		            tickPixelInterval: 150
		        },
		        yAxis: {
		            title: {
		                text: 'no. of Requests'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		            formatter: function () {
		                return '<b>' + this.series.name + '</b><br/>' +
		                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
		                    Highcharts.numberFormat(this.y, 2);
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        exporting: {
		            enabled: false
		        },
		        series: [{
		            name: 'Requested Time',
		            data: (function () {
		                // generate an array of random data
		                var data = [],
		                    time = (new Date()).getTime(),
		                    i;

		                for (i = -19; i <= 0; i += 1) {
		                    data.push({
		                        x: time + i * 1000,
		                        y: Math.random()
		                    });
		                }
		                return data;
		            }())
		        }, {
		        type: 'pie',
		        name: 'Disk Space',
		        data: [{
		            name: 'Free',
		            y: 200
		        }, {
		            name: 'Backup',
		            y: 100
		        }, {
		            name: 'Used',
		            y: 150
		        }],
		        center: ['85%', '50px'],
		        size: 90,
		      
		    }]
	    });


		    $('#Newark-Mtix1').highcharts({
		 	chart: {
		            type: 'spline',
		            animation: Highcharts.svg, // don't animate in old IE
		            marginRight: 10,
		            height : 250,
		            events: {
		                load: function () {

		                    // set up the updating of the chart each second
		                    var series = this.series[0];
		                    setInterval(function () {
		                        var x = (new Date()).getTime(), // current time
		                            y = Math.random();
		                        series.addPoint([x, y], true, true);
		                    }, 1000);
		                }
		            }
		        },
		        title: {
		            text: 'Newark-Mtix1'
		        },
		        xAxis: {
		            type: 'datetime',
		            tickPixelInterval: 150
		        },
		        yAxis: {
		            title: {
		                text: 'no. of Requests'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		            formatter: function () {
		                return '<b>' + this.series.name + '</b><br/>' +
		                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
		                    Highcharts.numberFormat(this.y, 2);
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        exporting: {
		            enabled: false
		        },
		        series: [{
		            name: 'Requested Time',
		            data: (function () {
		                // generate an array of random data
		                var data = [],
		                    time = (new Date()).getTime(),
		                    i;

		                for (i = -19; i <= 0; i += 1) {
		                    data.push({
		                        x: time + i * 1000,
		                        y: Math.random()
		                    });
		                }
		                return data;
		            }())
		        }, {
		        type: 'pie',
		        name: 'Disk Space',
		        data: [{
		            name: 'Free',
		            y: 200
		        }, {
		            name: 'Backup',
		            y: 100
		        }, {
		            name: 'Used',
		            y: 150
		        }],
		        center: ['85%', '50px'],
		        size: 90,
		      
		    }]
	    });


		     $('#Newark-Mtix2').highcharts({
		 	chart: {
		            type: 'spline',
		            animation: Highcharts.svg, // don't animate in old IE
		            marginRight: 10,
		            height : 250,
		            events: {
		                load: function () {

		                    // set up the updating of the chart each second
		                    var series = this.series[0];
		                    setInterval(function () {
		                        var x = (new Date()).getTime(), // current time
		                            y = Math.random();
		                        series.addPoint([x, y], true, true);
		                    }, 1000);
		                }
		            }
		        },
		        title: {
		            text: 'Newark-Mtix2'
		        },
		        xAxis: {
		            type: 'datetime',
		            tickPixelInterval: 150
		        },
		        yAxis: {
		            title: {
		                text: 'no. of Requests'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		            formatter: function () {
		                return '<b>' + this.series.name + '</b><br/>' +
		                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
		                    Highcharts.numberFormat(this.y, 2);
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        exporting: {
		            enabled: false
		        },
		        series: [{
		            name: 'Requested Time',
		            data: (function () {
		                // generate an array of random data
		                var data = [],
		                    time = (new Date()).getTime(),
		                    i;

		                for (i = -19; i <= 0; i += 1) {
		                    data.push({
		                        x: time + i * 1000,
		                        y: Math.random()
		                    });
		                }
		                return data;
		            }())
		        }, {
		        type: 'pie',
		        name: 'Disk Space',
		        data: [{
		            name: 'Free',
		            y: 200
		        }, {
		            name: 'Backup',
		            y: 100
		        }, {
		            name: 'Used',
		            y: 150
		        }],
		        center: ['85%', '50px'],
		        size: 90,
		      
		    }]
	    });


		      $('#Newark-Mtix3').highcharts({
		 	chart: {
		            type: 'spline',
		            animation: Highcharts.svg, // don't animate in old IE
		            marginRight: 10,
		            height : 250,
		            events: {
		                load: function () {

		                    // set up the updating of the chart each second
		                    var series = this.series[0];
		                    setInterval(function () {
		                        var x = (new Date()).getTime(), // current time
		                            y = Math.random();
		                        series.addPoint([x, y], true, true);
		                    }, 1000);
		                }
		            }
		        },
		        title: {
		            text: 'Newark-Mtix3'
		        },
		        xAxis: {
		            type: 'datetime',
		            tickPixelInterval: 150
		        },
		        yAxis: {
		            title: {
		                text: 'no. of Requests'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		            formatter: function () {
		                return '<b>' + this.series.name + '</b><br/>' +
		                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
		                    Highcharts.numberFormat(this.y, 2);
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        exporting: {
		            enabled: false
		        },
		        series: [{
		            name: 'Requested Time',
		            data: (function () {
		                // generate an array of random data
		                var data = [],
		                    time = (new Date()).getTime(),
		                    i;

		                for (i = -19; i <= 0; i += 1) {
		                    data.push({
		                        x: time + i * 1000,
		                        y: Math.random()
		                    });
		                }
		                return data;
		            }())
		        }, {
		        type: 'pie',
		        name: 'Disk Space',
		        data: [{
		            name: 'Free',
		            y: 200
		        }, {
		            name: 'Backup',
		            y: 100
		        }, {
		            name: 'Used',
		            y: 150
		        }],
		        center: ['85%', '50px'],
		        size: 90,
		      
		    }]
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
		dashBoardService.getNjtTransactions().then(function(transactions) {
			$scope.transactions = transactions;
			loadTransactionsChart();
		});
	}

	$scope.loadStackedBarChart =  function() {
		loadStackedBarChart();
	}

	$scope.loadCharts = function() {
		dashBoardService.getNjtTransactions().then(function(transactions) {
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