'use strict';

angular.module("devicesUiApp")
.controller("ToolbarCtrl", ["$log", "searchservice", 
           function ($log, searchservice) {
	
	this.metadata = searchservice.metadata;
	this.controls = searchservice.controls;
	
	this.moveNextPage = searchservice.nextPage;
	this.movePrevPage = searchservice.prevPage;

}]);