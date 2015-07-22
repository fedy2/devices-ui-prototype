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
      .when('/projects/:projectId/devices', {
        templateUrl: 'views/device_list.html',
        controller: 'DeviceListCtrl',
        controllerAs: 'ctrl',
        reloadOnSearch: true,
        resolve: {
        	devicesBatch : function($route, devicesservice, pagingConstants) {
        		var start = parseInt($route.current.params[pagingConstants.startParam]) || 0;
        		var len = parseInt($route.current.params[pagingConstants.lenParam]) || pagingConstants.pageSize;
        		return devicesservice.list(start, len, $route.current.params.query);
        	}
        }
      })
      .when('/projects/:projectId/devices/:deviceId', {
        templateUrl: 'views/device_details.html',
        controller: 'DeviceDetails',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/projects/demo/devices'
      });
  })
  .config(function ($locationProvider) {
	  $locationProvider.html5Mode(true);
  });
