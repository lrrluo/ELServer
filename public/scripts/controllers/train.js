/**
 * Created by L on 14-4-2.
 */
'use strict';

angular.module('easyApp')
    .controller('TrainCtrl',
        ['$scope','cookie','Language','$http', function ($scope,cookie,Language,$http) {
            var i, today = new moment();

            $scope.loading  = false;
	        $scope.option ={};
            var tvData = [], commonLang = Language["common"],language = Language["train"];


            function init(sign){
                $scope.title = language.title[sign];
	            $scope.startCity = language.sCity[sign];
	            $scope.endCity = language.eCity[sign];
	            $scope.search = commonLang.sear[sign];
                $scope.option['headers'] = [
                    {colName: language.no[sign],name:'no'},
                    {colName: language.route[sign],name:'route'},
                    {colName: language.time[sign],name:'time'},
                    {colName: language.duration[sign],name:'duration'},
                    {colName: language.buss[sign],name:'buss'},
                    {colName: language.spec[sign],name:'spec'},
                    {colName: language.firstClass[sign],name:'firstClass'},
                    {colName: language.secondClass[sign],name:'secondClass'},
                    {colName: language.highClass[sign],name:'highClass'},
                    {colName: language.softBed[sign],name:'softBed'},
                    {colName: language.hardBed[sign],name:'hardBed'},
                    {colName: language.softSit[sign],name:'softSit'},
                    {colName: language.hardSit[sign],name:'hardSit'},
                    {colName: language.noSit[sign],name:'noSit'},
                    {colName: language.other[sign],name:'other'},
                    {colName: language.remark[sign],name:'remark'}
                ];
            }
            $scope.buttons = [];

            for(i = 0; i < 20;i++){
                $scope.buttons.push({"active":false,"name": today.format("MM-DD ddd"),"value":i});
                today.add('days',1);
            }
	        $scope.selectTime = function(val){
		        for(var i =0 ;i<7 ; i++){
			        $scope.buttons[i].active = false;
		        }
		        $scope.buttons[val].active = true;
	        }

            $scope.getZhibo = function(val){
	            var i;
                $scope.loading  = true;
                $http.get('/service/sportlive?value='+val).success(function(data){
                    //$scope.
                    //$scope.data = data.content;
                    console.log(data);
                    $scope.loading  = false;
                    $scope.showTime(time);
                }).error(function(){
                        $scope.loading  = false;
                    })
            }

            init(cookie.getLang());
            //$scope.getZhibo(0);

            $scope.showTime = function(val){
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

        }])
