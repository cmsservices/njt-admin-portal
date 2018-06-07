'use restrict';
var app = angular.module('njTransitApp');

app.controller('commonController', ['$rootScope','$scope','userService', '$state', '$location', 'dashBoardService',
	function($rootScope,$scope, userService, $state, $location, dashBoardService) {
	$scope.isValidUser = true;
	$scope.isloginPage = true;
	$scope.loginUser = {};
	$scope.users = [];
    $scope.selectedUser;
    $scope.services = [];
    $scope.selectVia = "Select Station"
	$scope.stations = [];
		$scope.origin =  {
		"stationId" : "0",
		"stationName" : "select Origin",
		"isFav" : "false"
	};
	$scope.destination = {
		"stationId" : "0",
		"stationName" : "select Destination",
		"isFav" : "false"
	}

	$scope.reportName = 'Alarm Reports';
	$scope.generateReports = function(reportName) {
		$scope.reportName = reportName;
	}

	function init() {
		if(!$scope.loginUser.email) {
			$scope.logout();
		}
		console.log("loginUser", $location.path());
		$scope.isloginPage =  ($location.path() === "/login" || $location.path() === '');
		userService.getUserData().then(function(users) {
			$scope.users = users;
		});
		userService.getStations().then(function(stations) {
			$scope.stations = stations;
		});

		dashBoardService.getTerminals().then(function(services) {
			$scope.services = services;
			$scope.getAllTerminals();
			console.log("services", services);
		});
	}


	$scope.updateShippingInfoEditMode = function() {
		$scope.shippingInfoEditMode  = !$scope.shippingInfoEditMode;
	}
	$scope.updateNewShippingInfoMode = function() {
		$scope.newShippingInfoMode  = !$scope.newShippingInfoMode;
	}
	$scope.updatePaymentInfoEditMode = function() {
		$scope.paymentInfoEditMode  = !$scope.paymentInfoEditMode;
	}
	$scope.updateNewPaymentMode = function() {
		$scope.newPaymentMode  = !$scope.newPaymentMode;
	}


	$scope.login = function() {
		$scope.isValidUser = true;
		$scope.isloginPage = false;		
		angular.forEach($scope.users, function(user,key) {
			if($scope.loginUser && $scope.loginUser.userName === user.userName && $scope.loginUser.password === user.password) {
				$scope.loginUser = user;
				console.log("loginUser", $scope.loginUser);
				$scope.isloginPage = false;
				$scope.isValidUser = true;
				$state.go('welcome');		
			} 
		});
	}
	$scope.logout = function() {
		$scope.isloginPage = true;
		$scope.loginUser = {};
		$location.path('/');
	}

	$scope.contactUS = function() {
		$location.path('http://www.njtransit.com/tm/tm_servlet.srv?hdnPageAction=ContactUsTo');
	}

	$scope.expandMenu = function(id) {
	    var x = document.getElementById(id);
	    if (x.className.indexOf("w3-show") == -1) {
	        x.className += " w3-show";
	        x.previousElementSibling.className += " w3-theme-l1";
	    } else { 
	        x.className = x.className.replace("w3-show", "");
	        x.previousElementSibling.className = 
	        x.previousElementSibling.className.replace(" w3-theme-l1", "");
	    }
	}

	init();

    $scope.initPurchaseStations = function() {

		$scope.origin =  {
			"stationId" : "0",
			"stationName" : "select Origin",
			"isFav" : "false"
		};
		$scope.destination = {
			"stationId" : "0",
			"stationName" : "select Destination",
			"isFav" : "false"
		}
    }

    $scope.myAccFunc = function(elementId) {

    	if((elementId === 'demoAcc' && $scope.selectedUser && $scope.selectedUser.userID) || 
    		(elementId !== 'demoAcc')){
		    var x = document.getElementById(elementId);
		    if (x.className.indexOf("w3-show") == -1) {
		        x.className += " w3-show";
		        x.previousElementSibling.className += "w3-light-grey";
		    } else {
		        x.className = x.className.replace(" w3-show", "");
		        x.previousElementSibling.className =
		        x.previousElementSibling.className.replace("w3-light-grey", "");
		    }
    	} else {
    		if(elementId === 'demoAcc') {
    			$state.go('welcome.manageUser');
    		}
    	}
	}
	$scope.getAllTerminals = function(){
		$scope.terminals = [];		
		$scope.selectedService = {};
		angular.forEach($scope.services, function(value, key) {
			$scope.selectedService = value;
			angular.forEach(value.serviceLines, function(line,lineKey) {
				angular.forEach(line.stations, function(station,stationKey) {
					angular.forEach(station.terminals, function(terminal,terminalKey) {
						var tempTerminal = terminal;
						tempTerminal.serviceType = value.serviceType;
						tempTerminal.line = line.lineName;
						tempTerminal.stationName = station.stationName;
						$scope.terminals.push(tempTerminal);
					});
				});					
			});				
		});
		console.log("$scope.terminals", $scope.terminals);
	}

	$scope.getTerminalsByService = function(elementId, service){
		$scope.terminals = [];
		$scope.selectedService = {};
		console.log("service", service);
		angular.forEach($scope.services, function(value, key) {
			if(service.serviceType === value.serviceType) {
				$scope.selectedService = value;
				angular.forEach(value.serviceLines, function(line,lineKey) {
					angular.forEach(line.stations, function(station,stationKey) {
						angular.forEach(station.terminals, function(terminal,terminalKey) {
							var tempTerminal = terminal;
							tempTerminal.serviceType = value.serviceType;
							tempTerminal.line = line.lineName;
							tempTerminal.stationName = station.stationName;
							$scope.terminals.push(tempTerminal);
						});
					});					
				});				
			}
		});
		console.log("$scope.terminals", $scope.terminals);
		var x = document.getElementById(elementId);
	    if (x.className.indexOf("w3-show") == -1) {
	        x.className += " w3-show";
	        x.previousElementSibling.className += "w3-light-grey";
	    } else {
	        x.className = x.className.replace(" w3-show", "");
	        x.previousElementSibling.className =
	        x.previousElementSibling.className.replace("w3-light-grey", "");
	    }
	    $state.go('welcome.terminals');
	}

	$scope.getTerminalsByLine = function(elementId, line){
		$scope.terminals = [];
		console.log("service", line);
		angular.forEach($scope.services, function(value, key) {
			if($scope.selectedService.serviceType === value.serviceType) {
				angular.forEach(value.serviceLines, function(lineValue,lineKey) {
					if(line.lineName === lineValue.lineName) {
						$scope.selectedLine = lineValue;
						angular.forEach(lineValue.stations, function(station,stationKey) {
							angular.forEach(station.terminals, function(terminal,terminalKey) {
								var tempTerminal = terminal;
								tempTerminal.serviceType = value.serviceType;
								tempTerminal.line = lineValue.lineName;
								tempTerminal.stationName = station.stationName;
								$scope.terminals.push(tempTerminal);
							})
						});	
					}
				});				
			}
		});
		console.log("$scope.terminals", $scope.terminals);
		var x = document.getElementById(elementId);
	    if (x.className.indexOf("w3-show") == -1) {
	        x.className += " w3-show";
	        x.previousElementSibling.className += "w3-light-grey";
	    } else {
	        x.className = x.className.replace(" w3-show", "");
	        x.previousElementSibling.className =
	        x.previousElementSibling.className.replace("w3-light-grey", "");
	    }
	    $state.go('welcome.terminals');
	}

	$scope.getTerminalsByStation = function(station){
		$scope.terminals = [];
		console.log("station", station);
		angular.forEach($scope.services, function(value, key) {
			if($scope.selectedService.serviceType === value.serviceType) {
				angular.forEach(value.serviceLines, function(lineValue,lineKey) {
					if($scope.selectedLine.lineName === lineValue.lineName) {
						angular.forEach(lineValue.stations, function(stationValue,stationKey) {
							if(station ===  stationValue.stationName) {
								angular.forEach(stationValue.terminals, function(terminal,terminalKey) {
									var tempTerminal = terminal;
									tempTerminal.serviceType = value.serviceType;
									tempTerminal.line = lineValue.lineName;
									tempTerminal.stationName = stationValue.stationName;
									$scope.terminals.push(tempTerminal);
								});
							}

						});	
					}
				});				
			}
		});
		console.log("$scope.terminals", $scope.terminals);	
		$state.go('welcome.terminals');
	}

  	$scope.manageUser = function(user) {
        $scope.selectedUser = user;        
        $state.go('welcome.userDetails');
    }

    $scope.stopManagingAccount = function() {
    	$scope.selectedUser = {};        
        $state.go('welcome.manageUser');
    }

    $scope.selectedStation = {};
    $scope.setSelectedStation = function(station) {
    	$scope.selectedStation = station;
    	//$scope.go();    	
    }

}]);


 	