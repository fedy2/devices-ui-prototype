'use strict';

angular.module("devicesUiApp")
.controller("FiltersCtrl", ["$log", "filtersgenerator", "pagingservice", 
           function ($log, filtersgenerator, pagingservice) {
	
	var self = this;
	
	this.groupedFilters =[];
	
	filtersgenerator.getFilters().then(function(filters){
		self.groupedFilters = Stream(filters).groupingBy('property');
	});
	
	this.isActive = pagingservice.isFilterActive;
	this.toggle = pagingservice.toggleFilter;

}]);