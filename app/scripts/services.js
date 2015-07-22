'use strict';

var services = angular.module("services", ["resources"]);

services.factory("devicesservice", ["devicesresource", "$q", "$log", function(devicesresource, $q, $log) {
	
	function DeviceService() {
		
		this.list = function(start, len, query) {
			$log.info("start: "+start+" len: "+len+" query: "+query);
			var deferred = $q.defer();
			
			devicesresource.query().$promise.then(function(devices) {
				var filteredDevices = new Stream(devices)
				   .slice(start, start + len)
				   .toArray();
				
				deferred.resolve({
					devices:filteredDevices,
					start:start,
					total:devices.length
				});
            });
			
			return deferred.promise;
		};
	}
	return new DeviceService();
	
}]);

services.factory("pagingservice", ["$route", function($route) {
	
	function PagingService() {
		
		this.metadata = {};
		this.update = function(deviceBatch) {
			this.metadata.start = deviceBatch.start;
			this.metadata.end = deviceBatch.start + deviceBatch.devices.length;
			this.metadata.total = deviceBatch.total;
		}
	}
	return new PagingService();
	
}]);


