'use strict';

var services = angular.module("services", ["resources"]);

services.factory("devicesservice", ["devicesresource", "$q", "$log", "parsingservice", function(devicesresource, $q, $log, parsingservice) {
	
	function DeviceService() {
		
		this.list = function(start, len, query, filters) {
			$log.info("list start: "+start+" len: "+len+" query: "+query+" filters: ",filters);
			var deferred = $q.defer();
			
			devicesresource.query().$promise.then(function(devices) {
				
				var stream = new Stream(devices);
				   
				if (query != null) {
					var filterFunction = parsingservice.parse(query);
					stream.filter(filterFunction);
				}
				
				if (filters != null && filters.length > 0) {
					stream.filter(function(device){
						return Stream(filters)
							.allMatch(function(filter){
								return LangParser.hasKeyValue(device, filter.property, filter.value);
							})
					});
				}
								
				var filteredDevices = stream.slice(start, start + len).toArray();
				
				deferred.resolve({
					devices:filteredDevices,
					start:start,
					total:devices.length,
					query: query,
					filters: filters
				});
            });
			
			return deferred.promise;
		};
	}
	return new DeviceService();
	
}]);

services.factory("searchservice", ["$route", "$location", "$log", "pagingConstants", 
                                   function($route, $location, $log, pagingConstants) {
	
	function SearchService() {
		
		var self = this;
		
		this.metadata = {
				filters:[]
		};
		this.controls = {};
		
		this.update = function(deviceBatch) {
			this.metadata.start = deviceBatch.start;
			this.metadata.end = deviceBatch.start + deviceBatch.devices.length;
			this.metadata.total = deviceBatch.total;
			this.metadata.query = deviceBatch.query;
			this.metadata.filters = deviceBatch.filters;
			
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
			$log.info("prev page");
			var start = Math.max(parseInt(this.metadata.start) - pagingConstants.pageSize, 0);
			$location.search(pagingConstants.startParam, start);
			$location.search(pagingConstants.lenParam, pagingConstants.pageSize);
		};
		
		
		//FILTERS
		
		this.indexOfFilter = function(toSearch) {
			for (var i = 0; i < self.metadata.filters.length; i++) {
			    var filter = self.metadata.filters[i]
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
		
		this.applyFilters = function() {
			$log.info("applyFilters");
			$location.search(pagingConstants.filtersParam, self.encodeFilters(self.metadata.filters));
		};
		
		this.encodeFilters = function(filters) {
			return Stream(filters)
			.map(function(filter){ 
				return filter.property+","+filter.value;
				})
			.toArray();
		}
		
		this.decodeFilters = function(values) {
			$log.info("decodeFilters ", values)
			if (typeof values !== 'object') values = [values];
			var filters = Stream(values)
			.map(function(value){
				var tokens = value.split(",");
				return {property:tokens[0],value:tokens[1]};
				})
			.toArray();
			$log.info("filters", filters);
			return filters;
		}
		
		
		
	}
	return new SearchService();
	
}]);


services.factory("parsingservice", ["$log", 
                                   function($log) {
	
	function ParsingService() {
		this.parse = function(query) {
			$log.info("query", query);
			var functionCode = LangParser.parser.parse(query);
			$log.info("functionCode", functionCode);
			return Function("obj",functionCode);
		};
	}
	return new ParsingService();
	
	
}]);

services.factory("bookmarkservice", ["$log", 
                                    function($log) {
 	
 	function BookmarkService() {
 		this.bookmarks = [
 		                  {
 		                	  id:"0",
 		                	  label:"Devices online in Pisa",
 		                	  query: "location:Pisa AND status:Online",
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

services.factory("filtersgenerator", ["$q", "$log", "devicesresource", "searchservice", 
                                     function($q, $log, devicesresource, searchservice) {
  	
  	function FiltersGenerator() {
  		
  		var self = this;
  		
  		this.isPrimitive = function(value) {
  			return typeof value === 'number' 
  				|| typeof value === 'string'
  				|| typeof value === 'boolean';
  		};
  		
  		this.getFilters = function() {
  			var deferred = $q.defer();
  			
  			devicesresource.query().$promise.then(function(devices){
  				
  				//extract properties
  				var properties = [];
  				Stream(devices)
  				.forEach(function(device){
  					//$log.info("device: ",device);
  					  					
  					var keys = Object.keys(device);
  					for (var i = 0; i < keys.length; i++) {
  						var key = keys[i];
  					    var value = device[key];
  					    
  					    if (self.isPrimitive(value)) properties.push({key:key,value:value});
  					}
  				
  					if (device.hasOwnProperty("attributes")) {
  						var attributes = device["attributes"];
  						for (var i = 0; i < attributes.length; i++) {
  						    var attribute = attributes[i];
  						    properties.push({key:attribute.name,value:attribute.value});
  						}
  					}
 				});
  				
  				//count properties
  				var propertiesCounters = {};
  				Stream(properties)
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
					  Stream(filteredValues).forEach(function(value){
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


