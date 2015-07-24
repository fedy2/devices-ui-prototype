'use strict';

angular.module("devicesUiApp")
.controller("ToolbarCtrl", ["$log", "selectionservice", "searchservice", "routingservice",
           function ($log, selectionservice, searchservice, routingservice) {
	
	var self = this;
	
	this.metadata = searchservice.metadata;
	this.controls = searchservice.controls;
	
	this.moveNextPage = searchservice.nextPage;
	this.movePrevPage = searchservice.prevPage;
	
	this.selection = selectionservice;
	this.routing = routingservice;
	
	this.toggleSelection = function(event) {
		event.stopPropagation();
		if (!selectionservice.isNone()) selectionservice.clear();
		else selectionservice.selectPage(searchservice.currentDevices);
	};
	
	this.goBack = function() {
		routingservice.goDevicesList();
	};
}]);