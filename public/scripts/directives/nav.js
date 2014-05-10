/**
 * Created by L on 14-4-22.
 */
'use strict';

angular.module('L.component.common')
	.directive('nav',['$http','cookie','Language','$location', 'util',function ($http,$cookie,Language, $location, util) {
		return {
			templateUrl:"/views/nav",
			restrict: 'AE',
			scope:{
				option: '='
			},
			link: function postLink($scope, element, attrs) {

				var sign = 1;

				$scope.items = $scope.option.items
				$scope.cls = $scope.option.class;


				$scope.switch = function(index,url){
					var path
						,i;
					if($scope.items[index].active){
						return false;
					}
					else{
						path = $location.path();
						$location.path(util.setPath(path, url, $scope.option.routeLevel));
						for(i = 0; i<$scope.items.length; i++){
							$scope.items[i].active = false;
						}
						$scope.items[index].active = true;
						$scope.$emit("menu",{
							name: $scope.option.name
							,param: $scope.items[index]
						});
					}
				}

				$scope.$on("updateRoute",function(e,routePath){
					var i = 0
						,path;
					path = util.getPathArr(routePath)[$scope.option.routeLevel-1];
					for(i; i < $scope.items.length ; i++){
						$scope.items[i].active = false;
						if(path == $scope.items[i].url){
							console.log(path,$scope.items[i].url);
							$scope.items[i].active = true;
						}
					}
					$scope.$apply();
				})

			}
		};
	}])
