'use strict';

angular.module("devicesUiApp")
.controller("FiltersbarCtrl", ["$log", "pagingservice",  
           function ($log, pagingservice) {
	
	this.metadata = pagingservice.metadata;
	this.removeFilter = pagingservice.removeFilter;

}]);