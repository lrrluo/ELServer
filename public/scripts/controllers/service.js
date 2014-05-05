/**
 * Created by Administrator on 14-5-4.
 */
'use strict';

angular.module('easyApp')
	.controller('ServiceCtrl', function ($scope,cookie,Language) {
		var language = Language["service"]
			,sign = 1;
		$scope.option = {
				name: 'serviceTab',
				class:'D-tab',
				items:[
					{name:language.weather[sign],active:true,url:".weather",icon:'icon-home'},
					{name:language.sportLive[sign],active:false,url:".zhibo",icon:'icon-picture'},
					{name:language.bus[sign],active:false,url:".bus",icon:'icon-picture'},
					{name:language.train[sign],active:false,url:".train",icon:'icon-picture'}
					/*                {name:$scope.language.online[sign],active:false,url:"/online"},
					 {name:$scope.language.userManager[sign],active:false,url:"/userManager"},
					 {name:$scope.language.log[sign],active:false,url:"/log"},
					 {name:$scope.language.zone[sign],active:false,url:"/zone"},
					 {name:$scope.language.fileDownLoad[sign],active:false,url:"/fileDownLoad"}*/
				]
			}
	});
