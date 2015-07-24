'use strict';

angular.module("devicesUiApp")
.controller("DeviceListCtrl", ["$route", "$log", "$location", "selectionservice", "searchservice", "devicesBatch", 
           function ($route, $log, $location, selectionservice, searchservice, devicesBatch) {
	
	  this.devices = devicesBatch.devices;
	  searchservice.update(devicesBatch);
	  
	  this.selection = selectionservice;
	  this.selection.resetPageSelected();
	  
	  this.showDevice = function(device) {
		  $location.path('/projects/demo/devices/'+device.id);
	  };
}]);