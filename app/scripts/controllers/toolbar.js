'use strict';

angular.module("devicesUiApp")
.controller("ToolbarCtrl", ["$log", "pagingservice", 
           function ($log, pagingservice) {
	
	this.metadata = pagingservice.metadata;
	this.controls = pagingservice.controls;
	
	this.moveNextPage = pagingservice.nextPage;
	this.movePrevPage = pagingservice.prevPage;

}]);