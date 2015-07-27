'use strict';

/**
 * Device list controller
 */
angular.module("devicesUiApp")
.controller("DeviceListCtrl", ["routingservice", "selectionservice", "searchservice", "devicesBatch", 
           function (routingservice, selectionservice, searchservice, devicesBatch) {
	
	this.devices = devicesBatch.devices;
	this.search = searchservice;
	searchservice.update(devicesBatch);
	  
	this.selection = selectionservice;
	this.selection.resetPageSelected();
	
	this.toggleListSelection = function() {
		if (!selectionservice.isNone()) selectionservice.clear();
		else selectionservice.selectPage(searchservice.currentDevices);
	};
	
	this.selectDevice = function(event, device) {
		//we prevent click event propagation to the list element
		event.stopPropagation();
		selectionservice.toggle(device);
	};
	  
	this.showDevice = function(device) {
		routingservice.goSingleDevice(device);
	};
	
	//ADD ATTRIBUTE
	this.nameField = "";
	this.valueField = "";
	
	this.addAttribute = function() {
		self.nameField = "";
		self.valueField = "";		
		$('#addAttributeModal').modal();
	};
}]);