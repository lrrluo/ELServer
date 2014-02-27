'use strict';

angular.module('corsNgApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/weather', {
            templateUrl: 'views/weather.html',
            controller: 'WeatherCtrl'
        })
        .when('/mapView', {
            templateUrl: 'views/mapview.html',
            controller: 'MapviewCtrl'
        })
        .when('/online', {
            templateUrl: 'views/online.html',
            controller: 'OnlineCtrl'
        })
        .when('/log', {
            templateUrl: 'views/log.html',
            controller: 'LogCtrl'
        })
        .when('/fileDownLoad', {
            templateUrl: 'views/filedownLoad.html',
            controller: 'FiledownloadCtrl'
        })
        .when('/zone', {
            templateUrl: 'views/zone.html',
            controller: 'ZoneCtrl'
        })
        .when('/zone/add/:id', {
            templateUrl: 'views/addzone.html',
            controller: 'AddzoneCtrl'
        })
        .when('/userManager', {
            templateUrl: 'views/usermanager.html',
            controller: 'UsermanagerCtrl'
        })
        .when('/userManager/add/:id', {
            templateUrl: 'views/addUser.html',
            controller: 'AdduserCtrl'
        })
        .when('/', {
            templateUrl: 'test.html',
            controller: 'TestCtrl'
        })
      .otherwise({
        redirectTo: '/mapView'
      });
  }]);
