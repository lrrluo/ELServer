/**
 *
 * Created by L on 14-3-19.
 */
'use strict';

angular.module('easyApp')
    .controller('ZhiboCtrl',
        ['$scope','cookie','Language','$http', function ($scope,cookie,Language,$http) {
            var i, today = new moment();

            $scope.loading  = false;
            $scope.option = {};
            var tvData = [], time =0 ,language = Language["zhibo"];


            time = parseInt(today.format('HH'),10);
            if( time<= 8){
               time = 0;
            }
            else if(time >8 && time <= 17){
                time = 1;
            }
            else time = 2;

            function init(sign){
                $scope.title = language.title[sign];
                $scope.option['headers'] = [
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

            for(i = 0; i < 10;i++){
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

            init(cookie.getLang());
            $scope.getZhibo(0);

            $scope.showTime = function(val){
                time = val;
                $scope.data = tvData[val];
                $scope.option.data = tvData[val];

                for(var i =0;i<3 ;i++){
                    $scope.dayButtons[i].active = false;
                }
                $scope.dayButtons[val].active = true;
            }


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
                /*var j = 0,temp = [];

                for(i = 0; i< 3; i++){
                    while(tvData[i].length > 0){
                        temp[j++] = tvData[i].splice(0,2);
                    }
                    tvData[i] = temp;
                    j = 0;
                }*/
            }
        }])
