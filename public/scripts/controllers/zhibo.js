/**
 *
 * Created by L on 14-3-19.
 */
'use strict';

angular.module('easyApp')
    .controller('ZhiboCtrl',
        ['$scope','$location','cookie','Language','$http', function ($scope,$location,cookie,Language,$http) {

            $scope.language = Language["zhibo"];
            function init(sign){
                $scope.title = $scope.language.title[sign];
                $scope.headers = [
                    {colName: $scope.language.time[sign],name:'time'},
                    {colName: $scope.language.content[sign],name:'content'}
                ]
            }
            $http.get('/service/sportlive').success(function(data){
                //$scope.
                $scope.data = data.content;
                console.log(data);
            })


            init(cookie.getLang());

            $scope.$on('switchLang',function(e,index){
                init(cookie.getLang());
            });
        }])
