/**
 *
 * Created by L on 14-4-19.
 */
'use strict';

angular.module('L.component.common')
	.directive('narbar',['$http',function ($http) {
		return {
			templateUrl:"/views/narbar",
			restrict: 'AE',
			scope:{
				option: '='
			},
			link: function postLink($scope, element, attrs) {

			}
		};
	}])
