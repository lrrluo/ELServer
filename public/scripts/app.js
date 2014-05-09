'use strict';

angular.module('L.component.common',[]);
angular.module('L.component',[
	'L.component.common'
])

angular.module('easyApp', [
		'L.component',
		'ui.router',
		'highcharts-ng',
		'ui.bootstrap',
		'ngCookies',
		'ngResource',
		'ngSanitize',
		'ngRoute'
	])
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,$urlRouterProvider ) {
		//$routerProvider.otherwise("/service");
		$urlRouterProvider.otherwise('/service');
		$stateProvider
			.state('service', {
				url:'/service',
				templateUrl: 'views/service'
				,controller: 'ServiceCtrl'
			})
			.state('service.weather', {
				url: '/weather',
				templateUrl:'views/weather'
				,controller: 'WeatherCtrl'
			})
			.state('service.zhibo', {
				url: '/zhibo',
				templateUrl:'views/zhibo'
				,controller: 'ZhiboCtrl'
			})
			.state('service.bus', {
				url: '/bus',
				templateUrl: 'views/bus',
				controller: 'BusCtrl'
			})
			.state('service.train', {
				url: '/train',
				templateUrl: 'views/train',
				controller: 'TrainCtrl'
			})
	}]);
