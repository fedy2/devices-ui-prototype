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
      .when('/', {
        templateUrl: 'views/device_list.html',
        controller: 'DeviceListCtrl',
        controllerAs: 'ctrl'
      })
      .when('/device/:id', {
        templateUrl: 'views/device_details.html',
        controller: 'DeviceDetails',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
