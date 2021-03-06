'use strict';

/**
 * Application services.
 */
var services = angular.module("services", ["resources"]);

/**
 * Devices service. Wraps the device resource in order to simulate the backend operations (filtering, paging, searching, single device info).
 */
services.factory("devicesservice", ["devicesresource", "$q", "$log", "parsingservice", 
                                    function(devicesresource, $q, $log, parsingservice) {
	
	function DeviceService() {
		
		this.list = function(start, len, query, filters) {
			$log.info("list start: "+start+" len: "+len+" query: "+query+" filters: ",filters);
			var deferred = $q.defer();
			
			devicesresource.query().$promise.then(function(devices) {
				
				var stream = new Stream(devices);
				   
				if (query !== null) {
					var filterFunction = parsingservice.parse(query);
					stream.filter(filterFunction);
				}
				
				if (filters !== null && filters.length > 0) {
					stream.filter(function(device){
						return new Stream(filters)
							.allMatch(function(filter){
								return LangParser.hasKeyValue(device, filter.property, filter.value);
							});
					});
				}
								
				var filteredDevices = stream.toArray();
				
				var devicesPage = filteredDevices.slice(start, start + len);
				
				deferred.resolve({
					devices:devicesPage,
					start:start,
					len:len,
					total:filteredDevices.length,
					query: query,
					filters: filters
				});
            });
			
			return deferred.promise;
		};
		
		this.get = function(deviceId) {
			$log.info("get deviceId: "+deviceId);
			var deferred = $q.defer();
			
			devicesresource.query().$promise.then(function(devices) {
				var found = new Stream(devices).filter(function (device){return device.id === deviceId;}).findFirst().orElse(null);
				deferred.resolve(found);
            });
			
			return deferred.promise;
		};
	}
	return new DeviceService();
	
}]);

/**
 * Search service. Handles the search operation, the result paging and the filter toggling.
 */
services.factory("searchservice", ["$route", "$location", "$log", "pagingConstants", 
                                   function($route, $location, $log,  pagingConstants) {
	
	function SearchService() {
		
		var self = this;
		
		this.metadata = {
				filters:[]
		};
		this.controls = {};
		this.currentDevices = [];
		
		this.update = function(deviceBatch) {
			this.metadata.start = deviceBatch.start;
			this.metadata.len = deviceBatch.len;
			this.metadata.end = deviceBatch.start + deviceBatch.devices.length;
			this.metadata.total = deviceBatch.total;
			this.metadata.query = deviceBatch.query;
			this.metadata.filters = deviceBatch.filters;
			this.currentDevices = deviceBatch.devices;
			
			this.metadata.userQuery = deviceBatch.query;
		
			this.controls.hasNextPage = this.metadata.end < this.metadata.total;
			this.controls.hasPrevPage = this.metadata.start > 0;
		};

		
		//PAGE NAVIGATION
		this.nextPage = function() {
			var start = parseInt(this.metadata.start) + pagingConstants.pageSize;
			$location.search(pagingConstants.startParam, start);
			$location.search(pagingConstants.lenParam, pagingConstants.pageSize);
		};
		
		this.prevPage = function() {
			var start = Math.max(parseInt(this.metadata.start) - pagingConstants.pageSize, 0);
			$location.search(pagingConstants.startParam, start);
			$location.search(pagingConstants.lenParam, pagingConstants.pageSize);
		};
		
		
		//FILTERS
		this.indexOfFilter = function(toSearch) {
			for (var i = 0; i < self.metadata.filters.length; i++) {
			    var filter = self.metadata.filters[i];
				if (filter.property === toSearch.property && filter.value === toSearch.value) return i;
			}
			return -1;
		};
		
		this.isFilterActive = function(filter) {
			return self.indexOfFilter(filter)>=0;
		};
  		
  		this.toggleFilter = function(filter) {
			$log.info("toggleFilter",filter);
				
			var idx = self.indexOfFilter(filter);
			if (idx >= 0) self.metadata.filters.splice(idx, 1);
			else self.metadata.filters.push(filter);
			
			self.applyFilters();
  		};
  		
  		this.removeFilter = function(filter) {
  			$log.info("removeFilter",filter);
  			var idx = self.indexOfFilter(filter);
    		if (idx >= 0) {
    			self.metadata.filters.splice(idx, 1);
    			self.applyFilters();
    		}
  		};
  		
  		
  		//SEARCH
		this.search = function(query, filters) {
			$log.info("search", query, filters);
			$location.search(pagingConstants.startParam, 0);
			$location.search(pagingConstants.lenParam, pagingConstants.pageSize);
			$location.search(pagingConstants.queryParam, query);
			$location.search(pagingConstants.filtersParam, self.encodeFilters(filters));
		};
		
		this.query = function(query) {
			$log.info("query", query);
			$location.search(pagingConstants.startParam, 0);
			$location.search(pagingConstants.lenParam, pagingConstants.pageSize);
			$location.search(pagingConstants.queryParam, query);
			$location.search(pagingConstants.filtersParam, self.encodeFilters(self.metadata.filters));
		};
		
		this.setSearchParameters = function() {
			$location.search(pagingConstants.startParam, self.metadata.start);
			$location.search(pagingConstants.lenParam, self.metadata.len);
			$location.search(pagingConstants.queryParam, self.metadata.query);
			$location.search(pagingConstants.filtersParam, self.encodeFilters(self.metadata.filters));
		};
		
		this.applyFilters = function() {
			$log.info("applyFilters");
			$location.search(pagingConstants.startParam, 0);
			$location.search(pagingConstants.lenParam, pagingConstants.pageSize);
			$location.search(pagingConstants.filtersParam, self.encodeFilters(self.metadata.filters));
		};
		
		this.encodeFilters = function(filters) {
			return new Stream(filters)
			.map(function(filter){ 
				return filter.property+","+filter.value;
				})
			.toArray();
		};
		
		this.decodeFilters = function(values) {
			if (typeof values !== 'object') values = [values];
			var filters = new Stream(values)
			.map(function(value){
				var tokens = value.split(",");
				return {property:tokens[0],value:tokens[1]};
				})
			.toArray();
			return filters;
		};

	}
	return new SearchService();
	
}]);

/**
 * Parsing service. Handle the query parsing, used for backend simulation.
 */
services.factory("parsingservice", ["$log", 
                                   function($log) {
	
	function ParsingService() {
		this.parse = function(query) {
			$log.info("query", query);
			var functionCode = LangParser.parser.parse(query);
			$log.info("functionCode", functionCode);
			/*jshint -W054 */
			return new Function("obj",functionCode);
		};
	}
	return new ParsingService();
	
	
}]);

/**
 * Bookmark service. Manages the bookmark instances. Static list for this prototype.
 */
services.factory("bookmarkservice", [function() {
 	
 	function BookmarkService() {
 		this.bookmarks = [
 		                  {
 		                	  id:"0",
 		                	  label:"Devices offline in Denmark",
 		                	  query: "location:Denmark AND status:Offline",
 		                	  filters:[]
 		                  },
 		                  {
 		                	  id:"1",
 		                	  label:"Devices to update",
 		                	  query: "group:toUpdate",
 		                	  filters:[]
 		                  },
 		                  {
 		                	  id:"2",
 		                	  label:"Extremo's devices in Zambia",
 		                	  query: "company:Extremo AND location:Zambia",
 		                	  filters:[]
 		                  }
 		                  ]; 
 	}
 	return new BookmarkService();
 	
 	
 }]);

/**
 * Filters generator. Generates the filters list based on current devices list. It is a backend simulation.
 */
services.factory("filtersgenerator", ["$q", "$log", "devicesresource",
                                     function($q, $log, devicesresource) {
  	
  	function FiltersGenerator() {
  		
  		var self = this;
  		
  		this.isPrimitive = function(value) {
  			return typeof value === 'number' || 
  				   typeof value === 'string' || 
  				   typeof value === 'boolean';
  		};
  		
  		this.getFilters = function() {
  			var deferred = $q.defer();
  			
  			devicesresource.query().$promise.then(function(devices){
  				
  				//extract properties
  				var properties = [];
  				new Stream(devices)
  				.forEach(function(device){
  					//$log.info("device: ",device);
  					  					
  					var keys = Object.keys(device);
  					for (var i = 0; i < keys.length; i++) {
  						var key = keys[i];
  					    var value = device[key];
  					    
  					    if (self.isPrimitive(value)) properties.push({key:key,value:value});
  					}
  				
  					if (device.hasOwnProperty("attributes")) {
  						for (i = 0; i < device.attributes.length; i++) {
  						    var attribute = device.attributes[i];
  						    properties.push({key:attribute.name,value:attribute.value});
  						}
  					}
 				});
  				
  				//count properties
  				var propertiesCounters = {};
  				new Stream(properties)
  				.forEach(function(property){
  					var key = property.key;
  					var value = property.value;
  					
  					if (!(key in propertiesCounters)) propertiesCounters[key] = {};
			    	
			    	if (value in propertiesCounters[key]) propertiesCounters[key][value]++;
			    	else propertiesCounters[key][value] = 1;
  				});
  				
 				//$log.info("counters: ",propertiesCounters);
 				
 				//simple counters filtering
 				var filters = [];
 				for (var propertyName in propertiesCounters) {
				  if (!propertiesCounters.hasOwnProperty(propertyName)) continue;
				  
				  //$log.info("checking: ", propertyName)
				  
				  var propertyValuesCounters = propertiesCounters[propertyName];
				  
				  var filteredValues = [];
				  
				  for (var value in propertyValuesCounters) {
					  if (!propertyValuesCounters.hasOwnProperty(value)) continue;
					  
					  var count = propertyValuesCounters[value];
					  
					  //$log.info(" value: "+value+" count: "+count);
					  
					  //we accept only values with frequency more that two
					  if (count>2) filteredValues.push(value);
				  }
				  
				  //$log.info("values for "+propertyName, filterValues);
				  
				  //we add filters only with more than one value
				  if (filteredValues.length>1) {
					  /*jshint loopfunc: true */
					  new Stream(filteredValues).forEach(function(value){
						  filters.push({property:propertyName, value:value});
					  });
				  }
				  
				}

 				$log.info("filters: ",filters);
 				
 				deferred.resolve(filters);
  				
  			});
  			
  			return deferred.promise;
  			
  		};
  		
  	}
  	return new FiltersGenerator();
  	
  	
  }]);

/**
 * Selection service. Handles the devices selection in list.
 */
services.factory("selectionservice", ["$log", 
                                     function($log) {
  	
  	function SelectionService() {
  		var self = this;
  		
  		this.selected = [];
  		this.allSelected = false;
  		this.pageSelected = false;
  		
		this.isSelected = function(device) {
			return self.allSelected || self.selected.indexOf(device.id)>=0;
		};
		
		this.toggle = function(device) {
			$log.info("Toggle ", device);
			var idx = self.selected.indexOf(device.id);
			if (idx >= 0) self.selected.splice(idx, 1);
			else self.selected.push(device.id);
		};
		
		this.clear = function() {
			self.selected = [];
			self.allSelected = false;
			self.pageSelected = false;
		};
		
		this.selectPage = function(devices) {
			$log.info("select ", devices);
			for (var i = 0; i<devices.length; i++) {
				var device = devices[i];
				if (self.selected.indexOf(device.id)<0) self.selected.push(device.id);
			}
			self.pageSelected = true;
		};
		
		this.selectAll = function() {
			$log.info("selectAll ");
			self.allSelected = true;
			self.pageSelected = false;
		};
		
		this.isNone = function() {
			return self.selected.length === 0 && !self.allSelected;
		};
		
		this.isPartial = function() {
			return self.selected.length !== 0 && !self.allSelected;
		};
		
		this.isPageSelected = function () {
			return self.pageSelected;
		};
		this.resetPageSelected = function () {
			self.pageSelected = false;
		};
		
		this.isAll = function() {
			return self.allSelected;
		};
		
  	}
  	return new SelectionService();
	
  }]);

/**
 * Routing service. Offers helpers method for location management.
 */
services.factory("routingservice", ["$location", "searchservice", 
                                     function($location, searchservice) {
  	
  	function RoutingService() {
  		
  		this.goSingleDevice = function(device) {
  			$location.search({});
  			$location.path('/projects/demo/devices/'+device.id);
  		};
  		
  		this.goEditSingleDevice = function(device) {
  			$location.search({});
  			$location.path('/projects/demo/devices/'+device.id+'/edit');
  		};
  		
  		this.goDevicesList = function() {
  			searchservice.setSearchParameters();
  			$location.path('/projects/demo/devices');
  		};
  	}
  	return new RoutingService();
  	
  	
  }]);


