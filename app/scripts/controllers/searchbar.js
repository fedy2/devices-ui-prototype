'use strict';

/**
 * Search bar controller
 */
angular.module("devicesUiApp")
.controller("SearchbarCtrl", ["searchservice", 
           function (searchservice) {
	
	this.metadata = searchservice.metadata;
	
	this.search = function() {
		searchservice.query(searchservice.metadata.userQuery);
	};

}]);