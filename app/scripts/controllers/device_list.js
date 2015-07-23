'use strict';

angular.module("devices", ["services"])
.controller("DeviceListCtrl", ["$route", "$log", "selectionservice", "searchservice", "devicesBatch", 
           function ($route, $log, selectionservice, searchservice, devicesBatch) {
	
	  this.devices = devicesBatch.devices;
	  searchservice.update(devicesBatch);
	  
	  this.selection = selectionservice;
	  this.selection.resetPageSelected();
}]);