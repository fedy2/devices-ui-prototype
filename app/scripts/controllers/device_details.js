'use strict';

angular.module("devicesUiApp")
.controller("DeviceDetailsCtrl", ["$route", "$log", "routingservice", "searchservice", "device", 
           function ($route, $log, routingservice, searchservice, device) {
	
	var self = this;
	
	this.device = device;
	this.edit = false;
	
	this.goBack = function() {
		routingservice.goDevicesList();
	};
	
	this.goEdit = function() {
		routingservice.goEditSingleDevice(device);
	};
}]);