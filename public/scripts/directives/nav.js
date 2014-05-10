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

				var sign = 1
					,language = Language["main"];

				$scope.items = $scope.option ? $scope.option.items:[
					{name:language.index[sign],active:true}
					,{name:language.login[sign],active:false}
					,{name:language.advice[sign],active:false}
					,{name:language.aboutMe[sign],active:false}
				];
				$scope.cls = $scope.option.class;

				//$scope.jump = function(url,index){
				//    var i;
				//    for(i = 0; i<$scope.headers.length; i++){
				//        $scope.headers[i].active = false;
				//    }
				//    $scope.headers[index].active = true;
				//    $location.path($scope.headers[index].url);
				//}

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
						,path = routePath.split('#')[1];
					path = path.split('/');
					path.splice(0,1)
					path = path[$scope.option.routeLevel-1];
					for(i; i < $scope.items.length ; i++){
						$scope.items[i].active = false;
						if(path == $scope.items[i].url){
							console.log(path,$scope.items[i].url);
							$scope.items[i].active = true;
						}
					}
				})

			}
		};
	}])
