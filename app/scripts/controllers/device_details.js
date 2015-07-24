'use strict';

angular.module("devicesUiApp")
.controller("DeviceDetailsCtrl", ["$route", "$log", "selectionservice", "searchservice", "device", 
           function ($route, $log, selectionservice, searchservice, device) {
	
	  this.device = device;
}]);