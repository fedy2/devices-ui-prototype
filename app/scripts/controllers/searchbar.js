'use strict';

angular.module("devicesUiApp")
.controller("SearchbarCtrl", ["$log", "searchservice", 
           function ($log, searchservice) {
	
	this.metadata = searchservice.metadata;
	
	this.search = function() {
		$log.info('search', this.query);
		searchservice.query(this.query);
	};

}]);