'use strict';

angular.module("devicesUiApp")
.controller("DeviceListCtrl", ["$route", "$log", "routingservice", "selectionservice", "searchservice", "devicesBatch", 
           function ($route, $log, routingservice, selectionservice, searchservice, devicesBatch) {
	
	  this.devices = devicesBatch.devices;
	  searchservice.update(devicesBatch);
	  
	  this.selection = selectionservice;
	  this.selection.resetPageSelected();
	  
	  this.toggle = function(event, device) {
		  event.stopPropagation();
		  selectionservice.toggle(device);
	  };
	  
	  this.showDevice = function(device) {
		  routingservice.goSingleDevice(device);
	  };
}]);