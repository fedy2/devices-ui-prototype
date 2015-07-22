'use strict';

/**
 * @ngdoc overview
 * @name devicesUiApp
 * @description
 * # devicesUiApp
 *
 * Main module of the application.
 */
angular
  .module('devicesUiApp', [
    'devices',                           
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/devices', {
        templateUrl: 'views/device_list.html',
        controller: 'DeviceListCtrl',
        controllerAs: 'ctrl',
        resolve: {
        	devicesBatch : function($route, devicesservice) {
        		var start = parseInt($route.current.params.start) || 0;
        		var len = parseInt($route.current.params.len) || 10;
        		return devicesservice.list(start, len, $route.current.params.query);
        	},
        	params: function($route) {
        		return $route.params;
        	}
        }
      })
      .when('/devices/:id', {
        templateUrl: 'views/device_details.html',
        controller: 'DeviceDetails',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/devices'
      });
  })
  .config(function ($locationProvider) {
	  $locationProvider.html5Mode(true);
  });
