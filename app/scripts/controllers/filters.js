'use strict';

/**
 * Filters controller.
 */
angular.module("devicesUiApp")
.controller("FiltersCtrl", ["filtersgenerator", "searchservice", 
           function (filtersgenerator, searchservice) {
	
	var self = this;
	
	this.groupedFilters =[];
	
	filtersgenerator.getFilters().then(function(filters){
		self.groupedFilters = Stream(filters).groupingBy('property');
	});
	
	this.isActive = searchservice.isFilterActive;
	this.toggle = searchservice.toggleFilter;

}]);