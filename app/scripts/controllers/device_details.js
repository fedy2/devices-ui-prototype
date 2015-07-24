'use strict';

angular.module("devicesUiApp")
.controller("DeviceDetailsCtrl", ["$route", "$log", "selectionservice", "searchservice", "device", 
           function ($route, $log, selectionservice, searchservice, device) {
	
	var self = this;
	this.device = device;
	
	this.attribute = null;
	this.nameField = "";
	this.valueField = "";
	  
	this.editAttribute = function(attribute) {
		self.attribute = attribute;
		self.nameField = attribute.name;
		self.valueField = attribute.value;		
		$('#editAttributeModal').modal();
	};
	  
	this.editNewAttribute = function() {
		self.attribute = null;
		self.nameField = "";
		self.valueField = "";
		$('#editAttributeModal').modal();
	};
	
	this.saveAttribute = function() {
		if (self.attribute!=null) {
			self.attribute.name = self.nameField;
			self.attribute.value = self.valueField;
		} else {
			self.device.attributes.push({name:self.nameField, value:self.valueField});
		}
		$('#editAttributeModal').modal('hide');
	};
	
	this.removeAttribute = function(attribute) {
		self.attribute = attribute;
		$('#removeAttributeModal').modal();
	};
	
	this.deleteAttribute = function() {
		var index = device.attributes.indexOf(self.attribute);
		$log.info("index: "+index);
		if (index>=0) device.attributes.splice(index, 1);
		$('#removeAttributeModal').modal('hide');
	};
}]);