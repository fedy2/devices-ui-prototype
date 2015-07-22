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

services.factory("pagingservice", ["$route", "$location", "$log", function($route, $location, $log) {
	
	function PagingService() {
		
		this.metadata = {};
		this.controls = {};
		
		this.update = function(deviceBatch) {
			this.metadata.start = deviceBatch.start;
			this.metadata.end = deviceBatch.start + deviceBatch.devices.length;
			this.metadata.total = deviceBatch.total;
		
			this.controls.hasNextPage = this.metadata.end < this.metadata.total;
			this.controls.hasPrevPage = this.metadata.start > 0;
		};
		
		this.nextPage = function() {
			var start = parseInt(this.metadata.start) + 20;
			$location.search('start', start);
			$location.search('len', 20);
		};
		
		this.prevPage = function() {
			$log.info("prev page");
			var start = Math.max(parseInt(this.metadata.start) - 20, 0);
			$location.search('start', start);
			$location.search('len', 20);
		};
		
	}
	return new PagingService();
	
}]);


