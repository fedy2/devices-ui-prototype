'use strict';

angular.module("devices", ["services"])
.controller("DeviceListCtrl", ["devicesservice",
           function (devicesservice) {
	  var self = this;
	  this.devices = devicesservice.list;

}]);