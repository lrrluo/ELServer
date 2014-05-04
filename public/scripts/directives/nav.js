/**
 * Created by L on 14-4-22.
 */
'use strict';

angular.module('L.component.common')
	.directive('nav',['$http','cookie','Language',function ($http,$cookie,Language) {
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


				$scope.switch = function(index){
					var i;
					if($scope.items[index].active){
						return false;
					}
					else{
						for(i = 0; i<$scope.items.length; i++){
							$scope.items[i].active = false;
						}
						$scope.items[index].active = true;
						//cookie.setLang(index);
						//init(cookie.getLang());
						$scope.$emit("menu",{
							name: $scope.option.name
							,param: $scope.items[index]
						});
					}
				}

			}
		};
	}])
