'use strict';

var services = angular.module("services", ["resources"]);

services.factory("devicesservice", ["devicesresource", function(devicesresource) {
	
	function DeviceService() {
		
		this.list = function() {
			return devicesresource.query().$promise;
		};
	}
	return new DeviceService();
	
}]);


