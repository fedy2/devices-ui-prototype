'use strict';

/**
 * Filters bar controller.
 */
angular.module("devicesUiApp")
.controller("FiltersbarCtrl", ["searchservice",  
           function (searchservice) {
	
	this.metadata = searchservice.metadata;
	this.removeFilter = searchservice.removeFilter;

}]);