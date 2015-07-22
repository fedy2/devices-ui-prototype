'use strict';

angular.module("devicesUiApp")
.controller("SearchbarCtrl", ["$log", "pagingservice", 
           function ($log, pagingservice) {
	
	this.query = "";
	
	this.search = function() {
		$log.info('search', this.query);
		pagingservice.query(this.query);
	};

}]);