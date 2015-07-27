'use strict';

/**
 * Application resources.
 */
var resources = angular.module("resources", ["ngResource"]);

resources.factory("devicesresource", ["$resource", function($resource) {
	return $resource("data_small.json", null, {
		query: {method: "GET", cache: true, isArray:true}
	});
}]);