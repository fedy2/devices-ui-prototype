'use strict';

angular.module("devices", ["services"])
.controller("DeviceListCtrl", ["$route", "$log", "searchservice", "devicesBatch", 
           function ($route, $log, searchservice, devicesBatch) {
	
	  this.devices = devicesBatch.devices;
	  searchservice.update(devicesBatch);
	  
	  this.selected = [];
	  this.isSelected = function(device) {
		  return this.selected.indexOf(device.id)>=0;
	  };
	  this.toggle = function(device) {
		  $log.info("Toggle ", device);
		  var idx = this.selected.indexOf(device.id);
		  if (idx >= 0) this.selected.splice(idx, 1);
		  else this.selected.push(device.id);
	  };
	  

}]);