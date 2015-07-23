'use strict';

angular.module("devicesUiApp")
.controller("ToolbarCtrl", ["$log", "selectionservice", "searchservice", 
           function ($log, selectionservice, searchservice) {
	
	var self = this;
	
	this.metadata = searchservice.metadata;
	this.controls = searchservice.controls;
	
	this.moveNextPage = searchservice.nextPage;
	this.movePrevPage = searchservice.prevPage;
	
	this.selection = selectionservice;
	
	this.toggleSelection = function(event) {
		event.stopPropagation();
		if (selectionservice.isPartial() || selectionservice.isAll()) selectionservice.clear();
		else selectionservice.selectPage(searchservice.currentDevices);
	};
}]);