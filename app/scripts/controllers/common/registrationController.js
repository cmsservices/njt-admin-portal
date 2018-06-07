'use restrict';
var app = angular.module('njTransitApp');

app.controller('registrationController', ['$rootScope','$scope', '$state', '$filter', 
	function($rootScope,$scope, $state, $filter) {
		
		$scope.userDetails = {
			firstName : '',
			email : '',
			password : '',
			retypePassword : '',
			zipCode : ''
		}
		//on change of user id we can check whehter the email id is already registered in the system or not
		//we will call the service to create the account agaisnt DB
		$scope.createAccount = function() {
			if($scope.userDetails.password !== $scope.userDetails.retypePassword) { // we can do this onchange also
				$scope.passwordInvalid = true;
			} else {
				$scope.isCreatedSuccessfully = true;
				$scope.users.push($scope.userDetails); 
				$scope.userDetails = {
					firstName : '',
					email : '',
					password : '',
					retypePassword : '',
					zipCode : ''
				}
				// create the account only both P/W are same 							
			}

		}  

		$scope.toLowerCase = function() {
			$scope.userDetails.email = $filter('lowercase')($scope.userDetails.email);
		}

	}])