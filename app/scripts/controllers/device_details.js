'use strict';

/**
 * Device details controller.
 */
angular.module("devicesUiApp")
.controller("DeviceDetailsCtrl", ["routingservice", "device", 
           function (routingservice, device) {

	this.device = device;
	
	this.goBack = function() {
		routingservice.goDevicesList();
	};
	
	this.goEdit = function() {
		routingservice.goEditSingleDevice(device);
	};
}]);