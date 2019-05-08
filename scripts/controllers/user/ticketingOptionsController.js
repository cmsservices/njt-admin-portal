'use restrict';
var app = angular.module('njTransitApp');

app.controller('ticketOptionsController', ['$rootScope','$scope','userService', '$state',
	function($rootScope,$scope, userService, $state) {
  	  $scope.events = [];
      $scope.eventGridOptions = {};
      $scope.ticketGridOptions = {};
      $scope.tickets = {};
      $scope.noofTickets = 0;
      $scope.productTypes = [
      {
        "productID" : "",
        "productDescription" : "Please select a Product" 
      },
      {
        "productID" : "rail",
        "productDescription" : "Rail" 
      }
      /*,{
        "productID" : "bus",
        "productDescription" : "Bus Tickets" 
      },{
        "productID" : "lightRail",
        "productDescription" : "LightRail Tickets" 
      },{
        "productID" : "events",
        "productDescription" : "Event Tickets" 
      }*/
      ];
      $scope.selectedProduct = $scope.productTypes[0];
    	
    	function init() {
    		userService.getEvents().then(function(data) {
    			$scope.events = data;
    			$scope.constructEventGridOptions();
         
    		});
        userService.getTicketTypes().then(function(tickets){
           $scope.tickets = tickets;
           $scope.constructTicketGridOptions();
        });
    	}

      $scope.constructEventGridOptions = function() {
          var fareTemplate = '<span> ${{row.entity.fare}}.00 </span>';
          var quantityCellTemplate = '<button ng-click="row.entity.quantity = row.entity.quantity - 1"> - </button>'+
          ' <input min="0" style="width : 40% !important;" ng-model="row.entity.quantity">' +
          '<button ng-click="row.entity.quantity = row.entity.quantity + 1"> + </button> ';
          var totalCellTemplate = '<span> {{row.entity.quantity * row.entity.fare}} </span>';
          $scope.eventGridOptions = {
          data : $scope.events,
          enableFiltering: true,
          columnDefs: [
            { displayName: 'Event Date', field: 'eventDate', cellClass : 'gridCellClass'},
            { displayName: 'Event Description', field: 'eventDesc', cellClass : 'gridCellClass'},
            { displayName: 'Fare', field: 'fare', cellClass : 'gridCellClass', cellTemplate : fareTemplate}, 
            { displayName: 'Quantity', field: 'quantity', cellTemplate : quantityCellTemplate , cellClass : 'gridCellClass'},
            { displayName: 'Total', field : 'total', cellTemplate : totalCellTemplate , cellClass : 'gridCellClass'}
          ]
        };
      }

      $scope.constructTicketGridOptions = function() {
          var fareTemplate = '<span> ${{row.entity.fare}}.00 </span>';
          var quantityCellTemplate = '<button ng-click="row.entity.quantity = row.entity.quantity - 1"> - </button>'+
          ' <input min="0" style="width : 40% !important;" ng-model="row.entity.quantity">' +
          '<button ng-click="row.entity.quantity = row.entity.quantity + 1"> + </button> ';
          var totalCellTemplate = '<span> {{row.entity.quantity * row.entity.fare}} </span>';
          $scope.ticketGridOptions = {
          data : $scope.tickets,
          enableFiltering: true,
          columnDefs: [
            { displayName: 'Ticket', field: 'ticketType', cellClass : 'gridCellClass'},
            { displayName: 'Quantity', field: 'quantity', cellTemplate : quantityCellTemplate , cellClass : 'gridCellClass'}
          ]
        };
      }

      init();

      $scope.updateSubProducts = function() {
          console.log("Selected Product : ", $scope.selectedProduct);
      }
}]);