/**
 * Created by L on 14-5-10.
 */

'use strict';

angular.module('L.component.common')
	.directive('breadcrumb',['$http','cookie','Language','$location', 'util',function ($http,$cookie,Language, $location, util) {
		return {
			templateUrl:"/views/breadcrumb",
			restrict: 'AE',
			scope:{
				option: '='
			},
			link: function postLink($scope, element, attrs) {

				var sign = 1
					,path
					,language = Language["main"];

				$scope.switch = function(index){
					var nowpath = $location.path();
					$location.path(util.setPath(nowpath, path[index], index+1));
				};

				function updateBread(){
					var i = 0
						,o
						,items = [];
					for(i; i < path.length ; i++){
						for(o in Language){
							if(Language[o][path[i]]){
								items.push(Language[o][path[i]][sign]);
								break;
							}
						}
					}
					$scope.items = items;
				}

				$scope.$on("updateRoute",function(e,routePath){
					path = util.getPathArr(routePath);
					updateBread();
					$scope.$apply();
				});
				$scope.$on("$locationChangeSuccess",function(e,routePath){
					path = util.getPathArr(routePath);
					updateBread();
				});

			}
		};
	}])