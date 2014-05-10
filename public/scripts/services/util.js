/**
 *
 * Created by L on 14-5-10.
 */
'use strict';
angular.module('L.component.common')
	.factory('util',[ function () {
		return {
			'setPath': setPath
			,'getPathArr':getPathArray
		};
		function getPathArray(path){
			path = path.split('#')[1];
			path = path.split('/');
			path.splice(0,1)
			return path;
		}
		//设置全局的浏览器的path.
		//path #号后的值。
		//newpath,要插入的新值。
		//level.要插入的位置。
		//eg:path:/service/bus   newpath: weather,  level:1
		//return /service/weather
		function setPath(path,newPath, level){
			var path = path.split('/');
			path.splice(0,1);
			path[level-1] = newPath;
			return '/'+path.slice(0,level).join('/');
		}

	}]);
