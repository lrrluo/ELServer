/**
 *
 * Created by L on 14-3-19.
 */
'use strict';

angular.module('easyApp')
    .controller('ZhiboCtrl',
        ['$scope','$location','cookie','Language','$http', function ($scope,$location,cookie,Language,$http) {
            var i, today = new moment();

            $scope.loading  = false;
            var tvData = [], time =0 ,language = Language["zhibo"];
            function init(sign){
                $scope.title = language.title[sign];
                $scope.headers = [
                    {colName: language.time[sign],name:'time'},
                    {colName: language.content[sign],name:'content'}
                ];
                $scope.dayButtons[0].name = language.ls[sign];
                $scope.dayButtons[1].name = language.day[sign];
                $scope.dayButtons[2].name = language.night[sign];
            }
            $scope.buttons = [];
            $scope.dayButtons = [
                {name: language.ls[cookie.getLang()],value: 0,active: true},
                {name: language.day[cookie.getLang()],value: 1,active: false},
                {name: language.night[cookie.getLang()],value: 2,active: false}
            ];

            for(i = 0; i < 7;i++){
                $scope.buttons.push({"active":false,"name": today.format("MM-DD ddd"),"value":i});
                today.add('days',1);
            }
            //today = new moment();

            $scope.getZhibo = function(val){
                var i;
                $scope.loading  = true;
                $http.get('/service/sportlive?value='+val).success(function(data){
                    //$scope.
                    //$scope.data = data.content;
                    parseTime(data.content);
                    console.log(data);
                    $scope.loading  = false;
                    for(i =0 ;i<7 ; i++){
                        $scope.buttons[i].active = false;
                    }
                    $scope.buttons[val].active = true;
                    $scope.showTime(time);
                }).error(function(){
                        $scope.loading  = false;
                    })
            }

            $scope.getZhibo(0);

            $scope.showTime = function(val){
                time = val;
                $scope.data = tvData[val];
                console.log(tvData);
                for(var i =0;i<3 ;i++){
                    $scope.dayButtons[i].active = false;
                }
                $scope.dayButtons[val].active = true;
            }

            init(cookie.getLang());

            $scope.$on('switchLang',function(e,index){
                init(cookie.getLang());
            });

            function parseTime(data){
                var i = 0,t;
                tvData = [[],[],[]];
                for(i;i<data.length; i++){
                    t = parseInt(data[i].time.split(':')[0],10);
                    if(t< 8){
                        tvData[0].push(data[i]);
                    }
                    else if(t >=8 && t<=17){
                        tvData[1].push(data[i]);
                    }
                    else {
                        tvData[2].push(data[i]);
                    }
                }
            }
        }])
