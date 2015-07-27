'use strict';

angular.module("devicesUiApp")
.controller("DeviceListCtrl", ["$route", "$log", "routingservice", "selectionservice", "searchservice", "devicesBatch", 
           function ($route, $log, routingservice, selectionservice, searchservice, devicesBatch) {
	
	this.devices = devicesBatch.devices;
	searchservice.update(devicesBatch);
	  
	this.selection = selectionservice;
	this.selection.resetPageSelected();
	
	this.toggleSelection = function(event) {
		event.stopPropagation();
		if (!selectionservice.isNone()) selectionservice.clear();
		else selectionservice.selectPage(searchservice.currentDevices);
	};
	
	this.search = searchservice;
	
	this.selectDevice = function(event, device) {
		event.stopPropagation();
		selectionservice.toggle(device);
	};
	  
	this.showDevice = function(device) {
		routingservice.goSingleDevice(device);
	};
}]);