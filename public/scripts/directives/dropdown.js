/**
 * Created by L on 14-4-19.
 */
'use strict';

angular.module('L.component.common')
	.directive('dropdown',['$http','cookie','Language',function ($http,$cookie,Language) {
		return {
			templateUrl:"/views/dropdown",
			restrict: 'AE',
			scope:{
				//option: '='
			},
			link: function postLink($scope, element, attrs) {

				var sign = 0
					,language = Language["main"];

				$scope.isShow = false;

				$scope.icon = 'fa-bell';
				$scope.name = '切换茳江'


				$scope.items = [
					{name:language.cerulean[sign],active:true,skin:language.cerulean[0]},
					{name:language.classic[sign],active:false,skin:language.classic[0]},
					{name:language.slate[sign],active:false,skin:language.slate[0]}
				];

				$scope.click = function(e){
					e.stopPropagation();
					$scope.isShow = true;
				}

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
						//$scope.$broadcast("switchLang",index);
					}
				}

			}
		};
	}])
