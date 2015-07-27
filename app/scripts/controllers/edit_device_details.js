'use strict';

/**
 * Edit device details controller.
 */
angular.module("devicesUiApp")
.controller("EditDeviceDetailsCtrl", ["routingservice", "device", 
           function (routingservice, device) {
	
	var self = this;
	this.device = device;
	
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
		if (index>=0) device.attributes.splice(index, 1);
	};

}]);