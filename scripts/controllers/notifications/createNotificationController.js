
'use restrict';
var app = angular.module('njTransitApp');

app.controller('createNotificationController', ['$rootScope','$scope', '$state', 'restService', 'ngDialog',
	function($rootScope,$scope, $state, restService, ngDialog) {
		init();
		function init() {
			var params = {
				action: 'notification_panel', 
				version: '1.0', 
				data: {
					method: 'create-init', 
					username: "suneetha.mudunuri@xerox.com", 
					machineCode: "ee7e51f32aad2190ef"
				}
			};
			restService.getData(params).then(function(data) {
				console.log("init Data", data);
			})
		}
	}]);