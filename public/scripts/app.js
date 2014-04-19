'use strict';

angular.module('L.component.common',[]);
angular.module('L.component',[
	'L.component.common'
])

angular.module('easyApp', [
	'L.component',
    'highcharts-ng',
	'ui.bootstrap',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/weather', {
            templateUrl: 'views/weather',
            controller: 'WeatherCtrl'
        })
        .when('/zhibo', {
            templateUrl: 'views/zhibo',
            controller: 'ZhiboCtrl'
        })
        .when('/bus', {
            templateUrl: 'views/bus',
            controller: 'BusCtrl'
        })
        .when('/train', {
            templateUrl: 'views/train',
            controller: 'TrainCtrl'
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
