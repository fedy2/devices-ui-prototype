'use strict';

angular.module("devicesUiApp")
.controller("SearchbarCtrl", ["$log", "searchservice", 
           function ($log, searchservice) {
	
	this.metadata = searchservice.metadata;
	
	this.search = function() {
		$log.info('search button pressed', searchservice.metadata.userQuery);
		searchservice.query(searchservice.metadata.userQuery);
	};

}]);