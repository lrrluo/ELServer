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
				option: '='
			},
			link: function postLink($scope, element, attrs) {

				var sign = 0
					,clicked	//记录click事件是否由本组件发出。
					,language = Language["main"];

				$scope.title = $scope.option.title? $scope.option.title: '下列框';
				$scope.isShow = false;


				$scope.items = $scope.option ? $scope.option.items: [
					{name:language.cerulean[sign],active:true,skin:language.cerulean[0]},
					{name:language.classic[sign],active:false,skin:language.classic[0]},
					{name:language.slate[sign],active:false,skin:language.slate[0]}
				];

				$scope.click = function(e){
					clicked = true;
					$scope.isShow = !$scope.isShow;
				}

				$scope.switch = function(e,index){
					clicked = true;
					var i;
					$scope.isShow = false;
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
						$scope.$emit("dropdown",{
							name: $scope.option.name,
							param: $scope.items[index]
						});
					}
				}

				$scope.allClick = function(e){
					clicked = true;
				};

				$scope.$on('click',function(e,param){
					if(clicked){
						clicked = false;
						return false;
					}
					var left = element[0].offsetLeft
						,upW= element[0].offsetWidth
						,h  = element[0].offsetHeight
						,top = element[0].offsetTop
						,ul = element.find('div')[1]
						,width = ul.offsetWidth
						,height = h + ul.offsetHeight;
					if(param.pageX  > (left + width) || param.pageX < left || param.pageY < top || param.pageY > (top + height)){
						$scope.isShow = false;
						$scope.$apply();
					}
					else{
						if(param.pageX > (left+ upW) && param.pageY < (top + h)){
							$scope.isShow = false;
							$scope.$apply();
						}
					}
				});

			}
		};
	}]);
