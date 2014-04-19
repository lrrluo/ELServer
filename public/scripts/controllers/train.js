/**
 * Created by L on 14-4-2.
 */
'use strict';

angular.module('easyApp')
    .controller('TrainCtrl',
        ['$scope','cookie','Language','$http','stationName', function ($scope,cookie,Language,$http,$stationName) {
            var i,
	            timeVal = -1,
	            count = 20,//可以查询的天数
	            today = new moment();

	        //console.log()
	        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


            $scope.loading  = false;
	        $scope.option ={};
            var tvData = [], commonLang = Language["common"],language = Language["train"];

	        var timeMap = [
	        '当天到达','次日到达','后天到达','大后天到达'
	        ]


            function init(sign){
                $scope.title = language.title[sign];
	            $scope.startCity = language.sCity[sign];
	            $scope.endCity = language.eCity[sign];
	            $scope.search = commonLang.sear[sign];
	            $scope.buyTicket = language.buyTick[sign];
                $scope.option['headers'] = [
                    {type:0,colName: language.no[sign],name:'station_train_code'},
                    {type:0,colName: language.route[sign],name:'route'},
                    {type:0,colName: language.time[sign],name:'time'},
                    {type:0,colName: language.duration[sign],name:'lishi'},
                    {type:0,colName: language.buss[sign],name:'swz_num'},
                    {type:0,colName: language.spec[sign],name:'tz_num'},
                    {type:0,colName: language.firstClass[sign],name:'zy_num'},
                    {type:0,colName: language.secondClass[sign],name:'ze_num'},
                    {type:0,colName: language.highClass[sign],name:'gr_num'},
                    {type:0,colName: language.softBed[sign],name:'rw_num'},
                    {type:0,colName: language.hardBed[sign],name:'yw_num'},
                    {type:0,colName: language.softSit[sign],name:'rz_num'},
                    {type:0,colName: language.hardSit[sign],name:'yz_num'},
                    {type:0,colName: language.noSit[sign],name:'wz_num'}
                ];
            }
            $scope.buttons = [];

            for(i = 0; i < count;i++){
                $scope.buttons.push({"active":false,"name": today.format("MM-DD ddd"),"value":i});
                today.add('days',1);
            }
	        $scope.selectTime = function(val){
		        for(var i =0 ;i<count ; i++){
			        $scope.buttons[i].active = false;
		        }
		        $scope.buttons[val].active = true;

		        timeVal = val;
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

	        $scope.getTrain = function(){
		        var i,tem,
			        time = new moment();
		        if(!$scope.sCity || !$scope.eCity){
			        alert(language.des_error[cookie.getLang()]);
		        }
		        else if(timeVal == -1){
			        alert(language.time_error[cookie.getLang()]);
		        }
		        else {
			        time = time.add('days',timeVal).format('YYYY-MM-DD');
			        $scope.loading  = true;
			        $http.get('/service/trainLine?date='+time+'&from='+$scope.sCity+'&end='+$scope.eCity).success(function(data){
				        if(!data.message){
					        for(i = 0; i < data.length;i++){
						        tem = data[i];
						        tem.time = tem.start_time + '--' + tem.arrive_time;
						        tem.route = tem.start_station_name + '--'+ tem.end_station_name;
						        tem.lishi += ','+timeMap[tem.day_difference];
							    //tem.lishi.slice(0,2)+'小时'+tem.lishi.slice(3,5)+'分钟' + ','+
					        }
					        $scope.option.data = data;
				        }
					    else    alert(data.message);
				        console.log(data);
				        $scope.loading  = false;
			        }).error(function(){
					        $scope.loading  = false;
				        })
		        }
	        }

            $scope.$on('switchLang',function(e,index){
                init(cookie.getLang());
            });

        }])
