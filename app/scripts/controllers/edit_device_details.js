'use strict';

angular.module("devicesUiApp")
.controller("EditDeviceDetailsCtrl", ["$route", "$log", "routingservice", "searchservice", "device", 
           function ($route, $log, routingservice, searchservice, device) {
	
	var self = this;
	
	this.device = device;
	this.edit = false;
	
	this.cancel = function() {
		routingservice.goSingleDevice(self.device);
	};
	
	this.save = function() {
		routingservice.goSingleDevice(self.device);
	};

	this.addNewAttribute = function() {
		self.device.attributes.push({name:"", value:""});
	};
	
	this.removeAttribute = function(attribute) {
		var index = device.attributes.indexOf(attribute);
		$log.info("index: "+index);
		if (index>=0) device.attributes.splice(index, 1);
	};

}]);