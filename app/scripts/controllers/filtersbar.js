'use strict';

angular.module("devicesUiApp")
.controller("FiltersbarCtrl", ["$log", "searchservice",  
           function ($log, searchservice) {
	
	this.metadata = searchservice.metadata;
	this.removeFilter = searchservice.removeFilter;

}]);