'use strict';

angular.module("devicesUiApp")
.controller("ToolbarCtrl", ["pagingservice", 
           function (pagingservice) {
	
	this.metadata = pagingservice.metadata;

}]);