'use strict';

angular.module('L.component.common',[]);
angular.module('L.component',[
	'L.component.common'
])

angular.module('easyApp', [
		'L.component',
		'ui.router',
		'highcharts-ng',
		'ui.bootstrap',
		'ngCookies',
		'ngResource',
		'ngSanitize',
		'ngRoute'
	])
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,$urlRouterProvider ) {
		//$routerProvider.otherwise("/service");
		$urlRouterProvider.otherwise('/service');
		$stateProvider
			.state('service', {
				url:'/service',
				templateUrl: 'views/service'
				,controller: 'ServiceCtrl'
			})
			.state('service.weather', {
				url: '/weather',
				templateUrl:'views/weather'
				,controller: 'WeatherCtrl'
			})
			.state('service.zhibo', {
				url: '/zhibo',
				templateUrl:'views/zhibo'
				,controller: 'ZhiboCtrl'
			})
			.state('service.bus', {
				url: '/bus',
				templateUrl: 'views/bus',
				controller: 'BusCtrl'
			})
			.state('service.train', {
				url: '/train',
				templateUrl: 'views/train',
				controller: 'TrainCtrl'
			})
	}]);
;'use strict';

angular.module('easyApp')
    .controller('BusCtrl',
        ['$scope','$location','cookie','Language', '$http', function ($scope, $location, cookie, Language, $http) {




            var language = Language["bus"],
                commonLang = Language['common'],
                busData,route,
                routeMap = ['upRoute','downRoute'];
            $scope.route = 0;
            route = routeMap[$scope.route];
            $scope.loading  = false;

            $scope.chartConfig = {};
            function init(sign){
                $scope.title = language.title[sign];
                $scope.search_T = commonLang.sear[sign];
                $scope.phBusName = language.placeholderBus[sign];
            }

            init(cookie.getLang());


            $scope.switchRoute = function(){
                route = routeMap[$scope.route];
                setChar(busData);
            }

            function setChar(data){
                var i, routeData, obj = {name:'', data:[]};
                if(!data){
                    return false;
                }
                $scope.loading  = true;
                $scope.chartConfig ={
                    options:{
                        chart:{
                            type : 'column'
                        },
                        xAxis: {
                            categories: []
                        },
                        yAxis: {
                            tickInterval : 1,
                            title: {
                                text: language.busNumber[cookie.getLang()]
                            }
                        },
                        legend: {
                            enabled: false
                        }
                    },
                    series: {},
                    title: {
                        text: data[route].name
                    },
                    subtitle: {
                        text: ''
                    },
                    credits: {
                        enabled: true
                    },
                    loading: false
                }
                obj.name = language.busNumber[cookie.getLang()];
                routeData = data[route]['route'];
                for(i = 0; i < routeData.length; i++){
                    obj.data.push(+ routeData[i].hasBus);
                    $scope.chartConfig.options.xAxis.categories.push(routeData[i].stopName);
                }
                $scope.chartConfig.series = [obj];
                $scope.chartConfig.subtitle = language.totalStop[cookie.getLang()]+ routeData.length;
                console.log($scope.chartConfig);
                $scope.loading  = false;
            }

            $scope.getBus = function(bus){
                var i, routeData, obj = {name:'', data:[]};
                if(!bus){
                    return false;
                }
                $scope.loading  = true;
                $http.get('/service/GDbus?bus='+bus).success(function(data){
                    console.log(data);
                    if(data.error){
                        alert(language.errorBus[cookie.getLang()]);
                        $scope.loading  = false;
                        return false;
                    }
                    busData = data;
                    setChar(data);
                }).error(function(){
                        $scope.loading  = false;
                    })

            }

            $scope.$on('switchLang',function(e,index){
                init(cookie.getLang());
            });

    }])
;'use strict';

angular.module('easyApp')
  .controller('MainCtrl', ['$scope','$location','cookie','Language', '$document', function ($scope,$location,cookie,Language,$document) {

        var language = Language["main"]
			,sign = 1;

		$scope.option = {
			menu:{
				'routeLevel':1,
				name: 'topMenu',
				class:'D-nav',
				items:[
					 {url:'service',name:language.service[sign],active:true}
					,{url:'login',name:language.login[sign],active:false}
					,{url:'advice',name:language.advice[sign],active:false}
					,{url:'about',name:language.aboutMe[sign],active:false}
				]

			},
			dropdown: [
				{
					name:'theme',
					title: language.theme[sign],
					items:[
						{name:language.cerulean[sign],active:true,skin:language.cerulean[0]},
						{name:language.classic[sign],active:false,skin:language.classic[0]},
						{name:language.slate[sign],active:false,skin:language.slate[0]}
					]
				},
				{
					name: 'lang',
					title: language.langTitle[sign],
					items: [
						{name:language.en[sign],active:true},
						{name:language.ch[sign],active:false}
					]
				}
			]
		};

        function init(sign){
            var i, path, findUrl = false;
            $scope.langtitle = $scope.language.langTitle[sign];
            $scope.function = $scope.language.func[sign];
            $scope.theme = $scope.language.theme[sign];

            $scope.themes = [
                {name:$scope.language.cerulean[sign],active:false,skin:$scope.language.cerulean[0]},
                {name:$scope.language.classic[sign],active:false,skin:$scope.language.classic[0]},
                {name:$scope.language.slate[sign],active:false,skin:$scope.language.slate[0]}
            ];

            $scope.langs = [
                {name:$scope.language.en[sign],active:false},
                {name:$scope.language.ch[sign],active:false}
            ];



            $scope.langs[sign].active = true;
            $scope.themes[cookie.getTheme()].active = true;
            $scope.skin = $scope.themes[cookie.getTheme()].skin.toLowerCase(); //+'.css';


            $scope.headers = [
                {name:$scope.language.weather[sign],active:true,url:"/weather",icon:'icon-home'},
                {name:$scope.language.sportLive[sign],active:false,url:"/zhibo",icon:'icon-picture'},
                {name:$scope.language.bus[sign],active:false,url:"/bus",icon:'icon-picture'},
                {name:$scope.language.train[sign],active:false,url:"/train",icon:'icon-picture'}
/*                {name:$scope.language.online[sign],active:false,url:"/online"},
                {name:$scope.language.userManager[sign],active:false,url:"/userManager"},
                {name:$scope.language.log[sign],active:false,url:"/log"},
                {name:$scope.language.zone[sign],active:false,url:"/zone"},
                {name:$scope.language.fileDownLoad[sign],active:false,url:"/fileDownLoad"}*/
            ]

        }

        //init(0);


        //$scope.switchTheme = function(index){
        //    var i;
        //    if($scope.themes[index].active){
        //        return false;
        //    }
        //    else{
        //        for(i = 0; i<$scope.themes.length; i++){
        //            $scope.themes[i].active = false;
        //        }
        //        $scope.themes[index].active = true;
        //        $scope.skin = $scope.themes[index].skin.toLowerCase(); //+'.css';
        //        cookie.setTheme(index);
        //    }
        //}


		$scope.$on('dropdown',function(e, p){
			console.log(e,p);
			switch (p.name){
				case 'lang':
					console.log(p.param);
					break;
				case 'theme':
					console.log(p.param);
					break;
			}
		});

		$scope.$on('menu',function(e, p){
			console.log(e,p);
			switch (p.name){
				case 'topMenu':
					console.log(p.param);
					break;
			}
		});


		// 全局 click 事件，body
		$document.on('click', function(e){
			$scope.$broadcast('click',e);
		});
		$scope.$on("$locationChangeSuccess",function(e,newpath,old){
			//第一次加载时，更新tab值。
			if(newpath == old){
				setTimeout(function(){
					$scope.$broadcast('updateRoute',newpath);
				},700);
			}
			else{
				$scope.$broadcast('updateRoute',newpath);
			}

		})


  }]);
;'use strict';

angular.module('easyApp')
	.controller('ServiceCtrl',['$scope','cookie','Language', function ($scope,cookie,Language) {
		var language = Language["service"]
			,sign = 1;
		$scope.option = {
				'routeLevel':2,
				name: 'serviceTab',
				class:'D-tab',
				items:[
					{name:language.weather[sign],active:true,url:"weather",icon:'icon-home'},
					{name:language.zhibo[sign],active:false,url:"zhibo",icon:'icon-picture'},
					{name:language.bus[sign],active:false,url:"bus",icon:'icon-picture'},
					{name:language.train[sign],active:false,url:"train",icon:'icon-picture'}
					/*                {name:$scope.language.online[sign],active:false,url:"/online"},
					 {name:$scope.language.userManager[sign],active:false,url:"/userManager"},
					 {name:$scope.language.log[sign],active:false,url:"/log"},
					 {name:$scope.language.zone[sign],active:false,url:"/zone"},
					 {name:$scope.language.fileDownLoad[sign],active:false,url:"/fileDownLoad"}*/
				]
			}
	}]);
;'use strict';

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
;'use strict';

angular.module('easyApp')
    .controller('WeatherCtrl',
        ['$scope','$location','cookie','Language', '$http', function ($scope, $location, cookie, Language, $http) {

            //get the local city by baiduMap api and get the local weather
			$scope.title = 'weather';
			var saveCity;
            setTimeout(function(){
                var myCity = new BMap.LocalCity();
                myCity.get(function(resutl){
                    var city = new String(resutl.name);
                    console.log(city)
                    city = city.replace(/市/,'');
                    console.log(city);
					$scope.city = city;
                    $scope.getWeather(city);
                });
            },0)
            $scope.loading  = false;
            var language = Language["weather"];
            var commonLang = Language['common'];
            function init(sign){
                $scope.title = language.title[sign];
                $scope.cityName = language.cityName[sign] ;
                $scope.search_T = commonLang.sear[sign];
				$scope.flesh_T = commonLang.reflesh[sign];
                $scope.phCityName = language.placeholderCity[sign];
            }

            //init(cookie.getLang());
			init(1);

            function chartSeries(data) {
                var ret = [];
                if(!data){
                    return [{"name": "", "data": []},{"name": "", "data": []}]
                }
                else{
                    ret[0] = {
						//name: language.lowTem[cookie.getLang()],
						name: language.lowTem[1],
                        data: [
                            +data[5].split('\/')[0].match(/\d+/)[0],
                            +data[12].split('\/')[0].match(/\d+/)[0],
                            +data[17].split('\/')[0].match(/\d+/)[0]
                        ]
                    }
                    ret[1] = {
                        //name: language.highTem[cookie.getLang()],
						name: language.highTem[1],
                        data: [
                            +data[5].split('\/')[1].match(/\d+/)[0],
                            +data[12].split('\/')[1].match(/\d+/)[0],
                            +data[17].split('\/')[1].match(/\d+/)[0]
                        ]
                    }
                    return ret;
                }
            }


			$scope.reflesh = function(){
				if(saveCity){
					$scope.getWeather(saveCity);
				}
				return false;
			};

            $scope.getWeather = function(city){
                if(city){
                    $scope.loading  = true;
                    if($scope.charConfig){
                        $scope.charConfig.loading = true;
                    }
                    $http.get('/service/weather?city='+city).success(function(data){
                        console.log(data);
                        if(!data[1]){
                            //alert(language.errorCity[cookie.getLang()]);
							alert(language.errorCity[1]);
                            $scope.city = "";
                            $scope.loading  = false;
                            return false;
                        }
						saveCity = city;
                        $scope.chartConfig = {
                            options : {
                                chart:{
                                    type: 'spline'
                                },
                            xAxis: {
                                categories: []
                            },
                            yAxis: {
                                title: {
                                    text: 'Temperature'
                                },
                                labels: {
                                    formatter: function() {
                                        return this.value +'°'
                                    }
                                }
                            },
                                tooltip: {
                                    crosshairs: true,
                                    shared: true
                                },
                            plotOptions: {
                                spline: {
                                    marker: {
                                        radius: 4,
                                        lineColor: '#666666',
                                        lineWidth: 1
                                    }
                                }
                            }
                        },

                        series: chartSeries(data),

                            title: {
                            text: 'Monthly Average Temperature'
                        },
                        subtitle: {
                            text: 'Source: WorldClimate.com'
                        },
                        credits: {
                            enabled: true
                        },
                        loading: false
                    }

                    $scope.chartConfig.title.text = data[1] + '近几天的天气概况';
                    $scope.chartConfig.options.xAxis.categories.push(data[6]) ;
                    $scope.chartConfig.options.xAxis.categories.push(data[13]) ;
                    $scope.chartConfig.options.xAxis.categories.push(data[18]) ;
                   // console.log($scope.chartConfig);
                    $scope.loading  = false;
                    //$scope.charConfig.loading = true;
                }).error(function(){
                            $scope.loading  = false;
                        })
            }
            return false;
        }


            $scope.$on('switchLang',function(e,index){
                //init(cookie.getLang());
				init(1);
            });

}])
;'use strict';

angular.module('easyApp')
    .controller('ZhiboCtrl',
        ['$scope','cookie','Language','$http', function ($scope,cookie,Language,$http) {
            var i,count = 11,//查询的天数
	            today = new moment();

            $scope.loading  = false;
            $scope.option = {};
            var tvData = [], time =0 ,language = Language["zhibo"];


            //time = parseInt(today.format('HH'),10);
            //if( time<= 8){
            //   time = 0;
            //}
            //else if(time >8 && time <= 17){
            //    time = 1;
            //}
            //else time = 2;

            function init(sign){
                $scope.title = language.title[sign];
                $scope.option['headers'] = [
                    {type:0,colName: language.time[sign],name:'time'},
                    {type:0,colName: language.content[sign],name:'content'},
	                {type:1,colName: language.address[sign],name:'address'}
                ];

                //$scope.dayButtons[0].name = language.ls[sign];
                //$scope.dayButtons[1].name = language.day[sign];
                //$scope.dayButtons[2].name = language.night[sign];

            }
            $scope.buttons = [];
            //$scope.dayButtons = [
            //    //{name: language.ls[cookie.getLang()],value: 0,active: true},
            //    //{name: language.day[cookie.getLang()],value: 1,active: false},
            //    //{name: language.night[cookie.getLang()],value: 2,active: false}
			//	{name: language.ls[1],value: 0,active: true},
			//	{name: language.day[1],value: 1,active: false},
			//	{name: language.night[1],value: 2,active: false}
            //];

            for(i = 0; i < count;i++){
                $scope.buttons.push({"active":false,"name": today.format("MM-DD ddd"),"value":i});
                today.add('days',1);
            }
            //today = new moment();

            $scope.getZhibo = function(val){
                var i;
                $scope.loading  = true;
                $http.get('/service/sportlive?value='+val).success(function(data){
                    //$scope.
	                //console.log(data.content);
	                $scope.option.data = data.content;
                    //parseTime(data.content);
                    $scope.loading  = false;
                    for(i =0 ;i<count ; i++){
                        $scope.buttons[i].active = false;
                    }
                    $scope.buttons[val].active = true;
                }).error(function(){
                        $scope.loading  = false;
                    })
            }

            //init(cookie.getLang());
			init(1);
            $scope.getZhibo(0);

            //$scope.showTime = function(val){
            //    //time = val;

            //    for(var i =0;i<3 ;i++){
            //        $scope.dayButtons[i].active = false;
            //    }
            //    $scope.dayButtons[val].active = true;
            //}


            $scope.$on('switchLang',function(e,index){
                //init(cookie.getLang());
				init(1);
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
;'use strict';

angular.module('L.component.common')
	.directive('breadcrumb',['$http','cookie','Language','$location', 'util',function ($http,$cookie,Language, $location, util) {
		return {
			templateUrl:"/views/breadcrumb",
			restrict: 'AE',
			scope:{
				option: '='
			},
			link: function postLink($scope, element, attrs) {

				var sign = 1
					,path
					,language = Language["main"];

				$scope.switch = function(index){
					var nowpath = $location.path();
					$location.path(util.setPath(nowpath, path[index], index+1));
				};

				function updateBread(){
					var i = 0
						,o
						,items = [];
					for(i; i < path.length ; i++){
						for(o in Language){
							if(Language[o][path[i]]){
								items.push(Language[o][path[i]][sign]);
								break;
							}
						}
					}
					$scope.items = items;
				}

				$scope.$on("updateRoute",function(e,routePath){
					path = util.getPathArr(routePath);
					updateBread();
					$scope.$apply();
				});
				$scope.$on("$locationChangeSuccess",function(e,routePath){
					path = util.getPathArr(routePath);
					updateBread();
				});

			}
		};
	}]);'use strict';

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
;'use strict';
/*global angular: false, Highcharts: false */

 angular.module('highcharts-ng', [])
    .directive('highchart', function () {

        //IE8 support
        var indexOf = function(arr, find, i /*opt*/) {
            if (i===undefined) i= 0;
            if (i<0) i+= arr.length;
            if (i<0) i= 0;
            for (var n= arr.length; i<n; i++)
                if (i in arr && arr[i]===find)
                    return i;
            return -1;
        };


        function prependMethod(obj, method, func) {
            var original = obj[method];
            obj[method] = function () {
                var args = Array.prototype.slice.call(arguments);
                func.apply(this, args);
                if(original) {
                    return original.apply(this, args);
                }  else {
                    return;
                }

            };
        }

        function deepExtend(destination, source) {
            for (var property in source) {
                if (source[property] && source[property].constructor &&
                    source[property].constructor === Object) {
                    destination[property] = destination[property] || {};
                    deepExtend(destination[property], source[property]);
                } else {
                    destination[property] = source[property];
                }
            }
            return destination;
        }

        // acceptable shared state
        var seriesId = 0;
        var ensureIds = function (series) {
            var changed = false;
            angular.forEach(series, function(s) {
                if (!angular.isDefined(s.id)) {
                    s.id = 'series-' + seriesId++;
                    changed = true;
                }
            });
            return changed;
        };

        // immutable
        var axisNames = [ 'xAxis', 'yAxis' ];

        var getMergedOptions = function (scope, element, config) {
            var mergedOptions = {};

            var defaultOptions = {
                chart: {
                    events: {}
                },
                title: {},
                subtitle: {},
                series: [],
                credits: {},
                plotOptions: {},
                navigator: {enabled: false}
            };

            if (config.options) {
                mergedOptions = deepExtend(defaultOptions, config.options);
            } else {
                mergedOptions = defaultOptions;
            }
            mergedOptions.chart.renderTo = element[0];

            angular.forEach(axisNames, function(axisName) {
                if(angular.isDefined(config[axisName])) {
                    mergedOptions[axisName] = angular.copy(config[axisName]);

                    if(angular.isDefined(config[axisName].currentMin) ||
                        angular.isDefined(config[axisName].currentMax)) {

                        prependMethod(mergedOptions.chart.events, 'selection', function(e){
                            var thisChart = this;
                            if (e[axisName]) {
                                scope.$apply(function () {
                                    scope.config[axisName].currentMin = e[axisName][0].min;
                                    scope.config[axisName].currentMax = e[axisName][0].max;
                                });
                            } else {
                                //handle reset button - zoom out to all
                                scope.$apply(function () {
                                    scope.config[axisName].currentMin = thisChart[axisName][0].dataMin;
                                    scope.config[axisName].currentMax = thisChart[axisName][0].dataMax;
                                });
                            }
                        });

                        prependMethod(mergedOptions.chart.events, 'addSeries', function(e){
                            scope.config[axisName].currentMin = this[axisName][0].min || scope.config[axisName].currentMin;
                            scope.config[axisName].currentMax = this[axisName][0].max || scope.config[axisName].currentMax;
                        });
                    }
                }
            });

            if(config.title) {
                mergedOptions.title = config.title;
            }
            if (config.subtitle) {
                mergedOptions.subtitle = config.subtitle;
            }
            if (config.credits) {
                mergedOptions.credits = config.credits;
            }
            if(config.size) {
                if (config.size.width) {
                    mergedOptions.chart.width = config.size.width;
                }
                if (config.size.height) {
                    mergedOptions.chart.height = config.size.height;
                }
            }
            return mergedOptions;
        };

        var updateZoom = function (axis, modelAxis) {
            var extremes = axis.getExtremes();
            if(modelAxis.currentMin !== extremes.dataMin || modelAxis.currentMax !== extremes.dataMax) {
                axis.setExtremes(modelAxis.currentMin, modelAxis.currentMax, false);
            }
        };

        var processExtremes = function(chart, axis, axisName) {
            if(axis.currentMin || axis.currentMax) {
                chart[axisName][0].setExtremes(axis.currentMin, axis.currentMax, true);
            }
        };

        var chartOptionsWithoutEasyOptions = function (options) {
            return angular.extend({}, options, {data: null, visible: null});
        };

        return {
            restrict: 'EAC',
            replace: true,
            template: '<div></div>',
            scope: {
                config: '='
            },
            link: function (scope, element, attrs) {
                // We keep some chart-specific variables here as a closure
                // instead of storing them on 'scope'.

                // prevSeriesOptions is maintained by processSeries
                var prevSeriesOptions = {};

                var processSeries = function(series) {
                    var ids = [];
                    if(series) {
                        var setIds = ensureIds(series);
                        if(setIds) {
                            //If we have set some ids this will trigger another digest cycle.
                            //In this scenario just return early and let the next cycle take care of changes
                            return false;
                        }

                        //Find series to add or update
                        angular.forEach(series, function(s) {
                            ids.push(s.id);
                            var chartSeries = chart.get(s.id);
                            if (chartSeries) {
                                if (!angular.equals(prevSeriesOptions[s.id], chartOptionsWithoutEasyOptions(s))) {
                                    chartSeries.update(angular.copy(s), false);
                                } else {
                                    if (s.visible !== undefined && chartSeries.visible !== s.visible) {
                                        chartSeries.setVisible(s.visible, false);
                                    }
                                    chartSeries.setData(angular.copy(s.data), false);
                                }
                            } else {
                                chart.addSeries(angular.copy(s), false);
                            }
                            prevSeriesOptions[s.id] = chartOptionsWithoutEasyOptions(s);
                        });
                    }

                    //Now remove any missing series
                    for(var i = chart.series.length - 1; i >= 0; i--) {
                        var s = chart.series[i];
                        if (indexOf(ids, s.options.id) < 0) {
                            s.remove(false);
                        }
                    }
                    return true;
                };

                // chart is maintained by initChart
                var chart = false;
                var initChart = function() {
                    if (chart) chart.destroy();
                    prevSeriesOptions = {};
                    var config = scope.config || {};
                    var mergedOptions = getMergedOptions(scope, element, config);
                    chart = config.useHighStocks ? new Highcharts.StockChart(mergedOptions) : new Highcharts.Chart(mergedOptions);
                    for (var i = 0; i < axisNames.length; i++) {
                        if (config[axisNames[i]]) {
                            processExtremes(chart, config[axisNames[i]], axisNames[i]);
                        }
                    }
                    if(config.loading) {
                        chart.showLoading();
                    }

                };
                initChart();


                scope.$watch('config.series', function (newSeries, oldSeries) {
                    var needsRedraw = processSeries(newSeries);
                    if(needsRedraw) {
                        chart.redraw();
                    }
                }, true);

                scope.$watch('config.title', function (newTitle) {
                    chart.setTitle(newTitle, true);
                }, true);

                scope.$watch('config.subtitle', function (newSubtitle) {
                    chart.setTitle(true, newSubtitle);
                }, true);

                scope.$watch('config.loading', function (loading) {
                    if(loading) {
                        chart.showLoading();
                    } else {
                        chart.hideLoading();
                    }
                });

                scope.$watch('config.credits.enabled', function (enabled) {
                    if (enabled) {
                        chart.credits.show();
                    } else if (chart.credits) {
                        chart.credits.hide();
                    }
                });

                scope.$watch('config.useHighStocks', function (useHighStocks) {
                    initChart();
                });

                angular.forEach(axisNames, function(axisName) {
                    scope.$watch('config.' + axisName, function (newAxes, oldAxes) {
                        if (newAxes === oldAxes) return;
                        if(newAxes) {
                            chart[axisName][0].update(newAxes, false);
                            updateZoom(chart[axisName][0], angular.copy(newAxes));
                            chart.redraw();
                        }
                    }, true);
                });
                scope.$watch('config.options', function (newOptions, oldOptions, scope) {
                    //do nothing when called on registration
                    if (newOptions === oldOptions) return;
                    initChart();
                    processSeries(scope.config.series);
                    chart.redraw();
                }, true);

                scope.$watch('config.size', function (newSize, oldSize) {
                    if(newSize === oldSize) return;
                    if(newSize && newSize.width && newSize.height) {
                        chart.setSize(newSize.width, newSize.height);
                    }
                }, true);

                scope.$on('highchartsng.reflow', function () {
                    chart.reflow();
                });

                scope.$on('$destroy', function() {
                    if (chart) chart.destroy();
                    element.remove();
                });

            }
        };
    });;'use strict';

angular.module('L.component.common')
	.directive('narbar',['$http',function ($http) {
		return {
			templateUrl:"/views/narbar",
			restrict: 'AE',
			scope:{
				option: '='
			},
			link: function postLink($scope, element, attrs) {

			}
		};
	}])
;'use strict';

angular.module('L.component.common')
	.directive('nav',['$http','cookie','Language','$location', 'util',function ($http,$cookie,Language, $location, util) {
		return {
			templateUrl:"/views/nav",
			restrict: 'AE',
			scope:{
				option: '='
			},
			link: function postLink($scope, element, attrs) {

				var sign = 1;

				$scope.items = $scope.option.items
				$scope.cls = $scope.option.class;


				$scope.switch = function(index,url){
					var path
						,i;
					if($scope.items[index].active){
						return false;
					}
					else{
						path = $location.path();
						$location.path(util.setPath(path, url, $scope.option.routeLevel));
						for(i = 0; i<$scope.items.length; i++){
							$scope.items[i].active = false;
						}
						$scope.items[index].active = true;
						$scope.$emit("menu",{
							name: $scope.option.name
							,param: $scope.items[index]
						});
					}
				}

				$scope.$on("updateRoute",function(e,routePath){
					var i = 0
						,path;
					path = util.getPathArr(routePath)[$scope.option.routeLevel-1];
					for(i; i < $scope.items.length ; i++){
						$scope.items[i].active = false;
						if(path == $scope.items[i].url){
							console.log(path,$scope.items[i].url);
							$scope.items[i].active = true;
						}
					}
					$scope.$apply();
				})

			}
		};
	}])
;angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$position', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, 'position') || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

        var positionStrParts = positionStr.split('-');
        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

        var hostElPos,
          targetElWidth,
          targetElHeight,
          targetElPos;

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

        targetElWidth = targetEl.prop('offsetWidth');
        targetElHeight = targetEl.prop('offsetHeight');

        var shiftWidth = {
          center: function () {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function () {
            return hostElPos.left;
          },
          right: function () {
            return hostElPos.left + hostElPos.width;
          }
        };

        var shiftHeight = {
          center: function () {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function () {
            return hostElPos.top;
          },
          bottom: function () {
            return hostElPos.top + hostElPos.height;
          }
        };

        switch (pos0) {
          case 'right':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            };
            break;
          case 'left':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            };
            break;
          case 'bottom':
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            };
            break;
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            };
            break;
        }

        return targetElPos;
      }
    };
  }]);
;'use strict';
angular.module('easyApp')
    .directive('stable',['cookie','Language',function (cookie,Language) {
        return {
            templateUrl:"/views/staticTable",
            restrict: 'AE',
            scope:{
                option: '='
            },
            link: function postLink($scope, element, attrs) {

                var tvData = null;
                $scope.tableConfig = {};

                $scope.$watch("option.data", function(data){
                    if(data){
                        $scope.tableConfig.pageSize = 50 ;
                        $scope.tableConfig.totalPage = Math.ceil(data.length / 50);
                        $scope.tableConfig.pageNow = 1;
                        $scope.tableConfig.total = data.length;
                        $scope.tableConfig.pageState = {first:true,last:false,prev:false,next:false};
                        tvData = data;
                        parseTvData();
                        adjustPage();
                    }

                });

                function parseTvData(){
                    var config = $scope.tableConfig,
                        start = (config.pageNow-1)*config.pageSize;

                    $scope.data = tvData.slice(start,start + config.pageSize);
                    console.log($scope.data);
                }

                $scope.changeSize = function(){
                    $scope.tableConfig.pageSize = $scope.pageSize;
                    //ajaxAsk($scope.option.reqUrl.getUrl,{page:$scope.tableConfig},pageSuccess)
                }

                $scope.changePage = function(how){
                    switch(how){
                        case 'first':
                            $scope.tableConfig.pageNow = 1;
                            break;
                        case 'pre':
	                        if($scope.tableConfig.pageNow != 1)
                                $scope.tableConfig.pageNow--;
                            break;
                        case 'next':
	                        if($scope.tableConfig.pageNow != $scope.tableConfig.totalPage)
                                $scope.tableConfig.pageNow++;
                            break;
                        case 'last':
                            $scope.tableConfig.pageNow = $scope.tableConfig.totalPage;
                            break;
                        default:break;
                    }
                    adjustPage();
                    parseTvData();
                }


                function adjustPage(){
                    var temp = $scope.tableConfig;
                    if (temp.pageNow == 1) {
                        temp.pageState.first = false;
                        temp.pageState.pre = false;
                        if (temp.totalPage == 1) {
                            temp.pageState.next = false;
                            temp.pageState.last = false;
                        }
                        else {
                            temp.pageState.next = true;
                            temp.pageState.last = true;
                        }
                    }
                    else {
                        temp.pageState.first = true;
                        temp.pageState.pre = true;

                        if (temp.pageNow == temp.totalPage) {
                            temp.pageState.next = false;
                            temp.pageState.last = false;
                        }
                        else {
                            temp.pageState.next = true;
                            temp.pageState.last = true;
                        }
                    }
                }
            }
        };
    }]);
;angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position', 'ui.bootstrap.bindHtml'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('typeaheadParser', ['$parse', function ($parse) {

  //                      00000111000000000000022200000000000000003333333333333330000000000044000
  var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;

  return {
    parse:function (input) {

      var match = input.match(TYPEAHEAD_REGEXP);
      if (!match) {
        throw new Error(
          'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
            ' but got "' + input + '".');
      }

      return {
        itemName:match[3],
        source:$parse(match[4]),
        viewMapper:$parse(match[2] || match[1]),
        modelMapper:$parse(match[1])
      };
    }
  };
}])

  .directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$position', 'typeaheadParser',
    function ($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {

  var HOT_KEYS = [9, 13, 27, 38, 40];

  return {
    require:'ngModel',
    link:function (originalScope, element, attrs, modelCtrl) {

      //SUPPORTED ATTRIBUTES (OPTIONS)

      //minimal no of characters that needs to be entered before typeahead kicks-in
      var minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1;

      //minimal wait time after last character typed before typehead kicks-in
      var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

      //should it restrict model values to the ones selected from the popup only?
      var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

      //binding to a variable that indicates if matches are being retrieved asynchronously
      var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

      //a callback executed when a match is selected
      var onSelectCallback = $parse(attrs.typeaheadOnSelect);

      var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

      var appendToBody =  attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

      //INTERNAL VARIABLES

      //model setter executed upon match selection
      var $setModelValue = $parse(attrs.ngModel).assign;

      //expressions used by typeahead
      var parserResult = typeaheadParser.parse(attrs.typeahead);

      var hasFocus;

      //create a child scope for the typeahead directive so we are not polluting original scope
      //with typeahead-specific data (matches, query etc.)
      var scope = originalScope.$new();
      originalScope.$on('$destroy', function(){
        scope.$destroy();
      });

      // WAI-ARIA
      var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
      element.attr({
        'aria-autocomplete': 'list',
        'aria-expanded': false,
        'aria-owns': popupId
      });

      //pop-up element used to display matches
      var popUpEl = angular.element('<div typeahead-popup></div>');
      popUpEl.attr({
        id: popupId,
        matches: 'matches',
        active: 'activeIdx',
        select: 'select(activeIdx)',
        query: 'query',
        position: 'position'
      });
      //custom item template
      if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
        popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
      }

      var resetMatches = function() {
        scope.matches = [];
        scope.activeIdx = -1;
        element.attr('aria-expanded', false);
      };

      var getMatchId = function(index) {
        return popupId + '-option-' + index;
      };

      // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
      // This attribute is added or removed automatically when the `activeIdx` changes.
      scope.$watch('activeIdx', function(index) {
        if (index < 0) {
          element.removeAttr('aria-activedescendant');
        } else {
          element.attr('aria-activedescendant', getMatchId(index));
        }
      });

      var getMatchesAsync = function(inputValue) {

        var locals = {$viewValue: inputValue};
        isLoadingSetter(originalScope, true);
        $q.when(parserResult.source(originalScope, locals)).then(function(matches) {

          //it might happen that several async queries were in progress if a user were typing fast
          //but we are interested only in responses that correspond to the current view value
          var onCurrentRequest = (inputValue === modelCtrl.$viewValue);
          if (onCurrentRequest && hasFocus) {
            if (matches.length > 0) {

              scope.activeIdx = 0;
              scope.matches.length = 0;

              //transform labels
              for(var i=0; i<matches.length; i++) {
                locals[parserResult.itemName] = matches[i];
                scope.matches.push({
                  id: getMatchId(i),
                  label: parserResult.viewMapper(scope, locals),
                  model: matches[i]
                });
              }

              scope.query = inputValue;
              //position pop-up with matches - we need to re-calculate its position each time we are opening a window
              //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
              //due to other elements being rendered
              scope.position = appendToBody ? $position.offset(element) : $position.position(element);
              scope.position.top = scope.position.top + element.prop('offsetHeight');

              element.attr('aria-expanded', true);
            } else {
              resetMatches();
            }
          }
          if (onCurrentRequest) {
            isLoadingSetter(originalScope, false);
          }
        }, function(){
          resetMatches();
          isLoadingSetter(originalScope, false);
        });
      };

      resetMatches();

      //we need to propagate user's query so we can higlight matches
      scope.query = undefined;

      //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later 
      var timeoutPromise;

      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
      //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
      modelCtrl.$parsers.unshift(function (inputValue) {

        hasFocus = true;

        if (inputValue && inputValue.length >= minSearch) {
          if (waitTime > 0) {
            if (timeoutPromise) {
              $timeout.cancel(timeoutPromise);//cancel previous timeout
            }
            timeoutPromise = $timeout(function () {
              getMatchesAsync(inputValue);
            }, waitTime);
          } else {
            getMatchesAsync(inputValue);
          }
        } else {
          isLoadingSetter(originalScope, false);
          resetMatches();
        }

        if (isEditable) {
          return inputValue;
        } else {
          if (!inputValue) {
            // Reset in case user had typed something previously.
            modelCtrl.$setValidity('editable', true);
            return inputValue;
          } else {
            modelCtrl.$setValidity('editable', false);
            return undefined;
          }
        }
      });

      modelCtrl.$formatters.push(function (modelValue) {

        var candidateViewValue, emptyViewValue;
        var locals = {};

        if (inputFormatter) {

          locals['$model'] = modelValue;
          return inputFormatter(originalScope, locals);

        } else {

          //it might happen that we don't have enough info to properly render input value
          //we need to check for this situation and simply return model value if we can't apply custom formatting
          locals[parserResult.itemName] = modelValue;
          candidateViewValue = parserResult.viewMapper(originalScope, locals);
          locals[parserResult.itemName] = undefined;
          emptyViewValue = parserResult.viewMapper(originalScope, locals);

          return candidateViewValue!== emptyViewValue ? candidateViewValue : modelValue;
        }
      });

      scope.select = function (activeIdx) {
        //called from within the $digest() cycle
        var locals = {};
        var model, item;

        locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
        model = parserResult.modelMapper(originalScope, locals);
        $setModelValue(originalScope, model);
        modelCtrl.$setValidity('editable', true);

        onSelectCallback(originalScope, {
          $item: item,
          $model: model,
          $label: parserResult.viewMapper(originalScope, locals)
        });

        resetMatches();

        //return focus to the input element if a match was selected via a mouse click event
        // use timeout to avoid $rootScope:inprog error
        $timeout(function() { element[0].focus(); }, 0, false);
      };

      //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
      element.bind('keydown', function (evt) {

        //typeahead is open and an "interesting" key was pressed
        if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
          return;
        }

        evt.preventDefault();

        if (evt.which === 40) {
          scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
          scope.$digest();

        } else if (evt.which === 38) {
          scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.matches.length) - 1;
          scope.$digest();

        } else if (evt.which === 13 || evt.which === 9) {
          scope.$apply(function () {
            scope.select(scope.activeIdx);
          });

        } else if (evt.which === 27) {
          evt.stopPropagation();

          resetMatches();
          scope.$digest();
        }
      });

      element.bind('blur', function (evt) {
        hasFocus = false;
      });

      // Keep reference to click handler to unbind it.
      var dismissClickHandler = function (evt) {
        if (element[0] !== evt.target) {
          resetMatches();
          scope.$digest();
        }
      };

      $document.bind('click', dismissClickHandler);

      originalScope.$on('$destroy', function(){
        $document.unbind('click', dismissClickHandler);
      });

      var $popup = $compile(popUpEl)(scope);
      if ( appendToBody ) {
        $document.find('body').append($popup);
      } else {
        element.after($popup);
      }
    }
  };

}])

  .directive('typeaheadPopup', function () {
    return {
      restrict:'EA',
      scope:{
        matches:'=',
        query:'=',
        active:'=',
        position:'=',
        select:'&'
      },
      replace:true,
      templateUrl:'template/typeahead/typeahead-popup.html',
      link:function (scope, element, attrs) {

        scope.templateUrl = attrs.templateUrl;

        scope.isOpen = function () {
          return scope.matches.length > 0;
        };

        scope.isActive = function (matchIdx) {
          return scope.active == matchIdx;
        };

        scope.selectActive = function (matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function (activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  })

  .directive('typeaheadMatch', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
    return {
      restrict:'EA',
      scope:{
        index:'=',
        match:'=',
        query:'='
      },
      link:function (scope, element, attrs) {
        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
        $http.get(tplUrl, {cache: $templateCache}).success(function(tplContent){
           element.replaceWith($compile(tplContent.trim())(scope));
        });
      }
    };
  }])

  .filter('typeaheadHighlight', function() {

    function escapeRegexp(queryToEscape) {
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function(matchItem, query) {
      return query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
    };
  });
;angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.bindHtml","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.dropdownToggle","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]),angular.module("ui.bootstrap.tpls",["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/datepicker/popup.html","template/modal/backdrop.html","template/modal/window.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/progressbar/progressbar.html","template/rating/rating.html","template/tabs/tab.html","template/tabs/tabset.html","template/timepicker/timepicker.html","template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(a,b,c){function d(a){for(var b in a)if(void 0!==f.style[b])return a[b]}var e=function(d,f,g){g=g||{};var h=a.defer(),i=e[g.animation?"animationEndEventName":"transitionEndEventName"],j=function(){c.$apply(function(){d.unbind(i,j),h.resolve(d)})};return i&&d.bind(i,j),b(function(){angular.isString(f)?d.addClass(f):angular.isFunction(f)?f(d):angular.isObject(f)&&d.css(f),i||h.resolve(d)}),h.promise.cancel=function(){i&&d.unbind(i,j),h.reject("Transition cancelled")},h.promise},f=document.createElement("trans"),g={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},h={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return e.transitionEndEventName=d(g),e.animationEndEventName=d(h),e}]),angular.module("ui.bootstrap.collapse",["ui.bootstrap.transition"]).directive("collapse",["$transition",function(a){var b=function(a,b,c){b.removeClass("collapse"),b.css({height:c});b[0].offsetWidth;b.addClass("collapse")};return{link:function(c,d,e){function f(){g||(b(c,d,"auto"),d.addClass("in"))}var g,h=!0;c.$watch(e.collapse,function(a){a?l():k()});var i,j=function(b){return i&&i.cancel(),i=a(d,b),i.then(function(){i=void 0},function(){i=void 0}),i},k=function(){if(g=!1,h)h=!1,f();else{var a=d[0].scrollHeight;a?j({height:a+"px"}).then(f):f()}},l=function(){g=!0,d.removeClass("in"),h?(h=!1,b(c,d,0)):(b(c,d,d[0].scrollHeight+"px"),j({height:"0"}))}}}}]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(a,b,c){this.groups=[],this.closeOthers=function(d){var e=angular.isDefined(b.closeOthers)?a.$eval(b.closeOthers):c.closeOthers;e&&angular.forEach(this.groups,function(a){a!==d&&(a.isOpen=!1)})},this.addGroup=function(a){var b=this;this.groups.push(a),a.$on("$destroy",function(){b.removeGroup(a)})},this.removeGroup=function(a){var b=this.groups.indexOf(a);-1!==b&&this.groups.splice(this.groups.indexOf(a),1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",["$parse",function(a){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@"},controller:function(){this.setHeading=function(a){this.heading=a}},link:function(b,c,d,e){var f,g;e.addGroup(b),b.isOpen=!1,d.isOpen&&(f=a(d.isOpen),g=f.assign,b.$parent.$watch(f,function(a){b.isOpen=!!a})),b.$watch("isOpen",function(a){a&&e.closeOthers(b),g&&g(b.$parent,a)})}}}]).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",compile:function(a,b,c){return function(a,b,d,e){e.setHeading(c(a,function(){}))}}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(a,b,c,d){a.$watch(function(){return d[c.accordionTransclude]},function(a){a&&(b.html(""),b.append(a))})}}}),angular.module("ui.bootstrap.alert",[]).controller("AlertController",["$scope","$attrs",function(a,b){a.closeable="close"in b}]).directive("alert",function(){return{restrict:"EA",controller:"AlertController",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"=",close:"&"}}}),angular.module("ui.bootstrap.bindHtml",[]).directive("bindHtmlUnsafe",function(){return function(a,b,c){b.addClass("ng-binding").data("$binding",c.bindHtmlUnsafe),a.$watch(c.bindHtmlUnsafe,function(a){b.html(a||"")})}}),angular.module("ui.bootstrap.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).controller("ButtonsController",["buttonConfig",function(a){this.activeClass=a.activeClass||"active",this.toggleEvent=a.toggleEvent||"click"}]).directive("btnRadio",function(){return{require:["btnRadio","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){var e=d[0],f=d[1];f.$render=function(){b.toggleClass(e.activeClass,angular.equals(f.$modelValue,a.$eval(c.btnRadio)))},b.bind(e.toggleEvent,function(){b.hasClass(e.activeClass)||a.$apply(function(){f.$setViewValue(a.$eval(c.btnRadio)),f.$render()})})}}}).directive("btnCheckbox",function(){return{require:["btnCheckbox","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){function e(){return g(c.btnCheckboxTrue,!0)}function f(){return g(c.btnCheckboxFalse,!1)}function g(b,c){var d=a.$eval(b);return angular.isDefined(d)?d:c}var h=d[0],i=d[1];i.$render=function(){b.toggleClass(h.activeClass,angular.equals(i.$modelValue,e()))},b.bind(h.toggleEvent,function(){a.$apply(function(){i.$setViewValue(b.hasClass(h.activeClass)?f():e()),i.$render()})})}}}),angular.module("ui.bootstrap.carousel",["ui.bootstrap.transition"]).controller("CarouselController",["$scope","$timeout","$transition","$q",function(a,b,c){function d(){e();var c=+a.interval;!isNaN(c)&&c>=0&&(g=b(f,c))}function e(){g&&(b.cancel(g),g=null)}function f(){h?(a.next(),d()):a.pause()}var g,h,i=this,j=i.slides=[],k=-1;i.currentSlide=null;var l=!1;i.select=function(e,f){function g(){if(!l){if(i.currentSlide&&angular.isString(f)&&!a.noTransition&&e.$element){e.$element.addClass(f);{e.$element[0].offsetWidth}angular.forEach(j,function(a){angular.extend(a,{direction:"",entering:!1,leaving:!1,active:!1})}),angular.extend(e,{direction:f,active:!0,entering:!0}),angular.extend(i.currentSlide||{},{direction:f,leaving:!0}),a.$currentTransition=c(e.$element,{}),function(b,c){a.$currentTransition.then(function(){h(b,c)},function(){h(b,c)})}(e,i.currentSlide)}else h(e,i.currentSlide);i.currentSlide=e,k=m,d()}}function h(b,c){angular.extend(b,{direction:"",active:!0,leaving:!1,entering:!1}),angular.extend(c||{},{direction:"",active:!1,leaving:!1,entering:!1}),a.$currentTransition=null}var m=j.indexOf(e);void 0===f&&(f=m>k?"next":"prev"),e&&e!==i.currentSlide&&(a.$currentTransition?(a.$currentTransition.cancel(),b(g)):g())},a.$on("$destroy",function(){l=!0}),i.indexOfSlide=function(a){return j.indexOf(a)},a.next=function(){var b=(k+1)%j.length;return a.$currentTransition?void 0:i.select(j[b],"next")},a.prev=function(){var b=0>k-1?j.length-1:k-1;return a.$currentTransition?void 0:i.select(j[b],"prev")},a.select=function(a){i.select(a)},a.isActive=function(a){return i.currentSlide===a},a.slides=function(){return j},a.$watch("interval",d),a.$on("$destroy",e),a.play=function(){h||(h=!0,d())},a.pause=function(){a.noPause||(h=!1,e())},i.addSlide=function(b,c){b.$element=c,j.push(b),1===j.length||b.active?(i.select(j[j.length-1]),1==j.length&&a.play()):b.active=!1},i.removeSlide=function(a){var b=j.indexOf(a);j.splice(b,1),j.length>0&&a.active?b>=j.length?i.select(j[b-1]):i.select(j[b]):k>b&&k--}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",scope:{interval:"=",noTransition:"=",noPause:"="}}}]).directive("slide",["$parse",function(a){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{},link:function(b,c,d,e){if(d.active){var f=a(d.active),g=f.assign,h=b.active=f(b.$parent);b.$watch(function(){var a=f(b.$parent);return a!==b.active&&(a!==h?h=b.active=a:g(b.$parent,a=h=b.active)),a})}e.addSlide(b,c),b.$on("$destroy",function(){e.removeSlide(b)}),b.$watch("active",function(a){a&&e.select(b)})}}}]),angular.module("ui.bootstrap.position",[]).factory("$position",["$document","$window",function(a,b){function c(a,c){return a.currentStyle?a.currentStyle[c]:b.getComputedStyle?b.getComputedStyle(a)[c]:a.style[c]}function d(a){return"static"===(c(a,"position")||"static")}var e=function(b){for(var c=a[0],e=b.offsetParent||c;e&&e!==c&&d(e);)e=e.offsetParent;return e||c};return{position:function(b){var c=this.offset(b),d={top:0,left:0},f=e(b[0]);f!=a[0]&&(d=this.offset(angular.element(f)),d.top+=f.clientTop-f.scrollTop,d.left+=f.clientLeft-f.scrollLeft);var g=b[0].getBoundingClientRect();return{width:g.width||b.prop("offsetWidth"),height:g.height||b.prop("offsetHeight"),top:c.top-d.top,left:c.left-d.left}},offset:function(c){var d=c[0].getBoundingClientRect();return{width:d.width||c.prop("offsetWidth"),height:d.height||c.prop("offsetHeight"),top:d.top+(b.pageYOffset||a[0].body.scrollTop||a[0].documentElement.scrollTop),left:d.left+(b.pageXOffset||a[0].body.scrollLeft||a[0].documentElement.scrollLeft)}}}}]),angular.module("ui.bootstrap.datepicker",["ui.bootstrap.position"]).constant("datepickerConfig",{dayFormat:"dd",monthFormat:"MMMM",yearFormat:"yyyy",dayHeaderFormat:"EEE",dayTitleFormat:"MMMM yyyy",monthTitleFormat:"yyyy",showWeeks:!0,startingDay:0,yearRange:20,minDate:null,maxDate:null}).controller("DatepickerController",["$scope","$attrs","dateFilter","datepickerConfig",function(a,b,c,d){function e(b,c){return angular.isDefined(b)?a.$parent.$eval(b):c}function f(a,b){return new Date(a,b,0).getDate()}function g(a,b){for(var c=new Array(b),d=a,e=0;b>e;)c[e++]=new Date(d),d.setDate(d.getDate()+1);return c}function h(a,b,d,e){return{date:a,label:c(a,b),selected:!!d,secondary:!!e}}var i={day:e(b.dayFormat,d.dayFormat),month:e(b.monthFormat,d.monthFormat),year:e(b.yearFormat,d.yearFormat),dayHeader:e(b.dayHeaderFormat,d.dayHeaderFormat),dayTitle:e(b.dayTitleFormat,d.dayTitleFormat),monthTitle:e(b.monthTitleFormat,d.monthTitleFormat)},j=e(b.startingDay,d.startingDay),k=e(b.yearRange,d.yearRange);this.minDate=d.minDate?new Date(d.minDate):null,this.maxDate=d.maxDate?new Date(d.maxDate):null,this.modes=[{name:"day",getVisibleDates:function(a,b){var d=a.getFullYear(),e=a.getMonth(),k=new Date(d,e,1),l=j-k.getDay(),m=l>0?7-l:-l,n=new Date(k),o=0;m>0&&(n.setDate(-m+1),o+=m),o+=f(d,e+1),o+=(7-o%7)%7;for(var p=g(n,o),q=new Array(7),r=0;o>r;r++){var s=new Date(p[r]);p[r]=h(s,i.day,b&&b.getDate()===s.getDate()&&b.getMonth()===s.getMonth()&&b.getFullYear()===s.getFullYear(),s.getMonth()!==e)}for(var t=0;7>t;t++)q[t]=c(p[t].date,i.dayHeader);return{objects:p,title:c(a,i.dayTitle),labels:q}},compare:function(a,b){return new Date(a.getFullYear(),a.getMonth(),a.getDate())-new Date(b.getFullYear(),b.getMonth(),b.getDate())},split:7,step:{months:1}},{name:"month",getVisibleDates:function(a,b){for(var d=new Array(12),e=a.getFullYear(),f=0;12>f;f++){var g=new Date(e,f,1);d[f]=h(g,i.month,b&&b.getMonth()===f&&b.getFullYear()===e)}return{objects:d,title:c(a,i.monthTitle)}},compare:function(a,b){return new Date(a.getFullYear(),a.getMonth())-new Date(b.getFullYear(),b.getMonth())},split:3,step:{years:1}},{name:"year",getVisibleDates:function(a,b){for(var c=new Array(k),d=a.getFullYear(),e=parseInt((d-1)/k,10)*k+1,f=0;k>f;f++){var g=new Date(e+f,0,1);c[f]=h(g,i.year,b&&b.getFullYear()===g.getFullYear())}return{objects:c,title:[c[0].label,c[k-1].label].join(" - ")}},compare:function(a,b){return a.getFullYear()-b.getFullYear()},split:5,step:{years:k}}],this.isDisabled=function(b,c){var d=this.modes[c||0];return this.minDate&&d.compare(b,this.minDate)<0||this.maxDate&&d.compare(b,this.maxDate)>0||a.dateDisabled&&a.dateDisabled({date:b,mode:d.name})}}]).directive("datepicker",["dateFilter","$parse","datepickerConfig","$log",function(a,b,c,d){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/datepicker.html",scope:{dateDisabled:"&"},require:["datepicker","?^ngModel"],controller:"DatepickerController",link:function(a,e,f,g){function h(){a.showWeekNumbers=0===o&&q}function i(a,b){for(var c=[];a.length>0;)c.push(a.splice(0,b));return c}function j(b){var c=null,e=!0;n.$modelValue&&(c=new Date(n.$modelValue),isNaN(c)?(e=!1,d.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')):b&&(p=c)),n.$setValidity("date",e);var f=m.modes[o],g=f.getVisibleDates(p,c);angular.forEach(g.objects,function(a){a.disabled=m.isDisabled(a.date,o)}),n.$setValidity("date-disabled",!c||!m.isDisabled(c)),a.rows=i(g.objects,f.split),a.labels=g.labels||[],a.title=g.title}function k(a){o=a,h(),j()}function l(a){var b=new Date(a);b.setDate(b.getDate()+4-(b.getDay()||7));var c=b.getTime();return b.setMonth(0),b.setDate(1),Math.floor(Math.round((c-b)/864e5)/7)+1}var m=g[0],n=g[1];if(n){var o=0,p=new Date,q=c.showWeeks;f.showWeeks?a.$parent.$watch(b(f.showWeeks),function(a){q=!!a,h()}):h(),f.min&&a.$parent.$watch(b(f.min),function(a){m.minDate=a?new Date(a):null,j()}),f.max&&a.$parent.$watch(b(f.max),function(a){m.maxDate=a?new Date(a):null,j()}),n.$render=function(){j(!0)},a.select=function(a){if(0===o){var b=n.$modelValue?new Date(n.$modelValue):new Date(0,0,0,0,0,0,0);b.setFullYear(a.getFullYear(),a.getMonth(),a.getDate()),n.$setViewValue(b),j(!0)}else p=a,k(o-1)},a.move=function(a){var b=m.modes[o].step;p.setMonth(p.getMonth()+a*(b.months||0)),p.setFullYear(p.getFullYear()+a*(b.years||0)),j()},a.toggleMode=function(){k((o+1)%m.modes.length)},a.getWeekNumber=function(b){return 0===o&&a.showWeekNumbers&&7===b.length?l(b[0].date):null}}}}}]).constant("datepickerPopupConfig",{dateFormat:"yyyy-MM-dd",currentText:"Today",toggleWeeksText:"Weeks",clearText:"Clear",closeText:"Done",closeOnDateSelection:!0,appendToBody:!1,showButtonBar:!0}).directive("datepickerPopup",["$compile","$parse","$document","$position","dateFilter","datepickerPopupConfig","datepickerConfig",function(a,b,c,d,e,f,g){return{restrict:"EA",require:"ngModel",link:function(h,i,j,k){function l(a){u?u(h,!!a):q.isOpen=!!a}function m(a){if(a){if(angular.isDate(a))return k.$setValidity("date",!0),a;if(angular.isString(a)){var b=new Date(a);return isNaN(b)?(k.$setValidity("date",!1),void 0):(k.$setValidity("date",!0),b)}return k.$setValidity("date",!1),void 0}return k.$setValidity("date",!0),null}function n(a,c,d){a&&(h.$watch(b(a),function(a){q[c]=a}),y.attr(d||c,c))}function o(){q.position=s?d.offset(i):d.position(i),q.position.top=q.position.top+i.prop("offsetHeight")}var p,q=h.$new(),r=angular.isDefined(j.closeOnDateSelection)?h.$eval(j.closeOnDateSelection):f.closeOnDateSelection,s=angular.isDefined(j.datepickerAppendToBody)?h.$eval(j.datepickerAppendToBody):f.appendToBody;j.$observe("datepickerPopup",function(a){p=a||f.dateFormat,k.$render()}),q.showButtonBar=angular.isDefined(j.showButtonBar)?h.$eval(j.showButtonBar):f.showButtonBar,h.$on("$destroy",function(){B.remove(),q.$destroy()}),j.$observe("currentText",function(a){q.currentText=angular.isDefined(a)?a:f.currentText}),j.$observe("toggleWeeksText",function(a){q.toggleWeeksText=angular.isDefined(a)?a:f.toggleWeeksText}),j.$observe("clearText",function(a){q.clearText=angular.isDefined(a)?a:f.clearText}),j.$observe("closeText",function(a){q.closeText=angular.isDefined(a)?a:f.closeText});var t,u;j.isOpen&&(t=b(j.isOpen),u=t.assign,h.$watch(t,function(a){q.isOpen=!!a})),q.isOpen=t?t(h):!1;var v=function(a){q.isOpen&&a.target!==i[0]&&q.$apply(function(){l(!1)})},w=function(){q.$apply(function(){l(!0)})},x=angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");x.attr({"ng-model":"date","ng-change":"dateSelection()"});var y=angular.element(x.children()[0]);j.datepickerOptions&&y.attr(angular.extend({},h.$eval(j.datepickerOptions))),k.$parsers.unshift(m),q.dateSelection=function(a){angular.isDefined(a)&&(q.date=a),k.$setViewValue(q.date),k.$render(),r&&l(!1)},i.bind("input change keyup",function(){q.$apply(function(){q.date=k.$modelValue})}),k.$render=function(){var a=k.$viewValue?e(k.$viewValue,p):"";i.val(a),q.date=k.$modelValue},n(j.min,"min"),n(j.max,"max"),j.showWeeks?n(j.showWeeks,"showWeeks","show-weeks"):(q.showWeeks=g.showWeeks,y.attr("show-weeks","showWeeks")),j.dateDisabled&&y.attr("date-disabled",j.dateDisabled);var z=!1,A=!1;q.$watch("isOpen",function(a){a?(o(),c.bind("click",v),A&&i.unbind("focus",w),i[0].focus(),z=!0):(z&&c.unbind("click",v),i.bind("focus",w),A=!0),u&&u(h,a)}),q.today=function(){q.dateSelection(new Date)},q.clear=function(){q.dateSelection(null)};var B=a(x)(q);s?c.find("body").append(B):i.after(B)}}}]).directive("datepickerPopupWrap",function(){return{restrict:"EA",replace:!0,transclude:!0,templateUrl:"template/datepicker/popup.html",link:function(a,b){b.bind("click",function(a){a.preventDefault(),a.stopPropagation()})}}}),angular.module("ui.bootstrap.dropdownToggle",[]).directive("dropdownToggle",["$document","$location",function(a){var b=null,c=angular.noop;return{restrict:"CA",link:function(d,e){d.$watch("$location.path",function(){c()}),e.parent().bind("click",function(){c()}),e.bind("click",function(d){var f=e===b;d.preventDefault(),d.stopPropagation(),b&&c(),f||e.hasClass("disabled")||e.prop("disabled")||(e.parent().addClass("open"),b=e,c=function(d){d&&(d.preventDefault(),d.stopPropagation()),a.unbind("click",c),e.parent().removeClass("open"),c=angular.noop,b=null},a.bind("click",c))})}}}]),angular.module("ui.bootstrap.modal",[]).factory("$$stackedMap",function(){return{createNew:function(){var a=[];return{add:function(b,c){a.push({key:b,value:c})},get:function(b){for(var c=0;c<a.length;c++)if(b==a[c].key)return a[c]},keys:function(){for(var b=[],c=0;c<a.length;c++)b.push(a[c].key);return b},top:function(){return a[a.length-1]},remove:function(b){for(var c=-1,d=0;d<a.length;d++)if(b==a[d].key){c=d;break}return a.splice(c,1)[0]},removeTop:function(){return a.splice(a.length-1,1)[0]},length:function(){return a.length}}}}}).directive("modalBackdrop",["$modalStack","$timeout",function(a,b){return{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",link:function(c){c.animate=!1,b(function(){c.animate=!0}),c.close=function(b){var c=a.getTop();c&&c.value.backdrop&&"static"!=c.value.backdrop&&(b.preventDefault(),b.stopPropagation(),a.dismiss(c.key,"backdrop click"))}}}}]).directive("modalWindow",["$timeout",function(a){return{restrict:"EA",scope:{index:"@"},replace:!0,transclude:!0,templateUrl:"template/modal/window.html",link:function(b,c,d){b.windowClass=d.windowClass||"",c[0].focus(),a(function(){b.animate=!0})}}}]).factory("$modalStack",["$document","$compile","$rootScope","$$stackedMap",function(a,b,c,d){function e(){for(var a=-1,b=k.keys(),c=0;c<b.length;c++)k.get(b[c]).value.backdrop&&(a=c);return a}function f(b){var c=a.find("body").eq(0),d=k.get(b).value;k.remove(b),d.modalDomEl.remove(),c.toggleClass(i,k.length()>0),h&&-1==e()&&(h.remove(),h=void 0),d.modalScope.$destroy()}var g,h,i="modal-open",j=c.$new(!0),k=d.createNew(),l={};return c.$watch(e,function(a){j.index=a}),a.bind("keydown",function(a){var b;27===a.which&&(b=k.top(),b&&b.value.keyboard&&c.$apply(function(){l.dismiss(b.key)}))}),l.open=function(c,d){k.add(c,{deferred:d.deferred,modalScope:d.scope,backdrop:d.backdrop,keyboard:d.keyboard});var f=a.find("body").eq(0);e()>=0&&!h&&(g=angular.element("<div modal-backdrop></div>"),h=b(g)(j),f.append(h));var l=angular.element("<div modal-window></div>");l.attr("window-class",d.windowClass),l.attr("index",k.length()-1),l.html(d.content);var m=b(l)(d.scope);k.top().value.modalDomEl=m,f.append(m),f.addClass(i)},l.close=function(a,b){var c=k.get(a);c&&(c.value.deferred.resolve(b),f(a))},l.dismiss=function(a,b){var c=k.get(a).value;c&&(c.deferred.reject(b),f(a))},l.getTop=function(){return k.top()},l}]).provider("$modal",function(){var a={options:{backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$http","$templateCache","$controller","$modalStack",function(b,c,d,e,f,g,h){function i(a){return a.template?d.when(a.template):e.get(a.templateUrl,{cache:f}).then(function(a){return a.data})}function j(a){var c=[];return angular.forEach(a,function(a){(angular.isFunction(a)||angular.isArray(a))&&c.push(d.when(b.invoke(a)))}),c}var k={};return k.open=function(b){var e=d.defer(),f=d.defer(),k={result:e.promise,opened:f.promise,close:function(a){h.close(k,a)},dismiss:function(a){h.dismiss(k,a)}};if(b=angular.extend({},a.options,b),b.resolve=b.resolve||{},!b.template&&!b.templateUrl)throw new Error("One of template or templateUrl options is required.");var l=d.all([i(b)].concat(j(b.resolve)));return l.then(function(a){var d=(b.scope||c).$new();d.$close=k.close,d.$dismiss=k.dismiss;var f,i={},j=1;b.controller&&(i.$scope=d,i.$modalInstance=k,angular.forEach(b.resolve,function(b,c){i[c]=a[j++]}),f=g(b.controller,i)),h.open(k,{scope:d,deferred:e,content:a[0],backdrop:b.backdrop,keyboard:b.keyboard,windowClass:b.windowClass})},function(a){e.reject(a)}),l.then(function(){f.resolve(!0)},function(){f.reject(!1)}),k},k}]};return a}),angular.module("ui.bootstrap.pagination",[]).controller("PaginationController",["$scope","$attrs","$parse","$interpolate",function(a,b,c,d){var e=this,f=b.numPages?c(b.numPages).assign:angular.noop;this.init=function(d){b.itemsPerPage?a.$parent.$watch(c(b.itemsPerPage),function(b){e.itemsPerPage=parseInt(b,10),a.totalPages=e.calculateTotalPages()}):this.itemsPerPage=d},this.noPrevious=function(){return 1===this.page},this.noNext=function(){return this.page===a.totalPages},this.isActive=function(a){return this.page===a},this.calculateTotalPages=function(){var b=this.itemsPerPage<1?1:Math.ceil(a.totalItems/this.itemsPerPage);return Math.max(b||0,1)},this.getAttributeValue=function(b,c,e){return angular.isDefined(b)?e?d(b)(a.$parent):a.$parent.$eval(b):c},this.render=function(){this.page=parseInt(a.page,10)||1,this.page>0&&this.page<=a.totalPages&&(a.pages=this.getPages(this.page,a.totalPages))},a.selectPage=function(b){!e.isActive(b)&&b>0&&b<=a.totalPages&&(a.page=b,a.onSelectPage({page:b}))},a.$watch("page",function(){e.render()}),a.$watch("totalItems",function(){a.totalPages=e.calculateTotalPages()}),a.$watch("totalPages",function(b){f(a.$parent,b),e.page>b?a.selectPage(b):e.render()})}]).constant("paginationConfig",{itemsPerPage:10,boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0}).directive("pagination",["$parse","paginationConfig",function(a,b){return{restrict:"EA",scope:{page:"=",totalItems:"=",onSelectPage:" &"},controller:"PaginationController",templateUrl:"template/pagination/pagination.html",replace:!0,link:function(c,d,e,f){function g(a,b,c,d){return{number:a,text:b,active:c,disabled:d}}var h,i=f.getAttributeValue(e.boundaryLinks,b.boundaryLinks),j=f.getAttributeValue(e.directionLinks,b.directionLinks),k=f.getAttributeValue(e.firstText,b.firstText,!0),l=f.getAttributeValue(e.previousText,b.previousText,!0),m=f.getAttributeValue(e.nextText,b.nextText,!0),n=f.getAttributeValue(e.lastText,b.lastText,!0),o=f.getAttributeValue(e.rotate,b.rotate);f.init(b.itemsPerPage),e.maxSize&&c.$parent.$watch(a(e.maxSize),function(a){h=parseInt(a,10),f.render()}),f.getPages=function(a,b){var c=[],d=1,e=b,p=angular.isDefined(h)&&b>h;p&&(o?(d=Math.max(a-Math.floor(h/2),1),e=d+h-1,e>b&&(e=b,d=e-h+1)):(d=(Math.ceil(a/h)-1)*h+1,e=Math.min(d+h-1,b)));for(var q=d;e>=q;q++){var r=g(q,q,f.isActive(q),!1);c.push(r)}if(p&&!o){if(d>1){var s=g(d-1,"...",!1,!1);c.unshift(s)}if(b>e){var t=g(e+1,"...",!1,!1);c.push(t)}}if(j){var u=g(a-1,l,!1,f.noPrevious());c.unshift(u);var v=g(a+1,m,!1,f.noNext());c.push(v)}if(i){var w=g(1,k,!1,f.noPrevious());c.unshift(w);var x=g(b,n,!1,f.noNext());c.push(x)}return c}}}}]).constant("pagerConfig",{itemsPerPage:10,previousText:"« Previous",nextText:"Next »",align:!0}).directive("pager",["pagerConfig",function(a){return{restrict:"EA",scope:{page:"=",totalItems:"=",onSelectPage:" &"},controller:"PaginationController",templateUrl:"template/pagination/pager.html",replace:!0,link:function(b,c,d,e){function f(a,b,c,d,e){return{number:a,text:b,disabled:c,previous:i&&d,next:i&&e}}var g=e.getAttributeValue(d.previousText,a.previousText,!0),h=e.getAttributeValue(d.nextText,a.nextText,!0),i=e.getAttributeValue(d.align,a.align);e.init(a.itemsPerPage),e.getPages=function(a){return[f(a-1,g,e.noPrevious(),!0,!1),f(a+1,h,e.noNext(),!1,!0)]}}}}]),angular.module("ui.bootstrap.tooltip",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).provider("$tooltip",function(){function a(a){var b=/[A-Z]/g,c="-";return a.replace(b,function(a,b){return(b?c:"")+a.toLowerCase()})}var b={placement:"top",animation:!0,popupDelay:0},c={mouseenter:"mouseleave",click:"click",focus:"blur"},d={};this.options=function(a){angular.extend(d,a)},this.setTriggers=function(a){angular.extend(c,a)},this.$get=["$window","$compile","$timeout","$parse","$document","$position","$interpolate",function(e,f,g,h,i,j,k){return function(e,l,m){function n(a){var b=a||o.trigger||m,d=c[b]||b;return{show:b,hide:d}}var o=angular.extend({},b,d),p=a(e),q=k.startSymbol(),r=k.endSymbol(),s="<div "+p+'-popup title="'+q+"tt_title"+r+'" content="'+q+"tt_content"+r+'" placement="'+q+"tt_placement"+r+'" animation="tt_animation" is-open="tt_isOpen"></div>';return{restrict:"EA",scope:!0,link:function(a,b,c){function d(){a.tt_isOpen?m():k()}function k(){(!y||a.$eval(c[l+"Enable"]))&&(a.tt_popupDelay?t=g(p,a.tt_popupDelay):a.$apply(p))}function m(){a.$apply(function(){q()})}function p(){var c,d,e,f;if(a.tt_content){switch(r&&g.cancel(r),u.css({top:0,left:0,display:"block"}),v?i.find("body").append(u):b.after(u),c=v?j.offset(b):j.position(b),d=u.prop("offsetWidth"),e=u.prop("offsetHeight"),a.tt_placement){case"right":f={top:c.top+c.height/2-e/2,left:c.left+c.width};break;case"bottom":f={top:c.top+c.height,left:c.left+c.width/2-d/2};break;case"left":f={top:c.top+c.height/2-e/2,left:c.left-d};break;default:f={top:c.top-e,left:c.left+c.width/2-d/2}}f.top+="px",f.left+="px",u.css(f),a.tt_isOpen=!0}}function q(){a.tt_isOpen=!1,g.cancel(t),a.tt_animation?r=g(function(){u.remove()},500):u.remove()}var r,t,u=f(s)(a),v=angular.isDefined(o.appendToBody)?o.appendToBody:!1,w=n(void 0),x=!1,y=angular.isDefined(c[l+"Enable"]);a.tt_isOpen=!1,c.$observe(e,function(b){a.tt_content=b,!b&&a.tt_isOpen&&q()}),c.$observe(l+"Title",function(b){a.tt_title=b}),c.$observe(l+"Placement",function(b){a.tt_placement=angular.isDefined(b)?b:o.placement}),c.$observe(l+"PopupDelay",function(b){var c=parseInt(b,10);a.tt_popupDelay=isNaN(c)?o.popupDelay:c});var z=function(){x&&(b.unbind(w.show,k),b.unbind(w.hide,m))};c.$observe(l+"Trigger",function(a){z(),w=n(a),w.show===w.hide?b.bind(w.show,d):(b.bind(w.show,k),b.bind(w.hide,m)),x=!0});var A=a.$eval(c[l+"Animation"]);a.tt_animation=angular.isDefined(A)?!!A:o.animation,c.$observe(l+"AppendToBody",function(b){v=angular.isDefined(b)?h(b)(a):v}),v&&a.$on("$locationChangeSuccess",function(){a.tt_isOpen&&q()}),a.$on("$destroy",function(){g.cancel(r),g.cancel(t),z(),u.remove(),u.unbind(),u=null})}}}}]}).directive("tooltipPopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$tooltip",function(a){return a("tooltip","tooltip","mouseenter")}]).directive("tooltipHtmlUnsafePopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-unsafe-popup.html"}}).directive("tooltipHtmlUnsafe",["$tooltip",function(a){return a("tooltipHtmlUnsafe","tooltip","mouseenter")}]),angular.module("ui.bootstrap.popover",["ui.bootstrap.tooltip"]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$compile","$timeout","$parse","$window","$tooltip",function(a,b,c,d,e){return e("popover","popover","click")}]),angular.module("ui.bootstrap.progressbar",["ui.bootstrap.transition"]).constant("progressConfig",{animate:!0,max:100}).controller("ProgressController",["$scope","$attrs","progressConfig","$transition",function(a,b,c,d){var e=this,f=[],g=angular.isDefined(b.max)?a.$parent.$eval(b.max):c.max,h=angular.isDefined(b.animate)?a.$parent.$eval(b.animate):c.animate;this.addBar=function(a,b){var c=0,d=a.$parent.$index;angular.isDefined(d)&&f[d]&&(c=f[d].value),f.push(a),this.update(b,a.value,c),a.$watch("value",function(a,c){a!==c&&e.update(b,a,c)}),a.$on("$destroy",function(){e.removeBar(a)})},this.update=function(a,b,c){var e=this.getPercentage(b);h?(a.css("width",this.getPercentage(c)+"%"),d(a,{width:e+"%"})):a.css({transition:"none",width:e+"%"})},this.removeBar=function(a){f.splice(f.indexOf(a),1)},this.getPercentage=function(a){return Math.round(100*a/g)}}]).directive("progress",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",require:"progress",scope:{},template:'<div class="progress" ng-transclude></div>'}}).directive("bar",function(){return{restrict:"EA",replace:!0,transclude:!0,require:"^progress",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/bar.html",link:function(a,b,c,d){d.addBar(a,b)}}}).directive("progressbar",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/progressbar.html",link:function(a,b,c,d){d.addBar(a,angular.element(b.children()[0]))}}}),angular.module("ui.bootstrap.rating",[]).constant("ratingConfig",{max:5,stateOn:null,stateOff:null}).controller("RatingController",["$scope","$attrs","$parse","ratingConfig",function(a,b,c,d){this.maxRange=angular.isDefined(b.max)?a.$parent.$eval(b.max):d.max,this.stateOn=angular.isDefined(b.stateOn)?a.$parent.$eval(b.stateOn):d.stateOn,this.stateOff=angular.isDefined(b.stateOff)?a.$parent.$eval(b.stateOff):d.stateOff,this.createRateObjects=function(a){for(var b={stateOn:this.stateOn,stateOff:this.stateOff},c=0,d=a.length;d>c;c++)a[c]=angular.extend({index:c},b,a[c]);return a},a.range=angular.isDefined(b.ratingStates)?this.createRateObjects(angular.copy(a.$parent.$eval(b.ratingStates))):this.createRateObjects(new Array(this.maxRange)),a.rate=function(b){a.readonly||a.value===b||(a.value=b)},a.enter=function(b){a.readonly||(a.val=b),a.onHover({value:b})},a.reset=function(){a.val=angular.copy(a.value),a.onLeave()},a.$watch("value",function(b){a.val=b}),a.readonly=!1,b.readonly&&a.$parent.$watch(c(b.readonly),function(b){a.readonly=!!b})}]).directive("rating",function(){return{restrict:"EA",scope:{value:"=",onHover:"&",onLeave:"&"},controller:"RatingController",templateUrl:"template/rating/rating.html",replace:!0}}),angular.module("ui.bootstrap.tabs",[]).controller("TabsetController",["$scope",function(a){var b=this,c=b.tabs=a.tabs=[];b.select=function(a){angular.forEach(c,function(a){a.active=!1}),a.active=!0},b.addTab=function(a){c.push(a),(1===c.length||a.active)&&b.select(a)
},b.removeTab=function(a){var d=c.indexOf(a);if(a.active&&c.length>1){var e=d==c.length-1?d-1:d+1;b.select(c[e])}c.splice(d,1)}}]).directive("tabset",function(){return{restrict:"EA",transclude:!0,replace:!0,scope:{},controller:"TabsetController",templateUrl:"template/tabs/tabset.html",link:function(a,b,c){a.vertical=angular.isDefined(c.vertical)?a.$parent.$eval(c.vertical):!1,a.type=angular.isDefined(c.type)?a.$parent.$eval(c.type):"tabs"}}}).directive("tab",["$parse",function(a){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{heading:"@",onSelect:"&select",onDeselect:"&deselect"},controller:function(){},compile:function(b,c,d){return function(b,c,e,f){var g,h;e.active?(g=a(e.active),h=g.assign,b.$parent.$watch(g,function(a,c){a!==c&&(b.active=!!a)}),b.active=g(b.$parent)):h=g=angular.noop,b.$watch("active",function(a){h(b.$parent,a),a?(f.select(b),b.onSelect()):b.onDeselect()}),b.disabled=!1,e.disabled&&b.$parent.$watch(a(e.disabled),function(a){b.disabled=!!a}),b.select=function(){b.disabled||(b.active=!0)},f.addTab(b),b.$on("$destroy",function(){f.removeTab(b)}),b.$transcludeFn=d}}}}]).directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(a,b){a.$watch("headingElement",function(a){a&&(b.html(""),b.append(a))})}}}]).directive("tabContentTransclude",function(){function a(a){return a.tagName&&(a.hasAttribute("tab-heading")||a.hasAttribute("data-tab-heading")||"tab-heading"===a.tagName.toLowerCase()||"data-tab-heading"===a.tagName.toLowerCase())}return{restrict:"A",require:"^tabset",link:function(b,c,d){var e=b.$eval(d.tabContentTransclude);e.$transcludeFn(e.$parent,function(b){angular.forEach(b,function(b){a(b)?e.headingElement=b:c.append(b)})})}}}),angular.module("ui.bootstrap.timepicker",[]).constant("timepickerConfig",{hourStep:1,minuteStep:1,showMeridian:!0,meridians:null,readonlyInput:!1,mousewheel:!0}).directive("timepicker",["$parse","$log","timepickerConfig","$locale",function(a,b,c,d){return{restrict:"EA",require:"?^ngModel",replace:!0,scope:{},templateUrl:"template/timepicker/timepicker.html",link:function(e,f,g,h){function i(){var a=parseInt(e.hours,10),b=e.showMeridian?a>0&&13>a:a>=0&&24>a;return b?(e.showMeridian&&(12===a&&(a=0),e.meridian===q[1]&&(a+=12)),a):void 0}function j(){var a=parseInt(e.minutes,10);return a>=0&&60>a?a:void 0}function k(a){return angular.isDefined(a)&&a.toString().length<2?"0"+a:a}function l(a){m(),h.$setViewValue(new Date(p)),n(a)}function m(){h.$setValidity("time",!0),e.invalidHours=!1,e.invalidMinutes=!1}function n(a){var b=p.getHours(),c=p.getMinutes();e.showMeridian&&(b=0===b||12===b?12:b%12),e.hours="h"===a?b:k(b),e.minutes="m"===a?c:k(c),e.meridian=p.getHours()<12?q[0]:q[1]}function o(a){var b=new Date(p.getTime()+6e4*a);p.setHours(b.getHours(),b.getMinutes()),l()}if(h){var p=new Date,q=angular.isDefined(g.meridians)?e.$parent.$eval(g.meridians):c.meridians||d.DATETIME_FORMATS.AMPMS,r=c.hourStep;g.hourStep&&e.$parent.$watch(a(g.hourStep),function(a){r=parseInt(a,10)});var s=c.minuteStep;g.minuteStep&&e.$parent.$watch(a(g.minuteStep),function(a){s=parseInt(a,10)}),e.showMeridian=c.showMeridian,g.showMeridian&&e.$parent.$watch(a(g.showMeridian),function(a){if(e.showMeridian=!!a,h.$error.time){var b=i(),c=j();angular.isDefined(b)&&angular.isDefined(c)&&(p.setHours(b),l())}else n()});var t=f.find("input"),u=t.eq(0),v=t.eq(1),w=angular.isDefined(g.mousewheel)?e.$eval(g.mousewheel):c.mousewheel;if(w){var x=function(a){a.originalEvent&&(a=a.originalEvent);var b=a.wheelDelta?a.wheelDelta:-a.deltaY;return a.detail||b>0};u.bind("mousewheel wheel",function(a){e.$apply(x(a)?e.incrementHours():e.decrementHours()),a.preventDefault()}),v.bind("mousewheel wheel",function(a){e.$apply(x(a)?e.incrementMinutes():e.decrementMinutes()),a.preventDefault()})}if(e.readonlyInput=angular.isDefined(g.readonlyInput)?e.$eval(g.readonlyInput):c.readonlyInput,e.readonlyInput)e.updateHours=angular.noop,e.updateMinutes=angular.noop;else{var y=function(a,b){h.$setViewValue(null),h.$setValidity("time",!1),angular.isDefined(a)&&(e.invalidHours=a),angular.isDefined(b)&&(e.invalidMinutes=b)};e.updateHours=function(){var a=i();angular.isDefined(a)?(p.setHours(a),l("h")):y(!0)},u.bind("blur",function(){!e.validHours&&e.hours<10&&e.$apply(function(){e.hours=k(e.hours)})}),e.updateMinutes=function(){var a=j();angular.isDefined(a)?(p.setMinutes(a),l("m")):y(void 0,!0)},v.bind("blur",function(){!e.invalidMinutes&&e.minutes<10&&e.$apply(function(){e.minutes=k(e.minutes)})})}h.$render=function(){var a=h.$modelValue?new Date(h.$modelValue):null;isNaN(a)?(h.$setValidity("time",!1),b.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')):(a&&(p=a),m(),n())},e.incrementHours=function(){o(60*r)},e.decrementHours=function(){o(60*-r)},e.incrementMinutes=function(){o(s)},e.decrementMinutes=function(){o(-s)},e.toggleMeridian=function(){o(720*(p.getHours()<12?1:-1))}}}}}]),angular.module("ui.bootstrap.typeahead",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).factory("typeaheadParser",["$parse",function(a){var b=/^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;return{parse:function(c){var d=c.match(b);if(!d)throw new Error("Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_' but got '"+c+"'.");return{itemName:d[3],source:a(d[4]),viewMapper:a(d[2]||d[1]),modelMapper:a(d[1])}}}}]).directive("typeahead",["$compile","$parse","$q","$timeout","$document","$position","typeaheadParser",function(a,b,c,d,e,f,g){var h=[9,13,27,38,40];return{require:"ngModel",link:function(i,j,k,l){var m,n=i.$eval(k.typeaheadMinLength)||1,o=i.$eval(k.typeaheadWaitMs)||0,p=i.$eval(k.typeaheadEditable)!==!1,q=b(k.typeaheadLoading).assign||angular.noop,r=b(k.typeaheadOnSelect),s=k.typeaheadInputFormatter?b(k.typeaheadInputFormatter):void 0,t=k.typeaheadAppendToBody?b(k.typeaheadAppendToBody):!1,u=b(k.ngModel).assign,v=g.parse(k.typeahead),w=angular.element("<div typeahead-popup></div>");w.attr({matches:"matches",active:"activeIdx",select:"select(activeIdx)",query:"query",position:"position"}),angular.isDefined(k.typeaheadTemplateUrl)&&w.attr("template-url",k.typeaheadTemplateUrl);var x=i.$new();i.$on("$destroy",function(){x.$destroy()});var y=function(){x.matches=[],x.activeIdx=-1},z=function(a){var b={$viewValue:a};q(i,!0),c.when(v.source(i,b)).then(function(c){if(a===l.$viewValue&&m){if(c.length>0){x.activeIdx=0,x.matches.length=0;for(var d=0;d<c.length;d++)b[v.itemName]=c[d],x.matches.push({label:v.viewMapper(x,b),model:c[d]});x.query=a,x.position=t?f.offset(j):f.position(j),x.position.top=x.position.top+j.prop("offsetHeight")}else y();q(i,!1)}},function(){y(),q(i,!1)})};y(),x.query=void 0;var A;l.$parsers.unshift(function(a){return m=!0,a&&a.length>=n?o>0?(A&&d.cancel(A),A=d(function(){z(a)},o)):z(a):(q(i,!1),y()),p?a:a?(l.$setValidity("editable",!1),void 0):(l.$setValidity("editable",!0),a)}),l.$formatters.push(function(a){var b,c,d={};return s?(d.$model=a,s(i,d)):(d[v.itemName]=a,b=v.viewMapper(i,d),d[v.itemName]=void 0,c=v.viewMapper(i,d),b!==c?b:a)}),x.select=function(a){var b,c,d={};d[v.itemName]=c=x.matches[a].model,b=v.modelMapper(i,d),u(i,b),l.$setValidity("editable",!0),r(i,{$item:c,$model:b,$label:v.viewMapper(i,d)}),y(),j[0].focus()},j.bind("keydown",function(a){0!==x.matches.length&&-1!==h.indexOf(a.which)&&(a.preventDefault(),40===a.which?(x.activeIdx=(x.activeIdx+1)%x.matches.length,x.$digest()):38===a.which?(x.activeIdx=(x.activeIdx?x.activeIdx:x.matches.length)-1,x.$digest()):13===a.which||9===a.which?x.$apply(function(){x.select(x.activeIdx)}):27===a.which&&(a.stopPropagation(),y(),x.$digest()))}),j.bind("blur",function(){m=!1});var B=function(a){j[0]!==a.target&&(y(),x.$digest())};e.bind("click",B),i.$on("$destroy",function(){e.unbind("click",B)});var C=a(w)(x);t?e.find("body").append(C):j.after(C)}}}]).directive("typeaheadPopup",function(){return{restrict:"EA",scope:{matches:"=",query:"=",active:"=",position:"=",select:"&"},replace:!0,templateUrl:"template/typeahead/typeahead-popup.html",link:function(a,b,c){a.templateUrl=c.templateUrl,a.isOpen=function(){return a.matches.length>0},a.isActive=function(b){return a.active==b},a.selectActive=function(b){a.active=b},a.selectMatch=function(b){a.select({activeIdx:b})}}}}).directive("typeaheadMatch",["$http","$templateCache","$compile","$parse",function(a,b,c,d){return{restrict:"EA",scope:{index:"=",match:"=",query:"="},link:function(e,f,g){var h=d(g.templateUrl)(e.$parent)||"template/typeahead/typeahead-match.html";a.get(h,{cache:b}).success(function(a){f.replaceWith(c(a.trim())(e))})}}}]).filter("typeaheadHighlight",function(){function a(a){return a.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")}return function(b,c){return c?b.replace(new RegExp(a(c),"gi"),"<strong>$&</strong>"):b}}),angular.module("template/accordion/accordion-group.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion-group.html",'<div class="accordion-group">\n  <div class="accordion-heading" ><a class="accordion-toggle" ng-click="isOpen = !isOpen" accordion-transclude="heading">{{heading}}</a></div>\n  <div class="accordion-body" collapse="!isOpen">\n    <div class="accordion-inner" ng-transclude></div>  </div>\n</div>')}]),angular.module("template/accordion/accordion.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion.html",'<div class="accordion" ng-transclude></div>')}]),angular.module("template/alert/alert.html",[]).run(["$templateCache",function(a){a.put("template/alert/alert.html","<div class='alert' ng-class='type && \"alert-\" + type'>\n    <button ng-show='closeable' type='button' class='close' ng-click='close()'>&times;</button>\n    <div ng-transclude></div>\n</div>\n")}]),angular.module("template/carousel/carousel.html",[]).run(["$templateCache",function(a){a.put("template/carousel/carousel.html",'<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel">\n    <ol class="carousel-indicators" ng-show="slides().length > 1">\n        <li ng-repeat="slide in slides()" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a ng-click="prev()" class="carousel-control left" ng-show="slides().length > 1">&lsaquo;</a>\n    <a ng-click="next()" class="carousel-control right" ng-show="slides().length > 1">&rsaquo;</a>\n</div>\n')}]),angular.module("template/carousel/slide.html",[]).run(["$templateCache",function(a){a.put("template/carousel/slide.html","<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item\" ng-transclude></div>\n")}]),angular.module("template/datepicker/datepicker.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/datepicker.html",'<table>\n  <thead>\n    <tr class="text-center">\n      <th><button type="button" class="btn pull-left" ng-click="move(-1)"><i class="icon-chevron-left"></i></button></th>\n      <th colspan="{{rows[0].length - 2 + showWeekNumbers}}"><button type="button" class="btn btn-block" ng-click="toggleMode()"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn pull-right" ng-click="move(1)"><i class="icon-chevron-right"></i></button></th>\n    </tr>\n    <tr class="text-center" ng-show="labels.length > 0">\n      <th ng-show="showWeekNumbers">#</th>\n      <th ng-repeat="label in labels">{{label}}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows">\n      <td ng-show="showWeekNumbers" class="text-center"><em>{{ getWeekNumber(row) }}</em></td>\n      <td ng-repeat="dt in row" class="text-center">\n        <button type="button" style="width:100%;" class="btn" ng-class="{\'btn-info\': dt.selected}" ng-click="select(dt.date)" ng-disabled="dt.disabled"><span ng-class="{muted: dt.secondary}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/datepicker/popup.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/popup.html","<ul class=\"dropdown-menu\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\">\n	<li ng-transclude></li>\n"+'	<li ng-show="showButtonBar" style="padding:10px 9px 2px">\n		<span class="btn-group">\n			<button type="button" class="btn btn-small btn-inverse" ng-click="today()">{{currentText}}</button>\n			<button type="button" class="btn btn-small btn-info" ng-click="showWeeks = ! showWeeks" ng-class="{active: showWeeks}">{{toggleWeeksText}}</button>\n			<button type="button" class="btn btn-small btn-danger" ng-click="clear()">{{clearText}}</button>\n		</span>\n		<button type="button" class="btn btn-small btn-success pull-right" ng-click="isOpen = false">{{closeText}}</button>\n	</li>\n</ul>\n')}]),angular.module("template/modal/backdrop.html",[]).run(["$templateCache",function(a){a.put("template/modal/backdrop.html",'<div class="modal-backdrop fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1040 + index*10}" ng-click="close($event)"></div>')}]),angular.module("template/modal/window.html",[]).run(["$templateCache",function(a){a.put("template/modal/window.html",'<div tabindex="-1" class="modal fade {{ windowClass }}" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10}" ng-transclude></div>')}]),angular.module("template/pagination/pager.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pager.html",'<div class="pager">\n  <ul>\n    <li ng-repeat="page in pages" ng-class="{disabled: page.disabled, previous: page.previous, next: page.next}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  </ul>\n</div>\n')}]),angular.module("template/pagination/pagination.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pagination.html",'<div class="pagination"><ul>\n  <li ng-repeat="page in pages" ng-class="{active: page.active, disabled: page.disabled}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  </ul>\n</div>\n')}]),angular.module("template/tooltip/tooltip-html-unsafe-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-html-unsafe-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n')}]),angular.module("template/tooltip/tooltip-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')}]),angular.module("template/popover/popover.html",[]).run(["$templateCache",function(a){a.put("template/popover/popover.html",'<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')}]),angular.module("template/progressbar/bar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/bar.html",'<div class="bar" ng-class="type && \'bar-\' + type" ng-transclude></div>')}]),angular.module("template/progressbar/progress.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progress.html",'<div class="progress" ng-transclude></div>')}]),angular.module("template/progressbar/progressbar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progressbar.html",'<div class="progress"><div class="bar" ng-class="type && \'bar-\' + type" ng-transclude></div></div>')}]),angular.module("template/rating/rating.html",[]).run(["$templateCache",function(a){a.put("template/rating/rating.html",'<span ng-mouseleave="reset()">\n	<i ng-repeat="r in range" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" ng-class="$index < val && (r.stateOn || \'icon-star\') || (r.stateOff || \'icon-star-empty\')"></i>\n</span>')}]),angular.module("template/tabs/tab.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tab.html",'<li ng-class="{active: active, disabled: disabled}">\n  <a ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')}]),angular.module("template/tabs/tabset-titles.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tabset-titles.html","<ul class=\"nav {{type && 'nav-' + type}}\" ng-class=\"{'nav-stacked': vertical}\">\n</ul>\n")}]),angular.module("template/tabs/tabset.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tabset.html",'\n<div class="tabbable">\n  <ul class="nav {{type && \'nav-\' + type}}" ng-class="{\'nav-stacked\': vertical}" ng-transclude>\n  </ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')}]),angular.module("template/timepicker/timepicker.html",[]).run(["$templateCache",function(a){a.put("template/timepicker/timepicker.html",'<table class="form-inline">\n	<tr class="text-center">\n		<td><a ng-click="incrementHours()" class="btn btn-link"><i class="icon-chevron-up"></i></a></td>\n		<td>&nbsp;</td>\n		<td><a ng-click="incrementMinutes()" class="btn btn-link"><i class="icon-chevron-up"></i></a></td>\n		<td ng-show="showMeridian"></td>\n	</tr>\n	<tr>\n		<td class="control-group" ng-class="{\'error\': invalidHours}"><input type="text" ng-model="hours" ng-change="updateHours()" class="span1 text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2"></td>\n		<td>:</td>\n		<td class="control-group" ng-class="{\'error\': invalidMinutes}"><input type="text" ng-model="minutes" ng-change="updateMinutes()" class="span1 text-center" ng-readonly="readonlyInput" maxlength="2"></td>\n		<td ng-show="showMeridian"><button type="button" ng-click="toggleMeridian()" class="btn text-center">{{meridian}}</button></td>\n	</tr>\n	<tr class="text-center">\n		<td><a ng-click="decrementHours()" class="btn btn-link"><i class="icon-chevron-down"></i></a></td>\n		<td>&nbsp;</td>\n		<td><a ng-click="decrementMinutes()" class="btn btn-link"><i class="icon-chevron-down"></i></a></td>\n		<td ng-show="showMeridian"></td>\n	</tr>\n</table>\n')}]),angular.module("template/typeahead/typeahead-match.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-match.html",'<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>')}]),angular.module("template/typeahead/typeahead-popup.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-popup.html","<ul class=\"typeahead dropdown-menu\" ng-style=\"{display: isOpen()&&'block' || 'none', top: position.top+'px', left: position.left+'px'}\">\n"+'    <li ng-repeat="match in matches" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>')}]);;'use strict';
angular.module('easyApp')
  .factory('cookie',['$cookieStore', function ($cookieStore) {
    // Service logic
    // ...

    var map =$cookieStore.get('map');

    // Public API here
    return {
      getTheme:getTh,
      setTheme:setTh,
      getMap: get,
      setMap: set,
      getLang: getLang,
      setLang: setLang
    };

        function get(){
            if(!map){
            //    $cookies.map = 0;
                $cookieStore.put('map', 0);
                map = 0;
            }
            return map;
        };

        function set(i){
            $cookieStore.put('map', i);
            map = i;
        };


        function getLang(){
            if($cookieStore.get('lang') != 0 && $cookieStore.get('lang') != 1){
                $cookieStore.put('lang', 1);
            }

            return  $cookieStore.get('lang');
        }

        function setLang(lang){

            $cookieStore.put('lang',lang);
        }

        function getTh(){
            if(!angular.isNumber($cookieStore.get('theme'))){
                $cookieStore.put('theme', 0);
            }

            return  $cookieStore.get('theme');
        }

        function setTh(th){
            $cookieStore.put('theme',th);
        }
  }]);
;'use strict';

angular.module('easyApp')
  .constant('Language', {
        common:{
            req:["The required input",'这是必填项'],
            back:['Back',"返回"],
            sear : ['Search','查询'],
			reflesh : ['Reflesh','刷新'],
            submit:['submit',"提交记录"]
        },
        train:{
            title : ["Train query",'火车时刻表'],
	        buyTick : ["Go to buy",'购买车票'],
	        des_error : ["Please fill the start city or target city",'请填上出发城市或目标城市'],
	        time_error : ["Pleae fill the date",'请选择相应的出发日期'],
	        sCity : ["Start City",'请输入出发点城市'],
	        eCity : ["Target City",'请输入结束城市'],
            no : ["Train number",'列车号'],
            route : ["Route",'线路'],
            time : ["Start and arrivel time",'出发与到达时间'],
            duration : ["Duration",'经历时长'],
            buss : ["Business site",'商务座'],
            spec : ["Special site",'特等座'],
            firstClass : ["First Class site",'一等座'],
            secondClass : ["Second Class site",'二等座'],
            highClass : ["High Class Soft sleeper",'高级软卧'],
            softBed : ["Soft sleeper",'软卧'],
            hardBed : ["Hard sleeper",'硬卧'],
            softSit : ["Soft Site",'软座'],
            hardSit : ["Hard Site",'硬座'],
            noSit : ["No Site",'无座'],
            other : ["Other",'其它'],
            remark : ["Remark",'备注']
        },
        zhibo:{
            title : ["sports live show",'体育直播表'],
            time : ["time",'直播时间'],
            ls : ["Early Morning",'凌晨'],
            day : ["DayTime",'白天'],
            night : ["NightTime",'晚上'],
	        address : ["Live Address",'直播地址'],
            content : ["match",'赛事']
        },
        bus:{
            title : ["GuangZhou bus",'广州实时公交'],
            totalStop : ["The total stops:",'全程公车站数为:'],
            busNumber : ["Amount of bus",'公交数量'],
            errorBus : ['The Bus number is wrong,Please fill another Bus number.', '对不起，你输入的名字错误或是暂时没有数据，请重新输入.'],
            placeholderBus : ["Please enter the bus number","请输入公交车代号"]
        },
        weather:{
            highTem: ['Highest Temperature','最高温度'],
            lowTem: ['Lowest Temperature','最低温度'],
            title:["Whether forcast",'天气查询'] ,
            placeholderCity: ["Please enter the city","请输入城市名称"],
            cityName : ['City Name:', '城市名称'],
            errorCity : ['The City name is wrong,Please fill another city name.', '输入的城市或省名字错误，请重新输入.']
        },
		service:{
			bus:["GuangZhou RealTime bus",'广州实时公交'],
			func:['Function','功能'],
			weather:['Weather','天气查询'],
			zhibo:['Sports Show','体育赛事表'],
			train:['Train query','火车时刻查询表']
		},
        main:{
	        service:['Index','功能列表']
	        ,aboutMe:['About Me','关于我们']
	        ,advice:['Give Advice','给建议']
	        ,login:['Login','登录']
            ,theme:["Change Theme/Skin",'切换主题'],
            bus:["GuangZhou RealTime bus",'广州实时公交'],
            langTitle:["Switch Language",'切换语言'],
            ch:['Chinese',"中文"],
            en:['English',"英文"],
            cerulean:['Cerulean',"简洁"],
            classic:['Classic','经典'],
            slate:["Slate",'黑夜'],
            func:['Function','功能'],
            weather:['Weather','天气查询'],
            sportLive:['Sports Show','体育赛事表'],
            train:['Train query','火车时刻查询表']
        }

    });
;'use strict';
angular.module('easyApp')
	.factory('stationName', function () {
		// Service logic
		// ...

		var station_names ='@bjb|北京北|VAP|beijingbei|bjb|0@bjd|北京东|BOP|beijingdong|bjd|1@bji|北京|BJP|beijing|bj|2@bjn|北京南|VNP|beijingnan|bjn|3@bjx|北京西|BXP|beijingxi|bjx|4@gzn|广州南|IZQ|guangzhounan|gzn|5@cqb|重庆北|CUW|chongqingbei|cqb|6@cqi|重庆|CQW|chongqing|cq|7@cqn|重庆南|CRW|chongqingnan|cqn|8@gzd|广州东|GGQ|guangzhoudong|gzd|9@sha|上海|SHH|shanghai|sh|10@shn|上海南|SNH|shanghainan|shn|11@shq|上海虹桥|AOH|shanghaihongqiao|shhq|12@shx|上海西|SXH|shanghaixi|shx|13@tjb|天津北|TBP|tianjinbei|tjb|14@tji|天津|TJP|tianjin|tj|15@tjn|天津南|TIP|tianjinnan|tjn|16@tjx|天津西|TXP|tianjinxi|tjx|17@cch|长春|CCT|changchun|cc|18@ccn|长春南|CET|changchunnan|ccn|19@ccx|长春西|CRT|changchunxi|ccx|20@cdd|成都东|ICW|chengdudong|cdd|21@cdn|成都南|CNW|chengdunan|cdn|22@cdu|成都|CDW|chengdu|cd|23@csh|长沙|CSQ|changsha|cs|24@csn|长沙南|CWQ|changshanan|csn|25@fzh|福州|FZS|fuzhou|fz|26@fzn|福州南|FYS|fuzhounan|fzn|27@gya|贵阳|GIW|guiyang|gy|28@gzh|广州|GZQ|guangzhou|gz|29@gzx|广州西|GXQ|guangzhouxi|gzx|30@heb|哈尔滨|HBB|haerbin|heb|31@hed|哈尔滨东|VBB|harbindong|hebd|32@hex|哈尔滨西|VAB|haerbinxi|hebx|33@hfe|合肥|HFH|hefei|hf|34@hhd|呼和浩特东|NDC|huhehaotedong|hhhtd|35@hht|呼和浩特|HHC|hohhot|hhht|36@hkd|海口东|HMQ|haikoudong|hkd|37@hko|海口|VUQ|haikou|hk|38@hzd|杭州东|HGH|hangzhoudong|hzd|39@hzh|杭州|HZH|hangzhou|hz|40@hzn|杭州南|XHH|hangzhounan|hzn|41@jna|济南|JNK|jinan|jn|42@jnd|济南东|JAK|jinandong|jnd|43@jnx|济南西|JGK|jinanxi|jnx|44@kmi|昆明|KMM|kunming|km|45@kmx|昆明西|KXM|kunmingxi|kmx|46@lsa|拉萨|LSO|lasa|ls|47@lzd|兰州东|LVJ|lanzhoudong|lzd|48@lzh|兰州|LZJ|lanzhou|lz|49@lzx|兰州西|LAJ|lanzhouxi|lzx|50@nch|南昌|NCG|nanchang|nc|51@nji|南京|NJH|nanjing|nj|52@njn|南京南|NKH|nanjingnan|njn|53@nni|南宁|NNZ|nanning|nn|54@sjb|石家庄北|VVP|shijiazhuangbei|sjzb|55@sjz|石家庄|SJP|shijiazhuang|sjz|56@sya|沈阳|SYT|shenyang|sy|57@syb|沈阳北|SBT|shenyangbei|syb|58@syd|沈阳东|SDT|shenyangdong|syd|59@tyb|太原北|TBV|taiyuanbei|tyb|60@tyd|太原东|TDV|taiyuandong|tyd|61@tyu|太原|TYV|taiyuan|ty|62@wha|武汉|WHN|wuhan|wh|63@wjx|王家营西|KNM|wangjiayingxi|wjyx|64@wlq|乌鲁木齐|WMR|wulumuqi|wlmq|65@xab|西安北|EAY|xianbei|xab|66@xan|西安南|CAY|xiannan|xan|67@xan|西安|XAY|xian|xa|68@xnx|西宁西|XXO|xiningxi|xnx|69@ych|银川|YIJ|yinchuan|yc|70@zzh|郑州|ZZF|zhengzhou|zz|71@aes|阿尔山|ART|aershan|aes|72@aka|安康|AKY|ankang|ak|73@aks|阿克苏|ASR|akesu|aks|74@alh|阿里河|AHX|alihe|alh|75@alk|阿拉山口|AKR|alashankou|alsk|76@api|安平|APT|anping|ap|77@aqi|安庆|AQH|anqing|aq|78@ash|鞍山|AST|anshan|as|79@ash|安顺|ASW|anshun|as|80@aya|安阳|AYF|anyang|ay|81@ban|北安|BAB|beian|ba|82@bbu|蚌埠|BBH|bengbu|bb|83@bch|白城|BCT|baicheng|bc|84@bha|北海|BHZ|beihai|bh|85@bhe|白河|BEL|baihe|bh|86@bji|滨江|BJB|binjiang|bj|87@bji|宝鸡|BJY|baoji|bj|88@bji|白涧|BAP|baijian|bj|89@bkt|博克图|BKX|bugt|bkt|90@bse|百色|BIZ|baise|bs|91@bss|白山市|HJL|baishanshi|bss|92@bta|北台|BTT|beitai|bt|93@btd|包头东|BDC|baotoudong|btd|94@bto|包头|BTC|baotou|bt|95@bts|北屯市|BXR|beitunshi|bts|96@bxi|本溪|BXT|benxi|bx|97@byb|白云鄂博|BEC|bayanobo|byeb|98@byx|白银西|BXJ|baiyinxi|byx|99@bzh|亳州|BZH|bozhou|bz|100@cbi|赤壁|CBN|chibi|cb|101@cde|承德|CDP|chengde|cd|102@cde|常德|VGQ|changde|cd|103@cdi|长甸|CDT|changdian|cd|104@cfe|赤峰|CFD|chifeng|cf|105@cli|茶陵|CDG|chaling|cl|106@cna|苍南|CEH|cangnan|cn|107@cpi|昌平|CPP|changping|cp|108@cre|崇仁|CRG|chongren|cr|109@ctu|昌图|CTT|changtu|ct|110@ctz|长汀镇|CDB|changtingzhen|ctz|111@cxi|楚雄|COM|chuxiong|cx|112@cxi|曹县|CXK|caoxian|cx|113@cxt|陈相屯|CXT|chenxiangtun|cxt|114@czb|长治北|CBF|changzhibei|czb|115@czh|沧州|COP|cangzhou|cz|116@czh|长治|CZF|changzhi|cz|117@czh|郴州|CZQ|chenzhou|cz|118@czh|常州|CZH|changzhou|cz|119@czh|池州|IYH|chizhou|cz|120@czh|长征|CZJ|changzheng|cz|121@czu|崇左|CZZ|chongzuo|cz|122@dab|大安北|RNT|daanbei|dab|123@dch|大成|DCT|dacheng|dc|124@ddo|丹东|DUT|dandong|dd|125@dfh|东方红|DFB|dongfanghong|dfh|126@dgd|东莞东|DMQ|dongguandong|dgd|127@dhs|大虎山|DHD|dahushan|dhs|128@dhu|德惠|DHT|dehui|dh|129@dhu|敦化|DHL|dunhua|dh|130@dhu|敦煌|DHJ|dunhuang|dh|131@djc|东京城|DJB|dongjingcheng|djc|132@dji|大涧|DFP|dajian|dj|133@djy|都江堰|DDW|dujiangyan|djy|134@dlb|大连北|DFT|dalianbei|dlb|135@dli|大连|DLT|dalian|dl|136@dli|大理|DKM|dali|dl|137@dna|定南|DNG|dingnan|dn|138@dqi|大庆|DZX|daqing|dq|139@dsh|东胜|DOC|dongsheng|ds|140@dsq|大石桥|DQT|dashiqiao|dsq|141@dto|大同|DTV|datong|dt|142@dyi|东营|DPK|dongying|dy|143@dys|大杨树|DUX|dayangshu|dys|144@dyu|都匀|RYW|duyun|dy|145@dzh|德州|DZP|dezhou|dz|146@dzh|达州|RXW|dazhou|dz|147@dzh|邓州|DOF|dengzhou|dz|148@ejn|额济纳|EJC|ejina|ejn|149@eli|二连|RLC|erlian|el|150@esh|恩施|ESN|enshi|es|151@fdi|福鼎|FES|fuding|fd|152@fld|风陵渡|FLV|fenglingdu|fld|153@fli|涪陵|FLW|fuling|fl|154@flj|富拉尔基|FRX|fulaerji|flej|155@fsb|抚顺北|FET|fushunbei|fsb|156@fsh|佛山|FSQ|foshan|fs|157@fxi|阜新|FXD|fuxin|fx|158@fya|阜阳|FYH|fuyang|fy|159@gem|格尔木|GRO|geermu|gem|160@gha|广汉|GHW|guanghan|gh|161@gji|古交|GJV|gujiao|gj|162@glb|桂林北|GBZ|guilinbei|glb|163@gli|桂林|GLZ|guilin|gl|164@gli|古莲|GRX|gulian|gl|165@gsh|广水|GSN|guangshui|gs|166@gsh|固始|GXN|gushi|gs|167@gta|干塘|GNJ|gantang|gt|168@gyu|广元|GYW|guangyuan|gy|169@gzb|广州北|GBQ|guangzhoubei|gzb|170@gzh|赣州|GZG|ganzhou|gz|171@gzl|公主岭|GLT|gongzhuling|gzl|172@gzn|公主岭南|GBT|gongzhulingnan|gzln|173@han|淮安|AUH|huaian|ha|174@hbe|淮北|HRH|huaibei|hb|175@hbe|鹤北|HMB|hebei|hb|176@hbi|河边|HBV|hebian|hb|177@hbi|淮滨|HVN|huaibin|hb|178@hch|韩城|HCY|hancheng|hc|179@hch|潢川|KCN|huangchuan|hc|180@hda|邯郸|HDP|handan|hd|181@hdz|横道河子|HDB|hengdaohezi|hdhz|182@hga|鹤岗|HGB|hegang|hg|183@hgt|皇姑屯|HTT|huanggutun|hgt|184@hgu|红果|HEM|hongguo|hg|185@hhe|黑河|HJB|heihe|hh|186@hhu|怀化|HHQ|huaihua|hh|187@hko|汉口|HKN|hankou|hk|188@hld|葫芦岛|HLD|huludao|hld|189@hle|海拉尔|HRX|hailaer|hle|190@hll|霍林郭勒|HWD|huolinguole|hlgl|191@hlu|海伦|HLB|hailun|hl|192@hma|侯马|HMV|houma|hm|193@hmi|哈密|HMR|hami|hm|194@hna|桦南|HNB|huanan|hn|195@hna|淮南|HAH|huainan|hn|196@hnx|海宁西|EUH|hainingxi|hnx|197@hqi|鹤庆|HQM|heqing|hq|198@hrb|怀柔北|HBP|huairoubei|hrb|199@hro|怀柔|HRP|huairou|hr|200@hsd|黄石东|OSN|huangshidong|hsd|201@hsh|衡水|HSP|hengshui|hs|202@hsh|黄山|HKH|huangshan|hs|203@hsh|黄石|HSN|huangshi|hs|204@hsh|华山|HSY|huashan|hs|205@hya|衡阳|HYQ|hengyang|hy|206@hze|菏泽|HIK|heze|hz|207@hzh|惠州|HCQ|huizhou|hz|208@hzh|汉中|HOY|hanzhong|hz|209@hzh|贺州|HXZ|hezhou|hz|210@jan|集安|JAL|jian|ja|211@jan|吉安|VAG|jian|ja|212@jbc|江边村|JBG|jiangbiancun|jbc|213@jch|晋城|JCF|jincheng|jc|214@jcj|金城江|JJZ|jinchengjiang|jcj|215@jdz|景德镇|JCG|jingdezhen|jdz|216@jfe|嘉峰|JFF|jiafeng|jf|217@jgq|加格达奇|JGX|jagdaqi|jgdq|218@jgs|井冈山|JGG|jinggangshan|jgs|219@jhe|蛟河|JHL|jiaohe|jh|220@jhn|金华南|RNH|jinhuanan|jhn|221@jhx|金华西|JBH|jinhuaxi|jhx|222@jji|九江|JJG|jiujiang|jj|223@jli|吉林|JLL|jilin|jl|224@jme|荆门|JMN|jingmen|jm|225@jms|佳木斯|JMB|jiamusi|jms|226@jni|济宁|JIK|jining|jn|227@jnn|集宁南|JAC|jiningnan|jnn|228@jqu|酒泉|JQJ|jiuquan|jq|229@jsh|吉首|JIQ|jishou|js|230@jsh|江山|JUH|jiangshan|js|231@jta|九台|JTL|jiutai|jt|232@jts|镜铁山|JVJ|jingtieshan|jts|233@jxi|蓟县|JKP|jixian|jx|234@jxi|鸡西|JXB|jixi|jx|235@jxx|绩溪县|JRH|jixixian|jxx|236@jyg|嘉峪关|JGJ|jiayuguan|jyg|237@jyo|江油|JFW|jiangyou|jy|238@jzh|金州|JZT|jinzhou|jz|239@jzh|锦州|JZD|jinzhou|jz|240@kel|库尔勒|KLR|kuerle|kel|241@kfe|开封|KFF|kaifeng|kf|242@kla|岢岚|KLV|kelan|kl|243@kli|凯里|KLW|kaili|kl|244@ksh|喀什|KSR|kashi|ks|245@ksn|昆山南|KNH|kunshannan|ksn|246@ktu|奎屯|KTR|kuitun|kt|247@kyu|开原|KYT|kaiyuan|ky|248@lan|六安|UAH|luan|la|249@lba|灵宝|LBF|lingbao|lb|250@lcg|芦潮港|UCH|luchaogang|lcg|251@lch|潞城|UTP|lucheng|lc|252@lch|临川|LCG|linchuan|lc|253@lch|利川|LCN|lichuan|lc|254@lch|陆川|LKZ|luchuan|lc|255@lch|隆昌|LCW|longchang|lc|256@lda|鹿道|LDL|ludao|ld|257@ldi|娄底|LDQ|loudi|ld|258@lfe|临汾|LFV|linfen|lf|259@lgz|良各庄|LGP|lianggezhuang|lgz|260@lhe|漯河|LON|luohe|lh|261@lhe|临河|LHC|linhe|lh|262@lhu|隆化|UHP|longhua|lh|263@lhu|绿化|LWJ|lvhua|lh|264@lji|龙井|LJL|longjing|lj|265@lji|临江|LQL|linjiang|lj|266@lji|丽江|LHM|lijiang|lj|267@lli|醴陵|LLG|liling|ll|268@lli|吕梁|LHV|lvliang|ll|269@lln|柳林南|LKV|liulinnan|lln|270@lpi|滦平|UPP|luanping|lp|271@lps|六盘水|UMW|liupanshui|lps|272@lqi|灵丘|LVV|lingqiu|lq|273@lsh|旅顺|LST|lvshun|ls|274@lxi|临西|UEP|linxi|lx|275@lxi|兰溪|LWH|lanxi|lx|276@lxi|澧县|LEQ|lixian|lx|277@lxi|陇西|LXJ|longxi|lx|278@lya|龙岩|LYS|longyan|ly|279@lya|洛阳|LYF|luoyang|ly|280@lya|耒阳|LYQ|leiyang|ly|281@lyd|连云港东|UKH|lianyungangdong|lygd|282@lyd|洛阳东|LDF|luoyangdong|lyd|283@lyi|临沂|LVK|linyi|ly|284@lym|洛阳龙门|LLF|luoyanglongmen|lylm|285@lyu|辽源|LYL|liaoyuan|ly|286@lyu|凌源|LYD|lingyuan|ly|287@lyu|柳园|DHR|liuyuan|ly|288@lzh|辽中|LZD|liaozhong|lz|289@lzh|柳州|LZZ|liuzhou|lz|290@lzh|立志|LZX|lizhi|lz|291@mch|麻城|MCN|macheng|mc|292@mdh|免渡河|MDX|mianduhe|mdh|293@mdj|牡丹江|MDB|mudanjiang|mdj|294@meg|莫尔道嘎|MRX|mordaga|medg|295@mgu|明光|MGH|mingguang|mg|296@mgu|满归|MHX|mangui|mg|297@mhe|漠河|MVX|mohe|mh|298@mji|梅江|MKQ|meijiang|mj|299@mmd|茂名东|MDQ|maomingdong|mmd|300@mmi|茂名|MMZ|maoming|mm|301@msh|密山|MSB|mishan|ms|302@msj|马三家|MJT|masanjia|msj|303@mwe|麻尾|VAW|mawei|mw|304@mya|绵阳|MYW|mianyang|my|305@mzh|梅州|MOQ|meizhou|mz|306@mzl|满洲里|MLX|manzhouli|mzl|307@nbd|宁波东|NVH|ningbodong|nbd|308@nbo|宁波|NGH|ningbo|nb|309@nch|南充|NCW|nanchong|nc|310@nch|南岔|NCB|nancha|nc|311@nda|南丹|NDZ|nandan|nd|312@ndm|南大庙|NMP|nandamiao|ndm|313@nfe|南芬|NFT|nanfen|nf|314@nhe|讷河|NHX|nehe|nh|315@nji|内江|NJW|neijiang|nj|316@nji|嫩江|NGX|nenjiang|nj|317@npi|南平|NPS|nanping|np|318@nto|南通|NUH|nantong|nt|319@nya|南阳|NFF|nanyang|ny|320@nzs|碾子山|NZX|nianzishan|nzs|321@pds|平顶山|PEN|pingdingshan|pds|322@pji|盘锦|PVD|panjin|pj|323@pli|平凉|PIJ|pingliang|pl|324@pln|平凉南|POJ|pingliangnan|pln|325@pqu|平泉|PQP|pingquan|pq|326@psh|坪石|PSQ|pingshi|ps|327@pxi|凭祥|PXZ|pingxiang|px|328@pxi|萍乡|PXG|pingxiang|px|329@pxx|郫县西|PCW|pixianxi|pxx|330@pzh|攀枝花|PRW|panzhihua|pzh|331@qch|蕲春|QRN|qichun|qc|332@qcs|青城山|QSW|qingchengshan|qcs|333@qda|青岛|QDK|qingdao|qd|334@qhc|清河城|QYP|qinghecheng|qhc|335@qji|曲靖|QJM|qujing|qj|336@qji|黔江|QNW|qianjiang|qj|337@qjz|前进镇|QEB|qianjinzhen|qjz|338@qqe|齐齐哈尔|QHX|qiqihaer|qqhe|339@qth|七台河|QTB|qitaihe|qth|340@qxi|沁县|QVV|qinxian|qx|341@qzd|泉州东|QRS|quanzhoudong|qzd|342@qzh|衢州|QEH|quzhou|qz|343@qzh|泉州|QYS|quanzhou|qz|344@ran|融安|RAZ|rongan|ra|345@rjg|汝箕沟|RQJ|rujigou|rqg|346@rji|瑞金|RJG|ruijin|rj|347@rzh|日照|RZK|rizhao|rz|348@scp|双城堡|SCB|shuangchengpu|scb|349@sfh|绥芬河|SFB|suifenhe|sfh|350@sgd|韶关东|SGQ|shaoguandong|sgd|351@shg|山海关|SHD|shanhaiguan|shg|352@shu|绥化|SHB|suihua|sh|353@sjf|三间房|SFX|sanjianfang|sjf|354@sjt|苏家屯|SXT|sujiatun|sjt|355@sla|舒兰|SLL|shulan|sl|356@smi|三明|SMS|sanming|sm|357@smu|神木|OMY|shenmu|sm|358@smx|三门峡|SMF|sanmenxia|smx|359@sna|商南|ONY|shangnan|sn|360@sni|遂宁|NIW|suining|sn|361@spi|四平|SPT|siping|sp|362@sqi|商丘|SQF|shangqiu|sq|363@sra|上饶|SRG|shangrao|sr|364@ssh|韶山|SSQ|shaoshan|ss|365@sso|宿松|OAH|susong|ss|366@sto|汕头|OTQ|shantou|st|367@swu|邵武|SWS|shaowu|sw|368@sxi|涉县|OEP|shexian|sx|369@sya|十堰|SNN|shiyan|sy|370@sya|邵阳|SYQ|shaoyang|sy|371@sya|三亚|SEQ|sanya|sy|372@sys|双鸭山|SSB|shuangyashan|sys|373@syu|松原|VYT|songyuan|sy|374@szh|朔州|SUV|shuozhou|sz|375@szh|宿州|OXH|suzhou|sz|376@szh|随州|SZN|suizhou|sz|377@szh|苏州|SZH|suzhou|sz|378@szh|深圳|SZQ|shenzhen|sz|379@szx|深圳西|OSQ|shenzhenxi|szx|380@tba|塘豹|TBQ|tangbao|tb|381@teq|塔尔气|TVX|tarqi|teq|382@tgu|塘沽|TGP|tanggu|tg|383@tgu|潼关|TGY|tongguan|tg|384@the|塔河|TXX|tahe|th|385@thu|通化|THL|tonghua|th|386@tla|泰来|TLX|tailai|tl|387@tlf|吐鲁番|TFR|tulufan|tlf|388@tli|铁岭|TLT|tieling|tl|389@tli|通辽|TLD|tongliao|tl|390@tlz|陶赖昭|TPT|taolaizhao|tlz|391@tme|图们|TML|tumen|tm|392@tre|铜仁|RDQ|tongren|tr|393@tsb|唐山北|FUP|tangshanbei|tsb|394@tsf|田师府|TFT|tianshifu|tsf|395@tsh|天水|TSJ|tianshui|ts|396@tsh|唐山|TSP|tangshan|ts|397@tsh|泰山|TAK|taishan|ts|398@typ|通远堡|TYT|tongyuanpu|tyb|399@tys|太阳升|TQT|taiyangsheng|tys|400@tzh|泰州|UTH|taizhou|tz|401@tzi|桐梓|TZW|tongzi|tz|402@tzx|通州西|TAP|tongzhouxi|tzx|403@wch|武昌|WCN|wuchang|wc|404@wch|五常|WCB|wuchang|wc|405@wfd|瓦房店|WDT|wafangdian|wfd|406@wha|威海|WKK|weihai|wh|407@whu|芜湖|WHH|wuhu|wh|408@whx|乌海西|WXC|wuhaixi|whx|409@wjt|吴家屯|WJT|wujiatun|wjt|410@wlo|武隆|WLW|wulong|wl|411@wlt|乌兰浩特|WWT|ulanhot|wlht|412@wna|渭南|WNY|weinan|wn|413@wsh|威舍|WSM|weishe|ws|414@wts|歪头山|WIT|waitoushan|wts|415@wwe|武威|WUJ|wuwei|ww|416@wwn|武威南|WWJ|wuweinan|wwn|417@wxi|乌西|WXR|wuxi|wx|418@wxi|无锡|WXH|wuxi|wx|419@wyl|乌伊岭|WPB|wuyiling|wyl|420@wys|武夷山|WAS|wuyishan|wys|421@wyu|万源|WYY|wanyuan|wy|422@wzh|温州|RZH|wenzhou|wz|423@wzh|梧州|WZZ|wuzhou|wz|424@wzh|万州|WYW|wanzhou|wz|425@wzn|温州南|VRH|wenzhounan|wzn|426@xch|许昌|XCF|xuchang|xc|427@xch|西昌|ECW|xichang|xc|428@xcn|西昌南|ENW|xichangnan|xcn|429@xfa|香坊|XFB|xiangfang|xf|430@xga|轩岗|XGV|xuangang|xg|431@xgu|兴国|EUG|xingguo|xg|432@xha|宣汉|XHY|xuanhan|xh|433@xhu|新晃|XLQ|xinhuang|xh|434@xhu|新会|EFQ|xinhui|xh|435@xlt|锡林浩特|XTC|xilinhaote|xlht|436@xlx|兴隆县|EXP|xinglongxian|xlx|437@xmb|厦门北|XKS|xiamenbei|xmb|438@xme|厦门|XMS|xiamen|xm|439@xmq|厦门高崎|XBS|xiamengaoqi|xmgq|440@xsh|小市|XST|xiaoshi|xs|441@xsh|秀山|ETW|xiushan|xs|442@xta|向塘|XTG|xiangtang|xt|443@xwe|宣威|XWM|xuanwei|xw|444@xxi|新乡|XXF|xinxiang|xx|445@xya|襄阳|XFN|xiangyang|xy|446@xya|咸阳|XYY|xianyang|xy|447@xya|信阳|XUN|xinyang|xy|448@xyc|熊岳城|XYT|xiongyuecheng|xyc|449@xyi|新沂|VIH|xinyi|xy|450@xyi|兴义|XRZ|xingyi|xy|451@xyu|新余|XUG|xinyu|xy|452@xzh|徐州|XCH|xuzhou|xz|453@yan|延安|YWY|yanan|ya|454@ybi|宜宾|YBW|yibin|yb|455@ybn|亚布力南|YWB|yabulinan|ybln|456@ybs|叶柏寿|YBD|yebaishou|ybs|457@ycd|宜昌东|HAN|yichangdong|ycd|458@ych|伊春|YCB|yichun|yc|459@ych|运城|YNV|yuncheng|yc|460@ych|盐城|AFH|yancheng|yc|461@ych|宜昌|YCN|yichang|yc|462@ych|宜春|YCG|yichun|yc|463@ych|永川|YCW|yongchuan|yc|464@yci|榆次|YCV|yuci|yc|465@ycu|杨村|YBP|yangcun|yc|466@yes|伊尔施|YET|yirshi|yes|467@yga|燕岗|YGW|yangang|yg|468@yji|延吉|YJL|yanji|yj|469@yji|永济|YIV|yongji|yj|470@yko|营口|YKT|yingkou|yk|471@yks|牙克石|YKX|yakeshi|yks|472@yli|榆林|ALY|yulin|yl|473@yli|玉林|YLZ|yulin|yl|474@yli|阎良|YNY|yanliang|yl|475@ymp|一面坡|YPB|yimianpo|ymp|476@yni|伊宁|YMR|yining|yn|477@ypg|阳平关|YAY|yangpingguan|ypg|478@ypi|原平|YPV|yuanping|yp|479@ypi|玉屏|YZW|yuping|yp|480@yqi|延庆|YNP|yanqing|yq|481@yqq|阳泉曲|YYV|yangquanqu|yqq|482@yqu|阳泉|AQP|yangquan|yq|483@yqu|玉泉|YQB|yuquan|yq|484@ysh|榆树|YRT|yushu|ys|485@ysh|燕山|AOP|yanshan|ys|486@ysh|营山|NUW|yingshan|ys|487@ysh|玉山|YNG|yushan|ys|488@yta|烟台|YAK|yantai|yt|489@yta|鹰潭|YTG|yingtan|yt|490@yth|伊图里河|YEX|yitulihe|ytlh|491@ytx|玉田县|ATP|yutianxian|ytx|492@ywu|义乌|YWH|yiwu|yw|493@yxi|义县|YXD|yixian|yx|494@yxi|阳新|YON|yangxin|yx|495@yya|岳阳|YYQ|yueyang|yy|496@yya|益阳|AEQ|yiyang|yy|497@yzh|扬州|YLH|yangzhou|yz|498@yzh|永州|AOQ|yongzhou|yz|499@zbo|淄博|ZBK|zibo|zb|500@zcd|镇城底|ZDV|zhenchengdi|zcd|501@zgo|自贡|ZGW|zigong|zg|502@zha|珠海|ZHQ|zhuhai|zh|503@zhb|珠海北|ZIQ|zhuhaibei|zhb|504@zji|镇江|ZJH|zhenjiang|zj|505@zji|湛江|ZJZ|zhanjiang|zj|506@zjj|张家界|DIQ|zhangjiajie|zjj|507@zjk|张家口|ZKP|zhangjiakou|zjk|508@zjn|张家口南|ZMP|zhangjiakounan|zjkn|509@zko|周口|ZKN|zhoukou|zk|510@zlm|哲里木|ZLC|zhelimu|zlm|511@zlt|扎兰屯|ZTX|zhalantun|zlt|512@zmd|驻马店|ZDN|zhumadian|zmd|513@zqi|肇庆|ZVQ|zhaoqing|zq|514@zsz|周水子|ZIT|zhoushuizi|zsz|515@zto|昭通|ZDW|zhaotong|zt|516@zwe|中卫|ZWJ|zhongwei|zw|517@zya|资阳|ZYW|ziyang|zy|518@zyi|遵义|ZIW|zunyi|zy|519@zzh|株洲|ZZQ|zhuzhou|zz|520@zzh|资中|ZZW|zizhong|zz|521@zzh|枣庄|ZEK|zaozhuang|zz|522@zzx|枣庄西|ZFK|zaozhuangxi|zzx|523@aax|昂昂溪|AAX|angangxi|aax|524@ach|阿城|ACB|acheng|ac|525@ada|安达|ADX|anda|ad|526@adi|安定|ADP|anding|ad|527@agu|安广|AGT|anguang|ag|528@ahe|艾河|AHP|aihe|ah|529@ahu|安化|PKQ|anhua|ah|530@ajc|艾家村|AJJ|aijiacun|ajc|531@aji|阿金|AJD|ajin|aj|532@aji|安家|AJB|anjia|aj|533@aji|鳌江|ARH|aojiang|aj|534@akt|阿克陶|AER|aketao|akt|535@aky|安口窑|AYY|ankouyao|aky|536@alg|敖力布告|ALD|aolibugao|albg|537@alo|安龙|AUZ|anlong|al|538@als|阿龙山|ASX|alongshan|als|539@alu|安陆|ALN|anlu|al|540@ame|阿木尔|JTX|amuer|ame|541@anz|阿南庄|AZM|ananzhuang|anz|542@aqx|安庆西|APH|anqingxi|aqx|543@asx|鞍山西|AXT|anshanxi|asx|544@ata|安塘|ATV|antang|at|545@atb|安亭北|ASH|antingbei|atb|546@ats|阿图什|ATR|atushi|ats|547@atu|安图|ATL|antu|at|548@axi|安溪|AXS|anxi|ax|549@bao|博鳌|BWQ|boao|ba|550@bbe|北碚|BPW|beibei|bb|551@bbg|白壁关|BGV|baibiguan|bbg|552@bbn|蚌埠南|BMH|bengbunan|bbn|553@bch|板城|BUP|bancheng|bc|554@bch|巴楚|BCR|bachu|bc|555@bdh|北戴河|BEP|beidaihe|bdh|556@bdi|宝坻|BPP|baodi|bd|557@bdi|保定|BDP|baoding|bd|558@bdl|八达岭|ILP|badaling|bdl|559@bdo|巴东|BNN|badong|bd|560@bgu|柏果|BGM|baiguo|bg|561@bha|布海|BUT|buhai|bh|562@bhd|白河东|BIY|baihedong|bhd|563@bho|贲红|BVC|benhong|bh|564@bhs|宝华山|BWH|baohuashan|bhs|565@bhx|白河县|BEY|baihexian|bhx|566@bjg|碧鸡关|BJM|bijiguan|bjg|567@bjg|白芨沟|BJJ|baijigou|bjg|568@bji|碧江|BLQ|bijiang|bj|569@bji|北滘|IBQ|beijiao|b|570@bjp|白鸡坡|BBM|baijipo|bjp|571@bjs|笔架山|BSB|bijiashan|bjs|572@bjt|八角台|BTD|bajiaotai|bjt|573@bka|保康|BKD|baokang|bk|574@bkp|白奎堡|BKB|baikuipu|bkb|575@bla|百浪|BRZ|bailang|bl|576@bla|白狼|BAT|bailang|bl|577@ble|博乐|BOR|bole|bl|578@blg|宝拉格|BQC|baolage|blg|579@bli|勃利|BLB|boli|bl|580@bli|北流|BOZ|beiliu|bl|581@bli|宝林|BNB|baolin|bl|582@bli|巴林|BLX|balin|bl|583@blk|布列开|BLR|buliekai|blk|584@bls|宝龙山|BND|baolongshan|bls|585@bmc|八面城|BMD|bamiancheng|bmc|586@bmq|班猫箐|BNM|banmaoqing|bmj|587@bmt|八面通|BMB|bamiantong|bmt|588@bmz|北马圈子|BRP|beimajuanzi|bmqz|589@bpn|北票南|RPD|beipiaonan|bpn|590@bqi|白旗|BQP|baiqi|bq|591@bql|宝泉岭|BQB|baoquanling|bql|592@bqu|白泉|BQL|baiquan|bq|593@bsh|巴山|BAY|bashan|bs|594@bsh|白沙|BSW|baisha|bs|595@bsj|白水江|BSY|baishuijiang|bsj|596@bsp|白沙坡|BPM|baishapo|bsp|597@bss|白石山|BAL|baishishan|bss|598@bsz|白水镇|BUM|baishuizhen|bsz|599@bti|坂田|BTQ|bantian|bt|600@bto|泊头|BZP|botou|bt|601@btu|北屯|BYP|beitun|bt|602@bxh|本溪湖|BHT|benxihu|bxh|603@bxi|博兴|BXK|boxing|bx|604@bxt|八仙筒|VXD|baxiantong|bxt|605@byg|白音察干|BYC|bayanqagan|bycg|606@byh|背荫河|BYB|beiyinhe|byh|607@byi|北营|BIV|beiying|by|608@byl|白音他拉|BID|baiyintala|bytl|609@byl|巴彦高勒|BAC|bayangol|bygl|610@byq|鲅鱼圈|BYT|bayuquan|byq|611@bys|白音胡硕|BCD|baiyinhushuo|byhs|612@bys|白银市|BNJ|baiyinshi|bys|613@bzh|北宅|BVP|beizhai|bz|614@bzh|霸州|RMP|bazhou|bz|615@bzh|巴中|IEW|bazhong|bz|616@cbb|赤壁北|CIN|chibibei|cbb|617@cbg|查布嘎|CBC|chabuga|cbg|618@cch|长冲|CCM|changchong|cc|619@cch|长城|CEJ|changcheng|cc|620@cdd|承德东|CCP|chengdedong|cdd|621@cfx|赤峰西|CID|chifengxi|cfx|622@cga|柴岗|CGT|chaigang|cg|623@cga|嵯岗|CAX|cuogang|cg|624@cge|长葛|CEF|changge|cg|625@cgp|柴沟堡|CGV|chaigoupu|cgb|626@cgu|城固|CGY|chenggu|cg|627@cgy|陈官营|CAJ|chenguanying|cgy|628@cgz|成高子|CZB|chenggaozi|cgz|629@cha|草海|WBW|caohai|ch|630@che|册亨|CHZ|ceheng|ch|631@che|柴河|CHB|chaihe|ch|632@chk|崔黄口|CHP|cuihuangkou|chk|633@chk|草河口|CKT|caohekou|chk|634@chu|巢湖|CIH|chaohu|ch|635@cjg|蔡家沟|CJT|caijiagou|cjg|636@cjh|成吉思汗|CJX|qinggishan|cjsh|637@cji|岔江|CAM|chajiang|cj|638@cjp|蔡家坡|CJY|caijiapo|cjp|639@cle|昌乐|CLK|changle|cl|640@clg|超梁沟|CYP|chaolianggou|clg|641@cli|昌黎|CLP|changli|cl|642@cli|慈利|CUQ|cili|cl|643@clz|长岭子|CLT|changlingzi|clz|644@cmi|晨明|CMB|chenming|cm|645@cno|长农|CNJ|changnong|cn|646@cpb|昌平北|VBP|changpingbei|cpb|647@cpi|常平|DAQ|changping|cp|648@cpl|长坡岭|CPM|changpoling|cpl|649@cqi|辰清|CQB|chenqing|cq|650@csh|草市|CSL|caoshi|cs|651@csh|苍石|CST|cangshi|cs|652@csh|磁山|CSP|cishan|cs|653@csh|长寿|EFW|changshou|cs|654@csh|楚山|CSB|chushan|cs|655@csq|察素齐|CSC|chasuqi|csq|656@cst|长山屯|CVT|changshantun|cst|657@cti|长汀|CES|changting|ct|658@ctx|昌图西|CPT|changtuxi|ctx|659@cwa|春湾|CQQ|chunwan|cw|660@cxi|磁西|CRP|cixi|cx|661@cxi|辰溪|CXQ|chenxi|cx|662@cxi|岑溪|CNZ|cenxi|cx|663@cxi|磁县|CIP|cixian|cx|664@cxn|长兴南|CFH|changxingnan|cxn|665@cya|城阳|CEK|chengyang|cy|666@cya|春阳|CAL|chunyang|cy|667@cya|朝阳|CYD|chaoyang|cy|668@cya|磁窑|CYK|ciyao|cy|669@cyc|朝阳川|CYL|chaoyangchuan|cyc|670@cyc|创业村|CEX|chuangyecun|cyc|671@cyd|朝阳地|CDD|chaoyangdi|cyd|672@cyu|长垣|CYF|changyuan|cy|673@cyz|朝阳镇|CZL|chaoyangzhen|cyz|674@czb|常州北|ESH|changzhoubei|czb|675@czb|滁州北|CUH|chuzhoubei|czb|676@czh|常庄|CVK|changzhuang|cz|677@czh|潮州|CKQ|chaozhou|cz|678@czh|滁州|CXH|chuzhou|cz|679@czl|曹子里|CFP|caozili|czl|680@czw|车转湾|CWM|chezhuanwan|czw|681@czx|沧州西|CBP|cangzhouxi|czx|682@czx|郴州西|ICQ|chenzhouxi|czx|683@dan|大安|RAT|daan|da|684@dan|德安|DAG|dean|da|685@dba|到保|RBT|daobao|db|686@dba|大巴|DBD|daba|db|687@dba|大板|DBC|daban|db|688@dba|大坝|DBJ|daba|db|689@dbi|定边|DYJ|dingbian|db|690@dbj|东边井|DBB|dongbianjing|dbj|691@dbs|德伯斯|RDT|debosi|dbs|692@dcg|打柴沟|DGJ|dachaigou|dcg|693@dch|德昌|DVW|dechang|dc|694@dda|滴道|DDB|didao|dd|695@ddg|大磴沟|DKJ|dadenggou|ddg|696@ded|刀尔登|DRD|daoerdeng|ded|697@dee|得耳布尔|DRX|derbur|debe|698@dfa|东方|UFQ|dongfang|df|699@dfe|东丰|DIL|dongfeng|df|700@dfe|丹凤|DGY|danfeng|df|701@dge|都格|DMM|duge|dg|702@dgt|大官屯|DTT|daguantun|dgt|703@dgu|东光|DGP|dongguang|dg|704@dgu|大关|RGW|daguan|dg|705@dha|东海|DHB|donghai|dh|706@dhc|大灰厂|DHP|dahuichang|dhc|707@dhq|大红旗|DQD|dahongqi|dhq|708@dhx|德惠西|DXT|dehuixi|dhx|709@dhx|东海县|DQH|donghaixian|dhx|710@djg|达家沟|DJT|dajiagou|djg|711@dji|杜家|DJL|dujia|dj|712@dji|东津|DKB|dongjin|dj|713@dkt|大口屯|DKP|dakoutun|dkt|714@dla|东来|RVD|donglai|dl|715@dlh|大陆号|DLC|daluhao|dlh|716@dlh|德令哈|DHO|delingha|dlh|717@dli|大林|DLD|dalin|dl|718@dli|带岭|DLB|dailing|dl|719@dlq|达拉特旗|DIC|dalateqi|dltq|720@dlt|独立屯|DTX|dulitun|dlt|721@dlu|豆罗|DLV|douluo|dl|722@dlx|达拉特西|DNC|dalatexi|dltx|723@dmc|东明村|DMD|dongmingcun|dmc|724@dmh|洞庙河|DEP|dongmiaohe|dmh|725@dmx|东明县|DNF|dongmingxian|dmx|726@dni|大拟|DNZ|dani|dn|727@dpf|大平房|DPD|dapingfang|dpf|728@dps|大盘石|RPP|dapanshi|dps|729@dpu|大堡|DVT|dapu|db|730@dpu|大埔|DPI|dapu|dp|731@dqh|大其拉哈|DQX|daqilaha|dqlh|732@dqi|道清|DML|daoqing|dq|733@dqs|对青山|DQB|duiqingshan|dqs|734@dqx|大庆西|RHX|daqingxi|dqx|735@dqx|德清西|MOH|deqingxi|dqx|736@dsh|登沙河|DWT|dengshahe|dsh|737@dsh|砀山|DKH|dangshan|ds|738@dsh|独山|RWW|dushan|ds|739@dsh|东升|DRQ|dongsheng|ds|740@dsp|读书铺|DPM|dushupu|dsp|741@dst|大石头|DSL|dashitou|dst|742@dsx|东胜西|DYC|dongshengxi|dsx|743@dsz|大石寨|RZT|dashizhai|dsz|744@dta|灯塔|DGT|dengta|dt|745@dta|定陶|DQK|dingtao|dt|746@dta|东台|DBH|dongtai|dt|747@dtb|大田边|DBM|datianbian|dtb|748@dth|东通化|DTL|dongtonghua|dth|749@dtu|大屯|DNT|datun|dt|750@dtu|丹徒|RUH|dantu|dt|751@dwa|东湾|DRJ|dongwan|dw|752@dwk|大武口|DFJ|dawukou|dwk|753@dwp|低窝铺|DWJ|diwopu|dwp|754@dwt|大王滩|DZZ|dawangtan|dwt|755@dwz|大湾子|DFM|dawanzi|dwz|756@dxg|大兴沟|DXL|daxinggou|dxg|757@dxi|定襄|DXV|dingxiang|dx|758@dxi|代县|DKV|daixian|dx|759@dxi|东乡|DXG|dongxiang|dx|760@dxi|甸心|DXM|dianxin|dx|761@dxi|定西|DSJ|dingxi|dx|762@dxi|大兴|DXX|daxing|dx|763@dxu|东戌|RXP|dongxu|dx|764@dxz|东辛庄|DXD|dongxinzhuang|dxz|765@dya|当阳|DYN|dangyang|dy|766@dya|德阳|DYW|deyang|dy|767@dya|大雁|DYX|dayan|dy|768@dya|丹阳|DYH|danyang|dy|769@dyb|丹阳北|EXH|danyangbei|dyb|770@dyd|东淤地|DBV|dongyudi|dyd|771@dyd|大英东|IAW|dayingdong|dyd|772@dyi|大营|DYV|daying|dy|773@dyu|大元|DYZ|dayuan|dy|774@dyu|岱岳|RYV|daiyue|dy|775@dyu|定远|EWH|dingyuan|dy|776@dyz|大营子|DZD|dayingzi|dyz|777@dyz|大营镇|DJP|dayingzhen|dyz|778@dzc|大战场|DTJ|dazhanchang|dzc|779@dzd|德州东|DIP|dezhoudong|dzd|780@dzh|定州|DXP|dingzhou|dz|781@dzh|豆庄|ROP|douzhuang|dz|782@dzh|兑镇|DWV|duizhen|dz|783@dzh|东庄|DZV|dongzhuang|dz|784@dzh|东至|DCH|dongzhi|dz|785@dzh|道州|DFZ|daozhou|dz|786@dzh|东镇|DNV|dongzhen|dz|787@dzh|低庄|DVQ|dizhuang|dz|788@dzy|大竹园|DZY|dazhuyuan|dzy|789@dzz|豆张庄|RZP|douzhangzhuang|dzz|790@dzz|大杖子|DAP|dazhangzi|dzz|791@ebi|峨边|EBW|ebian|eb|792@edm|二道沟门|RDP|erdaogoumen|edgm|793@edw|二道湾|RDX|erdaowan|edw|794@elo|二龙|RLD|erlong|el|795@elt|二龙山屯|ELA|erlongshantun|elst|796@eme|峨眉|EMW|emei|em|797@emh|二密河|RML|ermihe|emh|798@eyi|二营|RYJ|erying|ey|799@ezh|鄂州|ECN|ezhou|ez|800@fan|福安|FAS|fuan|fa|801@fch|丰城|FCG|fengcheng|fc|802@fcn|丰城南|FNG|fengchengnan|fcn|803@fdo|肥东|FIH|feidong|fd|804@fer|发耳|FEM|faer|fe|805@fha|福海|FHR|fuhai|fh|806@fha|富海|FHX|fuhai|fh|807@fhc|凤凰城|FHT|fenghuangcheng|fhc|808@fhu|奉化|FHH|fenghua|fh|809@fji|富锦|FIB|fujin|fj|810@fjt|范家屯|FTT|fanjiatun|fjt|811@flt|福利屯|FTB|fulitun|flt|812@flz|丰乐镇|FZB|fenglezhen|flz|813@fna|阜南|FNH|funan|fn|814@fni|抚宁|FNP|funing|fn|815@fni|阜宁|AKH|funing|fn|816@fqi|福清|FQS|fuqing|fq|817@fqu|福泉|VMW|fuquan|fq|818@fsc|丰水村|FSJ|fengshuicun|fsc|819@fsh|抚顺|FST|fushun|fs|820@fsh|繁峙|FSV|fanshi|fs|821@fsh|丰顺|FUQ|fengshun|fs|822@fsk|福山口|FKP|fushankou|fsk|823@fsu|扶绥|FSZ|fusui|fs|824@ftu|冯屯|FTX|fengtun|ft|825@fty|浮图峪|FYP|futuyu|fty|826@fxd|富县东|FDY|fuxiandong|fxd|827@fxi|费县|FXK|feixian|fx|828@fxi|富县|FEY|fuxian|fx|829@fxi|凤县|FXY|fengxian|fx|830@fya|汾阳|FAV|fenyang|fy|831@fya|凤阳|FUH|fengyang|fy|832@fyb|扶余北|FBT|fuyubei|fyb|833@fyi|分宜|FYG|fenyi|fy|834@fyu|富裕|FYX|fuyu|fy|835@fyu|扶余|FYT|fuyu|fy|836@fyu|富源|FYM|fuyuan|fy|837@fzb|抚州北|FBG|fuzhoubei|fzb|838@fzh|范镇|VZK|fanzhen|fz|839@fzh|丰镇|FZC|fengzhen|fz|840@fzh|凤州|FZY|fengzhou|fz|841@gan|广安|VJW|guangan|ga|842@gan|固安|GFP|guan|ga|843@gbd|高碑店|GBP|gaobeidian|gbd|844@gbz|沟帮子|GBD|goubangzi|gbz|845@gcd|甘草店|GDJ|gancaodian|gcd|846@gch|藁城|GEP|gaocheng|gc|847@gch|谷城|GCN|gucheng|gc|848@gcu|高村|GCV|gaocun|gc|849@gcz|古城镇|GZB|guchengzhen|gcz|850@gde|广德|GRH|guangde|gd|851@gdi|贵定|GTW|guiding|gd|852@gdn|贵定南|IDW|guidingnan|gdn|853@gdo|古东|GDV|gudong|gd|854@gga|官高|GVP|guangao|gg|855@gga|贵港|GGZ|guigang|gg|856@ggm|葛根庙|GGT|gegenmiao|ggm|857@ggo|干沟|GGL|gangou|gg|858@ggu|甘谷|GGJ|gangu|gg|859@ggz|高各庄|GGP|gaogezhuang|ggz|860@ghe|根河|GEX|genhe|gh|861@ghe|甘河|GAX|ganhe|gh|862@gjd|郭家店|GDT|guojiadian|gjd|863@gjz|孤家子|GKT|gujiazi|gjz|864@gla|皋兰|GEJ|gaolan|gl|865@gla|古浪|GLJ|gulang|gl|866@glf|高楼房|GFM|gaoloufang|glf|867@glh|归流河|GHT|guiliuhe|glh|868@gli|关林|GLF|guanlin|gl|869@glu|甘洛|VOW|ganluo|gl|870@glz|郭磊庄|GLP|guoleizhuang|glz|871@gmi|高密|GMK|gaomi|gm|872@gmz|公庙子|GMC|gongmiaozi|gmz|873@gnh|工农湖|GRT|gongnonghu|gnh|874@gns|广宁寺|GNT|guangningsi|gns|875@gnw|广南卫|GNM|guangnanwei|gnw|876@gpi|高平|GPF|gaoping|gp|877@gqb|甘泉北|GEY|ganquanbei|gqb|878@gqc|共青城|GAG|gongqingcheng|gqc|879@gqk|甘旗卡|GQD|ganqika|gqk|880@gqu|甘泉|GQY|ganquan|gq|881@gqz|高桥镇|GZD|gaoqiaozhen|gqz|882@gsh|灌水|GST|guanshui|gs|883@gsh|赶水|GSW|ganshui|gs|884@gsk|孤山口|GSP|gushankou|gsk|885@gso|果松|GSL|guosong|gs|886@gsz|嘎什甸子|GXD|gashidianzi|gsdz|887@gsz|高山子|GSD|gaoshanzi|gsz|888@gta|高滩|GAY|gaotan|gt|889@gta|高台|GTJ|gaotai|gt|890@gti|官厅|GTP|guanting|gt|891@gti|古田|GTS|gutian|gt|892@gtx|官厅西|KEP|guantingxi|gtx|893@gxi|贵溪|GXG|guixi|gx|894@gya|涡阳|GYH|guoyang|gy|895@gyi|高邑|GIP|gaoyi|gy|896@gyi|巩义|GXF|gongyi|gy|897@gyn|巩义南|GYF|gongyinan|gyn|898@gyu|菇园|GYL|guyuan|gy|899@gyu|固原|GUJ|guyuan|gy|900@gyz|公营子|GYD|gongyingzi|gyz|901@gze|光泽|GZS|guangze|gz|902@gzh|盖州|GXT|gaizhou|gz|903@gzh|固镇|GEH|guzhen|gz|904@gzh|高州|GSQ|gaozhou|gz|905@gzh|瓜州|GZJ|guazhou|gz|906@gzh|古镇|GNQ|guzhen|gz|907@gzj|官字井|GOT|guanzijing|gzj|908@gzp|革镇堡|GZT|gezhenpu|gzb|909@gzs|冠豸山|GSS|guanzhishan|gzs|910@gzx|盖州西|GAT|gaizhouxi|gzx|911@han|淮安南|AMH|huaiannan|han|912@han|红安|HWN|hongan|ha|913@hax|海安县|HIH|haianxian|hax|914@hax|红安西|VXN|honganxi|hax|915@hba|黄柏|HBL|huangbai|hb|916@hbe|海北|HEB|haibei|hb|917@hbi|鹤壁|HAF|hebi|hb|918@hch|海城|HCT|haicheng|hc|919@hch|汉川|HCN|hanchuan|hc|920@hch|河唇|HCZ|hechun|hc|921@hch|合川|WKW|hechuan|hc|922@hch|华城|VCQ|huacheng|hc|923@hct|黑冲滩|HCJ|heichongtan|hct|924@hcu|黄村|HCP|huangcun|hc|925@hcx|海城西|HXT|haichengxi|hcx|926@hde|化德|HGC|huade|hd|927@hdo|洪洞|HDV|hongdong|hd|928@hes|霍尔果斯|HFR|huoerguosi|hegs|929@hfe|横峰|HFG|hengfeng|hf|930@hfw|韩府湾|HXJ|hanfuwan|hfw|931@hgu|汉沽|HGP|hangu|hg|932@hgz|红光镇|IGW|hongguangzhen|hgz|933@hhe|浑河|HHT|hunhe|hh|934@hhg|红花沟|VHD|honghuagou|hhg|935@hht|黄花筒|HUD|huanghuatong|hht|936@hjd|贺家店|HJJ|hejiadian|hjd|937@hji|华家|HJT|huajia|hj|938@hji|涵江|HJS|hanjiang|hj|939@hji|河津|HJV|hejin|hj|940@hji|获嘉|HJF|huojia|hj|941@hji|黑井|HIM|heijing|hj|942@hji|红江|HFM|hongjiang|hj|943@hji|和静|HJR|hejing|hj|944@hjx|河间西|HXP|hejianxi|hjx|945@hjz|花家庄|HJM|huajiazhuang|hjz|946@hkn|河口南|HKJ|hekounan|hkn|947@hko|湖口|HKG|hukou|hk|948@hko|黄口|KOH|huangkou|hk|949@hla|呼兰|HUB|hulan|hl|950@hlb|葫芦岛北|HPD|huludaobei|hldb|951@hlh|哈拉海|HIT|halahai|hlh|952@hlh|浩良河|HHB|haolianghe|hlh|953@hli|寒岭|HAT|hanling|hl|954@hli|虎林|VLB|hulin|hl|955@hli|海林|HRB|hailin|hl|956@hli|黄陵|ULY|huangling|hl|957@hli|桦林|HIB|hualin|hl|958@hli|鹤立|HOB|heli|hl|959@hlo|海龙|HIL|hailong|hl|960@hlo|和龙|HLL|helong|hl|961@hls|哈拉苏|HAX|harus|hls|962@hlt|呼鲁斯太|VTJ|hulstai|hlst|963@hlz|火连寨|HLT|huolianzhai|hlz|964@hme|黄梅|VEH|huangmei|hm|965@hmt|蛤蟆塘|HMT|hamatang|gmt|966@hmy|韩麻营|HYP|hanmaying|hmy|967@hnh|黄泥河|HHL|huangnihe|hnh|968@hni|海宁|HNH|haining|hn|969@hno|惠农|HMJ|huinong|hn|970@hpi|和平|VAQ|heping|hp|971@hpz|花棚子|HZM|huapengzi|hpz|972@hqi|宏庆|HEY|hongqing|hq|973@hqi|花桥|VQH|huaqiao|hq|974@hre|怀仁|HRV|huairen|hr|975@hro|华容|HRN|huarong|hr|976@hsb|华山北|HDY|huashanbei|hsb|977@hsd|黄松甸|HDL|huangsongdian|hsd|978@hsg|和什托洛盖|VSR|heshituoluogai|hstlg|979@hsh|虎什哈|HHP|hushiha|hsh|980@hsh|惠山|VCH|huishan|hs|981@hsh|黑水|HOT|heishui|hs|982@hsh|衡山|HSQ|hengshan|hs|983@hsh|汉寿|VSQ|hanshou|hs|984@hsh|红山|VSB|hongshan|hs|985@hsp|红寺堡|HSJ|hongsipu|hsb|986@hst|虎石台|HUT|hushitai|hst|987@hsw|海石湾|HSO|haishiwan|hsw|988@hsx|红砂岘|VSJ|hongshaxian|hsj|989@hsx|衡山西|HEQ|hengshanxi|hsx|990@hta|桓台|VTK|huantai|ht|991@hta|黑台|HQB|heitai|ht|992@hti|和田|VTR|hetian|ht|993@hto|会同|VTQ|huitong|ht|994@htz|海坨子|HZT|haituozi|htz|995@hwa|海湾|RWH|haiwan|hw|996@hwa|黑旺|HWK|heiwang|hw|997@hxi|徽县|HYY|huixian|hx|998@hxi|红星|VXB|hongxing|hx|999@hxl|红兴隆|VHB|hongxinglong|hxl|1000@hxt|红岘台|HTJ|hongxiantai|hxt|1001@hxt|换新天|VTB|huanxintian|hxt|1002@hya|海阳|HYK|haiyang|hy|1003@hya|合阳|HAY|heyang|hy|1004@hya|红彦|VIX|hongyan|hy|1005@hyd|衡阳东|HVQ|hengyangdong|hyd|1006@hyi|汉阴|HQY|hanyin|hy|1007@hyi|华蓥|HUW|huaying|hy|1008@hyt|黄羊滩|HGJ|huangyangtan|hyt|1009@hyu|花园|HUN|huayuan|hy|1010@hyu|河源|VIQ|heyuan|hy|1011@hyu|湟源|HNO|huangyuan|hy|1012@hyu|汉源|WHW|hanyuan|hy|1013@hyz|黄羊镇|HYJ|huangyangzhen|hyz|1014@hzh|霍州|HZV|huozhou|hz|1015@hzh|黄州|VON|huangzhou|hz|1016@hzh|化州|HZZ|huazhou|hz|1017@hzh|湖州|VZH|huzhou|hz|1018@hzx|惠州西|VXQ|huizhouxi|hzx|1019@jba|巨宝|JRT|jubao|jb|1020@jbi|靖边|JIY|jingbian|jb|1021@jbt|金宝屯|JBD|jinbaotun|jbt|1022@jcb|晋城北|JEF|jinchengbei|jcb|1023@jch|建昌|JFD|jianchang|jc|1024@jch|交城|JNV|jiaocheng|jc|1025@jch|鄄城|JCK|juancheng|jc|1026@jch|金昌|JCJ|jinchang|jc|1027@jde|峻德|JDB|junde|jd|1028@jdi|井店|JFP|jingdian|jd|1029@jdo|鸡东|JOB|jidong|jd|1030@jdu|江都|UDH|jiangdu|jd|1031@jgs|鸡冠山|JST|jiguanshan|jgs|1032@jgt|金沟屯|VGP|jingoutun|jgt|1033@jha|静海|JHP|jinghai|jh|1034@jhe|精河|JHR|jinghe|jh|1035@jhe|锦和|JHQ|jinhe|jh|1036@jhe|锦河|JHB|jinhe|jh|1037@jhe|金河|JHX|jinhe|jh|1038@jhn|精河南|JIR|jinghenan|jhn|1039@jhu|建湖|AJH|jianhu|jh|1040@jhu|江华|JHZ|jianghua|jh|1041@jjg|纪家沟|VJD|jijiagou|jjg|1042@jji|姜家|JJB|jiangjia|jj|1043@jji|江津|JJW|jiangjin|jj|1044@jji|晋江|JJS|jinjiang|jj|1045@jke|金坑|JKT|jinkeng|jk|1046@jli|芨岭|JLJ|jiling|jl|1047@jmc|金马村|JMM|jinmacun|jmc|1048@jme|角美|JES|jiaomei|jm|1049@jme|江门|JWQ|jiangmen|jm|1050@jna|井南|JNP|jingnan|jn|1051@jna|莒南|JOK|junan|jn|1052@jou|建瓯|JVS|jianou|jo|1053@jpe|经棚|JPC|jingpeng|jp|1054@jqi|江桥|JQX|jiangqiao|jq|1055@jsa|九三|SSX|jiusan|js|1056@jsb|金山北|EGH|jinshanbei|jsb|1057@jsh|甲山|JOP|jiashan|js|1058@jsh|建设|JET|jianshe|js|1059@jsh|吉舒|JSL|jishu|js|1060@jsh|稷山|JVV|jishan|js|1061@jsh|嘉善|JSH|jiashan|js|1062@jsh|建始|JRN|jianshi|js|1063@jsh|京山|JCN|jingshan|js|1064@jsj|建三江|JIB|jiansanjiang|jsj|1065@jsn|嘉善南|EAH|jiashannan|jsn|1066@jst|江所田|JOM|jiangsuotian|jst|1067@jst|金山屯|JTB|jinshantun|jst|1068@jta|景泰|JTJ|jingtai|jt|1069@jtn|九台南|JNL|jiutainan|jtn|1070@jwe|吉文|JWX|jiwen|jw|1071@jxi|嘉兴|JXH|jiaxing|jx|1072@jxi|井陉|JJP|jingxing|jx|1073@jxi|介休|JXV|jiexiu|jx|1074@jxi|嘉祥|JUK|jiaxiang|jx|1075@jxi|莒县|JKK|juxian|jx|1076@jxi|进贤|JUG|jinxian|jx|1077@jxn|嘉兴南|EPH|jiaxingnan|jxn|1078@jxz|夹心子|JXT|jiaxinzi|jxz|1079@jya|姜堰|UEH|jiangyan|jy|1080@jya|建阳|JYS|jianyang|jy|1081@jya|揭阳|JRQ|jieyang|jy|1082@jya|简阳|JYW|jianyang|jy|1083@jye|巨野|JYK|juye|jy|1084@jyo|江永|JYZ|jiangyong|jy|1085@jyu|济源|JYF|jiyuan|jy|1086@jyu|江源|SZL|jiangyuan|jy|1087@jyu|缙云|JYH|jinyun|jy|1088@jyu|靖远|JYJ|jingyuan|jy|1089@jyx|靖远西|JXJ|jingyuanxi|jyx|1090@jzb|胶州北|JZK|jiaozhoubei|jzb|1091@jzd|焦作东|WEF|jiaozuodong|jzd|1092@jzh|胶州|JXK|jiaozhou|jz|1093@jzh|晋州|JXP|jinzhou|jz|1094@jzh|金寨|JZH|jinzhai|jz|1095@jzh|荆州|JBN|jingzhou|jz|1096@jzh|靖州|JEQ|jingzhou|jz|1097@jzn|锦州南|JOD|jinzhounan|jzn|1098@jzu|焦作|JOF|jiaozuo|jz|1099@jzw|旧庄窝|JVP|jiuzhuangwo|jzw|1100@jzz|金杖子|JYD|jinzhangzi|jzz|1101@kan|开安|KAT|kaian|ka|1102@kch|康城|KCP|kangcheng|kc|1103@kch|库车|KCR|kuche|kc|1104@kde|库都尔|KDX|huder|kde|1105@kdi|宽甸|KDT|kuandian|kd|1106@kdo|克东|KOB|kedong|kd|1107@kji|开江|KAW|kaijiang|kj|1108@kjj|康金井|KJB|kangjinjing|kjj|1109@klq|喀喇其|KQX|kalaqi|klq|1110@klu|开鲁|KLC|kailu|kl|1111@kly|克拉玛依|KHR|kelamayi|klmy|1112@kqi|口前|KQL|kouqian|kq|1113@ksh|克山|KSB|keshan|ks|1114@ksh|昆山|KSH|kunshan|ks|1115@ksh|奎山|KAB|kuishan|ks|1116@kto|开通|KTT|kaitong|kt|1117@kxl|康熙岭|KXZ|kangxiling|kxl|1118@kya|昆阳|KAM|kunyang|ky|1119@kyh|克一河|KHX|keyihe|kyh|1120@kyx|开原西|KXT|kaiyuanxi|kyx|1121@kzh|康庄|KZP|kangzhuang|kz|1122@lbi|老边|LLT|laobian|lb|1123@lbi|来宾|UBZ|laibin|lb|1124@lbx|灵宝西|LPF|lingbaoxi|lbx|1125@lch|聊城|UCK|liaocheng|lc|1126@lch|黎城|UCP|licheng|lc|1127@lch|乐昌|LCQ|lechang|lc|1128@lch|龙川|LUQ|longchuan|lc|1129@lcu|蓝村|LCK|lancun|lc|1130@ldo|林东|LRC|lindong|ld|1131@ldu|乐都|LDO|ledu|ld|1132@ldx|梁底下|LDP|liangdixia|ldx|1133@ldz|六道河子|LVP|liudaohezi|ldhz|1134@lfa|落垡|LOP|luofa|lf|1135@lfa|廊坊|LJP|langfang|lf|1136@lfa|鲁番|LVM|lufan|lf|1137@lfb|廊坊北|LFP|langfangbei|lfb|1138@lfu|老府|UFD|laofu|lf|1139@lga|兰岗|LNB|langang|lg|1140@lgd|龙骨甸|LGM|longgudian|lgd|1141@lgo|龙沟|LGJ|longgou|lg|1142@lgo|芦沟|LOM|lugou|lg|1143@lgu|拉古|LGB|lagu|lg|1144@lha|凌海|JID|linghai|lh|1145@lha|拉哈|LHX|laha|lh|1146@lha|林海|LXX|linhai|lh|1147@lha|临海|UFH|linhai|lh|1148@lhe|六合|KLH|luhe|lh|1149@lhe|柳河|LNL|liuhe|lh|1150@lhu|龙华|LHP|longhua|lh|1151@lhy|滦河沿|UNP|luanheyan|lhy|1152@lhz|六合镇|LEX|liuhezhen|lhz|1153@ljd|刘家店|UDT|liujiadian|ljd|1154@ljd|亮甲店|LRT|liangjiadian|ljd|1155@ljh|刘家河|LVT|liujiahe|ljh|1156@lji|龙嘉|UJL|longjia|lj|1157@lji|龙江|LJX|longjiang|lj|1158@lji|两家|UJT|liangjia|lj|1159@lji|庐江|UJH|lujiang|lj|1160@lji|廉江|LJZ|lianjiang|lj|1161@lji|罗江|LJW|luojiang|lj|1162@lji|李家|LJB|lijia|lj|1163@lji|连江|LKS|lianjiang|lj|1164@ljk|莲江口|LHB|lianjiangkou|ljk|1165@ljl|蔺家楼|ULK|linjialou|ljl|1166@ljp|李家坪|LIJ|lijiaping|ljp|1167@lka|兰考|LKF|lankao|lk|1168@lko|林口|LKB|linkou|lk|1169@lkp|路口铺|LKQ|lukoupu|lkp|1170@lla|老莱|LAX|laolai|ll|1171@lli|兰棱|LLB|lanling|ll|1172@lli|临澧|LWQ|linli|ll|1173@lli|零陵|UWZ|lingling|ll|1174@lli|龙里|LLW|longli|ll|1175@lli|陆良|LRM|luliang|ll|1176@lli|拉林|LAB|lalin|ll|1177@llo|卢龙|UAP|lulong|ll|1178@lmd|里木店|LMB|limudian|lmd|1179@lmd|喇嘛甸|LMX|lamadian|lmd|1180@lme|洛门|LMJ|luomen|lm|1181@lna|龙南|UNG|longnan|ln|1182@lpi|罗平|LPM|luoping|lp|1183@lpi|梁平|UQW|liangping|lp|1184@lpl|落坡岭|LPP|luopoling|lpl|1185@lps|乐平市|LPG|lepingshi|lps|1186@lps|六盘山|UPJ|liupanshan|lps|1187@lqi|临清|UQK|linqing|lq|1188@lqs|龙泉寺|UQJ|longquansi|lqs|1189@lsc|乐善村|LUM|leshancun|lsc|1190@lsd|冷水江东|UDQ|lengshuijiangdong|lsjd|1191@lsg|流水沟|USP|liushuigou|lsg|1192@lsg|连山关|LGT|lianshanguan|lsg|1193@lsh|庐山|LSG|lushan|ls|1194@lsh|露水河|LUL|lushuihe|lsh|1195@lsh|灵石|LSV|lingshi|ls|1196@lsh|梁山|LMK|liangshan|ls|1197@lsh|丽水|USH|lishui|ls|1198@lsh|鲁山|LAF|lushan|ls|1199@lsh|罗山|LRN|luoshan|ls|1200@lsh|乐山|UTW|leshan|ls|1201@lsh|陵水|LIQ|lingshui|ls|1202@lsp|林盛堡|LBT|linshengpu|lsp|1203@lst|柳树屯|LSD|liushutun|lst|1204@lsz|李石寨|LET|lishizhai|lsz|1205@lsz|龙山镇|LAS|longshanzhen|lsz|1206@lsz|梨树镇|LSB|lishuzhen|lsz|1207@lta|芦台|LTP|lutai|lt|1208@lta|轮台|LAR|luntai|lt|1209@lta|黎塘|LTZ|litang|lt|1210@ltb|龙塘坝|LBM|longtangba|ltb|1211@ltu|濑湍|LVZ|laituan|lt|1212@ltx|骆驼巷|LTJ|luotuoxiang|ltx|1213@lwa|李旺|VLJ|liwang|lw|1214@lwd|莱芜东|LWK|laiwudong|lwd|1215@lws|狼尾山|LRJ|langweishan|lws|1216@lwu|灵武|LNJ|lingwu|lw|1217@lwx|莱芜西|UXK|laiwuxi|lwx|1218@lxi|滦县|UXP|luanxian|lx|1219@lxi|林西|LXC|linxi|lx|1220@lxi|芦溪|LUG|luxi|lx|1221@lxi|临湘|LXQ|linxiang|lx|1222@lxi|陇县|LXY|longxian|lx|1223@lxi|朗乡|LXB|langxiang|lx|1224@lya|辽阳|LYT|liaoyang|ly|1225@lya|略阳|LYY|lueyang|ly|1226@lyb|临沂北|UYK|linyibei|lyb|1227@lyd|凌源东|LDD|lingyuandong|lyd|1228@lyg|连云港|UIH|lianyungang|lyg|1229@lyi|老营|LXL|laoying|ly|1230@lyi|临颍|LNF|linying|ly|1231@lyo|龙游|LMH|longyou|ly|1232@lyu|涞源|LYP|laiyuan|ly|1233@lyu|涟源|LAQ|lianyuan|ly|1234@lyu|林源|LYX|linyuan|ly|1235@lyu|罗源|LVS|luoyuan|ly|1236@lyx|耒阳西|LPQ|leiyangxi|lyx|1237@lze|临泽|LEJ|linze|lz|1238@lzg|龙爪沟|LZT|longzhaogou|lzg|1239@lzh|拉鲊|LEM|lazha|lz|1240@lzh|龙镇|LZA|longzhen|lz|1241@lzh|来舟|LZS|laizhou|lz|1242@lzh|鹿寨|LIZ|luzhai|lz|1243@lzh|六枝|LIW|liuzhi|lz|1244@lzh|雷州|UAQ|leizhou|lz|1245@mas|马鞍山|MAH|maanshan|mas|1246@mba|毛坝|MBY|maoba|mb|1247@mbg|毛坝关|MGY|maobaguan|mbg|1248@mcb|麻城北|MBN|machengbei|mcb|1249@mch|庙城|MAP|miaocheng|mc|1250@mch|明城|MCL|mingcheng|mc|1251@mch|渑池|MCF|mianchi|mc|1252@mcn|渑池南|MNF|mianchinan|mcn|1253@mcp|茅草坪|KPM|maocaoping|mcp|1254@mdh|猛洞河|MUQ|mengdonghe|mdh|1255@mds|磨刀石|MOB|modaoshi|mds|1256@mdu|弥渡|MDF|midu|md|1257@mes|帽儿山|MRB|maoershan|mes|1258@mga|明港|MGN|minggang|mg|1259@mhk|梅河口|MHL|meihekou|mhk|1260@mhu|马皇|MHZ|mahuang|mh|1261@mjg|孟家岗|MGB|mengjiagang|mjg|1262@mla|美兰|MHQ|meilan|ml|1263@mld|汨罗东|MQQ|miluodong|mld|1264@mlh|马莲河|MHB|malianhe|mlh|1265@mli|马林|MID|malin|ml|1266@mli|穆棱|MLB|muling|ml|1267@mli|茂林|MLD|maolin|ml|1268@mli|庙岭|MLL|miaoling|ml|1269@mli|茅岭|MLZ|maoling|ml|1270@mlo|汨罗|MLQ|miluo|ml|1271@mlo|马龙|MGM|malong|ml|1272@mlt|木里图|MUD|mulitu|mlt|1273@mnh|玛纳斯湖|MNR|manasihu|mnsh|1274@mni|冕宁|UGW|mianning|mn|1275@mpa|沐滂|MPQ|mupang|mp|1276@mqh|马桥河|MQB|maqiaohe|mqh|1277@mqi|闽清|MQS|minqing|mq|1278@mqu|民权|MQF|minquan|mq|1279@msh|眉山|MSW|meishan|ms|1280@msh|麻山|MAB|mashan|ms|1281@msh|明水河|MUT|mingshuihe|msh|1282@msw|漫水湾|MKW|manshuiwan|msw|1283@msz|米沙子|MST|mishazi|msz|1284@msz|茂舍祖|MOM|maoshezu|msz|1285@mtz|庙台子|MZB|miaotaizi|mtz|1286@mxi|勉县|MVY|mianxian|mx|1287@mxi|美溪|MEB|meixi|mx|1288@mya|麻阳|MVQ|mayang|my|1289@myi|米易|MMW|miyi|my|1290@myu|密云|MUP|miyun|my|1291@myu|墨玉|MUR|moyu|my|1292@myu|麦园|MYS|maiyuan|my|1293@mzh|明珠|MFQ|mingzhu|mz|1294@mzh|米脂|MEY|mizhi|mz|1295@mzh|庙庄|MZJ|miaozhuang|mz|1296@nan|农安|NAT|nongan|na|1297@nan|宁安|NAB|ningan|na|1298@nbs|南博山|NBK|nanboshan|nbs|1299@nch|南仇|NCK|nanchou|nc|1300@ncs|南城司|NSP|nanchengsi|ncs|1301@ncu|宁村|NCZ|ningcun|nc|1302@nde|宁德|NES|ningde|nd|1303@ngc|南观村|NGP|nanguancun|ngc|1304@ngd|南宫东|NFP|nangongdong|ngd|1305@ngl|南关岭|NLT|nanguanling|ngl|1306@ngu|宁国|NNH|ningguo|ng|1307@nha|宁海|NHH|ninghai|nh|1308@nhc|南河川|NHJ|nanhechuan|nhc|1309@nhu|南华|NHS|nanhua|nh|1310@nhz|泥河子|NHD|nihezi|nhz|1311@nji|能家|NJD|nengjia|nj|1312@nji|南靖|NJS|nanjing|nj|1313@nji|牛家|NJB|niujia|nj|1314@nji|宁家|NVT|ningjia|nj|1315@nko|南口|NKP|nankou|nk|1316@nkq|南口前|NKT|nankouqian|nkq|1317@nla|南朗|NNQ|nanlang|nl|1318@nli|乃林|NLD|nailin|nl|1319@nlk|尼勒克|NIR|nileke|nlk|1320@nlu|那罗|ULZ|naluo|nl|1321@nlx|宁陵县|NLF|ninglingxian|nlx|1322@nma|奈曼|NMD|naiman|nm|1323@nmi|宁明|NMZ|ningming|nm|1324@nmu|南木|NMX|nanmu|nm|1325@npn|南平南|NNS|nanpingnan|npn|1326@npu|那铺|NPZ|napu|np|1327@nqi|南桥|NQD|nanqiao|nq|1328@nqu|暖泉|NQJ|nuanquan|nq|1329@nqu|那曲|NQO|naqu|nq|1330@nta|南台|NTT|nantai|nt|1331@nto|南头|NOQ|nantou|nt|1332@nwu|宁武|NWV|ningwu|nw|1333@nwz|南湾子|NWP|nanwanzi|nwz|1334@nxb|南翔北|NEH|nanxiangbei|nxb|1335@nxi|内乡|NXF|neixiang|nx|1336@nxi|宁乡|NXQ|ningxiang|nx|1337@nxt|牛心台|NXT|niuxintai|nxt|1338@nyu|南峪|NUP|nanyu|ny|1339@nzg|娘子关|NIP|niangziguan|nzg|1340@nzh|南召|NAF|nanzhao|nz|1341@nzm|南杂木|NZT|nanzamu|nzm|1342@pan|蓬安|PAW|pengan|pa|1343@pan|平安|PAL|pingan|pa|1344@pay|平安驿|PNO|pinganyi|pay|1345@paz|平安镇|PZT|pinganzhen|paz|1346@paz|磐安镇|PAJ|pananzhen|paz|1347@pcd|蒲城东|PEY|puchengdong|pcd|1348@pch|蒲城|PCY|pucheng|pc|1349@pde|裴德|PDB|peide|pd|1350@pdi|偏店|PRP|piandian|pd|1351@pdx|坡底下|PXJ|podixia|pdx|1352@pdx|平顶山西|BFF|pingdingshanxi|pdsx|1353@pet|瓢儿屯|PRT|piaoertun|pet|1354@pfa|平房|PFB|pingfang|pf|1355@pga|平岗|PGL|pinggang|pg|1356@pgu|平果|PGZ|pingguo|pg|1357@pgu|盘关|PAM|panguan|pg|1358@pgu|平关|PGM|pingguan|pg|1359@phb|徘徊北|PHP|paihuibei|phb|1360@phk|平河口|PHM|pinghekou|phk|1361@pjb|盘锦北|PBD|panjinbei|pjb|1362@pjd|潘家店|PDP|panjiadian|pjd|1363@pko|皮口|PKT|pikou|pk|1364@pld|普兰店|PLT|pulandian|pld|1365@pli|偏岭|PNT|pianling|pl|1366@psh|平社|PSV|pingshe|ps|1367@psh|磐石|PSL|panshi|ps|1368@psh|彭水|PHW|pengshui|ps|1369@psh|皮山|PSR|pishan|ps|1370@psh|彭山|PSW|pengshan|ps|1371@psh|平山|PSB|pingshan|ps|1372@pta|平台|PVT|pingtai|pt|1373@pti|莆田|PTS|putian|pt|1374@pti|平田|PTM|pingtian|pt|1375@ptq|葡萄菁|PTW|putaoqing|ptj|1376@pwa|平旺|PWV|pingwang|pw|1377@pwa|普湾|PWT|puwan|pw|1378@pxg|平型关|PGV|pingxingguan|pxg|1379@pxi|普雄|POW|puxiong|px|1380@pya|平遥|PYV|pingyao|py|1381@pya|彭阳|PYJ|pengyang|py|1382@pya|平洋|PYX|pingyang|py|1383@pyi|平邑|PIK|pingyi|py|1384@pyp|平原堡|PPJ|pingyuanpu|pyp|1385@pyu|平峪|PYP|pingyu|py|1386@pyu|平原|PYK|pingyuan|py|1387@pze|彭泽|PZG|pengze|pz|1388@pzh|平庄|PZD|pingzhuang|pz|1389@pzh|邳州|PJH|pizhou|pz|1390@pzi|泡子|POD|paozi|pz|1391@pzn|平庄南|PND|pingzhuangnan|pzn|1392@qan|迁安|QQP|qianan|qa|1393@qan|庆安|QAB|qingan|qa|1394@qan|乾安|QOT|qianan|qa|1395@qdb|祁东北|QRQ|qidongbei|qd|1396@qdi|七甸|QDM|qidian|qd|1397@qfd|曲阜东|QAK|qufudong|qfd|1398@qfe|庆丰|QFT|qingfeng|qf|1399@qft|奇峰塔|QVP|qifengta|qft|1400@qfu|曲阜|QFK|qufu|qf|1401@qha|琼海|QYQ|qionghai|qh|1402@qhd|秦皇岛|QTP|qinhuangdao|qhd|1403@qhe|清河|QIP|qinghe|qh|1404@qhe|千河|QUY|qianhe|qh|1405@qhm|清河门|QHD|qinghemen|qhm|1406@qhy|清华园|QHP|qinghuayuan|qhy|1407@qji|秦家|QJB|qinjia|qj|1408@qji|全椒|INH|quanjiao|qj|1409@qji|潜江|QJN|qianjiang|qj|1410@qji|綦江|QJW|qijiang|qj|1411@qji|渠旧|QJZ|qujiu|qj|1412@qjp|祁家堡|QBT|qijiapu|qjb|1413@qjx|清涧县|QNY|qingjianxian|qjx|1414@qjz|秦家庄|QZV|qinjiazhuang|qjz|1415@qlh|七里河|QLD|qilihe|qlh|1416@qli|秦岭|QLY|qinling|ql|1417@qli|渠黎|QLZ|quli|ql|1418@qls|青龙山|QGH|qinglongshan|qls|1419@qme|祁门|QIH|qimen|qm|1420@qmt|前磨头|QMP|qianmotou|qmt|1421@qsh|前山|QXQ|qianshan|qs|1422@qsh|清水|QUJ|qingshui|qs|1423@qsh|确山|QSN|queshan|qs|1424@qsh|青山|QSB|qingshan|qs|1425@qsy|戚墅堰|QYH|qishuyan|qsy|1426@qti|青田|QVH|qingtian|qt|1427@qto|桥头|QAT|qiaotou|qt|1428@qtx|青铜峡|QTJ|qingtongxia|qtx|1429@qwe|前卫|QWD|qianwei|qw|1430@qwt|前苇塘|QWP|qianweitang|qwt|1431@qxi|桥西|QXJ|qiaoxi|qx|1432@qxi|青县|QXP|qingxian|qx|1433@qxi|祁县|QXV|qixian|qx|1434@qxi|渠县|QRW|quxian|qx|1435@qxu|清徐|QUV|qingxu|qx|1436@qxy|旗下营|QXC|qixiaying|qxy|1437@qya|泉阳|QYL|quanyang|qy|1438@qya|沁阳|QYF|qinyang|qy|1439@qya|千阳|QOY|qianyang|qy|1440@qyb|祁阳北|QVQ|qiyangbei|qy|1441@qyi|七营|QYJ|qiying|qy|1442@qys|庆阳山|QSJ|qingyangshan|qys|1443@qyu|清原|QYT|qingyuan|qy|1444@qyu|清远|QBQ|qingyuan|qy|1445@qzd|钦州东|QDZ|qinzhoudong|qzd|1446@qzh|钦州|QRZ|qinzhou|qz|1447@qzs|青州市|QZK|qingzhoushi|qzs|1448@ran|瑞安|RAH|ruian|ra|1449@rch|瑞昌|RCG|ruichang|rc|1450@rch|荣昌|RCW|rongchang|rc|1451@rga|如皋|RBH|rugao|rg|1452@rgu|容桂|RUQ|ronggui|rg|1453@rqi|任丘|RQP|renqiu|rq|1454@rsh|热水|RSD|reshui|rs|1455@rsh|融水|RSZ|rongshui|rs|1456@rsh|乳山|ROK|rushan|rs|1457@rxi|容县|RXZ|rongxian|rx|1458@rya|汝阳|RYF|ruyang|ry|1459@rya|饶阳|RVP|raoyang|ry|1460@ryh|绕阳河|RHD|raoyanghe|ryh|1461@rzh|汝州|ROF|ruzhou|rz|1462@sba|石坝|OBJ|shiba|sb|1463@sbc|上板城|SBP|shangbancheng|sbc|1464@sbi|施秉|AQW|shibing|sb|1465@sbn|上板城南|OBP|shangbanchengnan|sbcn|1466@sby|世博园|ZWT|shiboyuan|sby|1467@scb|双城北|SBB|shuangchengbei|scb|1468@sch|石城|SCT|shicheng|sc|1469@sch|沙城|SCP|shacheng|sc|1470@sch|神池|SMV|shenchi|sc|1471@sch|舒城|OCH|shucheng|sc|1472@sch|顺昌|SCS|shunchang|sc|1473@sch|莎车|SCR|shache|sc|1474@sch|商城|SWN|shangcheng|sc|1475@scz|山城镇|SCL|shanchengzhen|scz|1476@sda|山丹|SDJ|shandan|sd|1477@sde|绥德|ODY|suide|sd|1478@sde|顺德|ORQ|shunde|sd|1479@sdo|水洞|SIL|shuidong|sd|1480@sdo|邵东|SOQ|shaodong|sd|1481@sdu|十渡|SEP|shidu|sd|1482@sdu|商都|SXC|shangdu|sd|1483@sdw|四道湾|OUD|sidaowan|sdw|1484@sdy|顺德学院|OJQ|shundexueyuan|sdxy|1485@sfa|绅坊|OLH|shenfang|sf|1486@sfe|双丰|OFB|shuangfeng|sf|1487@sft|四方台|STB|sifangtai|sft|1488@sfu|水富|OTW|shuifu|sf|1489@sgk|三关口|OKJ|sanguankou|sgk|1490@sgl|桑根达来|OGC|sanggendalai|sgdl|1491@sgu|韶关|SNQ|shaoguan|sg|1492@sgz|上高镇|SVK|shanggaozhen|sgz|1493@sha|沙海|SED|shahai|sh|1494@sha|上杭|JBS|shanghang|sh|1495@she|沙河|SHP|shahe|sh|1496@she|松河|SBM|songhe|sh|1497@shk|沙河口|SKT|shahekou|shk|1498@shl|赛汗塔拉|SHC|saihantai|shtl|1499@shs|沙后所|SSD|shahousuo|shs|1500@shs|沙河市|VOP|shaheshi|shs|1501@sht|山河屯|SHL|shanhetun|sht|1502@shx|三河县|OXP|sanhexian|shx|1503@shy|四合永|OHD|siheyong|shy|1504@shz|三合庄|SVP|sanhezhuang|shz|1505@shz|石河子|SZR|shihezi|shz|1506@shz|双河镇|SEL|shuanghezhen|shz|1507@shz|三汇镇|OZW|sanhuizhen|shz|1508@sjd|三家店|ODP|sanjiadian|sjd|1509@sjh|松江河|SJL|songjianghe|sjh|1510@sjh|沈家河|OJJ|shenjiahe|sjh|1511@sjh|水家湖|SQH|shuijiahu|sjh|1512@sji|松江|SAH|songjiang|sj|1513@sji|沈家|OJB|shenjia|sj|1514@sji|孙家|SUB|sunjia|sj|1515@sji|尚家|SJB|shangjia|sj|1516@sjk|三江口|SKD|sanjiangkou|sjk|1517@sjl|司家岭|OLK|sijialing|sjl|1518@sjn|石景山南|SRP|shijingshannan|sjsn|1519@sjn|松江南|IMH|songjiangnan|sjn|1520@sjt|邵家堂|SJJ|shaojiatang|sjt|1521@sjx|三江县|SOZ|sanjiangxian|sjx|1522@sjz|深井子|SWT|shenjingzi|sjz|1523@sjz|施家嘴|SHM|shijiazui|sjz|1524@sjz|松江镇|OZL|songjiangzhen|sjz|1525@sjz|十家子|SJD|shijiazi|sjz|1526@sjz|三家寨|SMM|sanjiazhai|sjz|1527@sld|什里店|OMP|shilidian|sld|1528@sle|疏勒|SUR|shule|sl|1529@slh|舍力虎|VLD|shelihu|slh|1530@slh|疏勒河|SHJ|shulehe|slh|1531@sli|石林|SLM|shilin|sl|1532@sli|石岭|SOL|shiling|sl|1533@sli|绥棱|SIB|suiling|sl|1534@sli|石磷|SPB|shilin|sl|1535@sln|石林南|LNM|shilinnan|sln|1536@slo|石龙|SLQ|shilong|sl|1537@slq|萨拉齐|SLC|salaqi|slq|1538@slu|商洛|OLY|shangluo|sl|1539@slu|索伦|SNT|suolun|sl|1540@slz|沙岭子|SLP|shalingzi|slz|1541@smb|石门县北|VFQ|shimenxianbei|smxb|1542@smn|三门峡南|SCF|sanmenxianan|smxn|1543@smx|三门峡西|SXF|sanmenxiaxi|smxx|1544@smx|石门县|OMQ|shimenxian|smx|1545@smx|三门县|OQH|sanmenxian|smx|1546@sni|肃宁|SYP|suning|sn|1547@son|宋|SOB|song|s|1548@spa|双牌|SBZ|shuangpai|sp|1549@spd|四平东|PPT|sipingdong|spd|1550@spi|遂平|SON|suiping|sp|1551@spt|沙坡头|SFJ|shapotou|spt|1552@sqn|商丘南|SPF|shangqiunan|sqn|1553@squ|水泉|SID|shuiquan|sq|1554@sqx|石泉县|SXY|shiquanxian|sqx|1555@sqz|石桥子|SQT|shiqiaozi|sqz|1556@src|石人城|SRB|shirencheng|src|1557@sre|石人|SRL|shiren|sr|1558@ssh|首山|SAT|shoushan|ss|1559@ssh|松树|SFT|songshu|ss|1560@ssh|石山|SAD|shishan|ss|1561@ssh|泗水|OSK|sishui|ss|1562@ssh|三水|SJQ|sanshui|ss|1563@ssh|鄯善|SSR|shanshan|ss|1564@ssh|神树|SWB|shenshu|ss|1565@ssh|山市|SQB|shanshi|ss|1566@ssj|三十家|SRD|sanshijia|ssj|1567@ssp|三十里堡|SST|sanshilipu|sslb|1568@ssz|松树镇|SSL|songshuzhen|ssz|1569@sta|松桃|MZQ|songtao|st|1570@sth|索图罕|SHX|suotuhan|sth|1571@stj|三堂集|SDH|santangji|stj|1572@sto|神头|SEV|shentou|st|1573@sto|石头|OTB|shitou|st|1574@stu|沙沱|SFM|shatuo|st|1575@swa|上万|SWP|shangwan|sw|1576@swu|孙吴|SKB|sunwu|sw|1577@swx|沙湾县|SXR|shawanxian|swx|1578@sxi|石岘|SXL|shixian|sj|1579@sxi|歙县|OVH|shexian|sx|1580@sxi|绍兴|SOH|shaoxing|sx|1581@sxi|沙县|SAS|shaxian|sx|1582@sxi|遂溪|SXZ|suixi|sx|1583@sxp|上西铺|SXM|shangxipu|sxp|1584@sxz|石峡子|SXJ|shixiazi|sxz|1585@sya|水洋|OYP|shuiyang|sy|1586@sya|寿阳|SYV|shouyang|sy|1587@sya|沭阳|FMH|shuyang|sy|1588@sya|绥阳|SYB|suiyang|sy|1589@syc|三阳川|SYJ|sanyangchuan|syc|1590@syd|上腰墩|SPJ|shangyaodun|syd|1591@syi|顺义|SOP|shunyi|sy|1592@syi|三营|OEJ|sanying|sy|1593@syj|三义井|OYD|sanyijing|syj|1594@syp|三源浦|SYL|sanyuanpu|syp|1595@syu|水源|OYJ|shuiyuan|sy|1596@syu|上园|SUD|shangyuan|sy|1597@syu|上虞|BDH|shangyu|sy|1598@syu|三原|SAY|sanyuan|sy|1599@syz|桑园子|SAJ|sangyuanzi|syz|1600@szb|苏州北|OHH|suzhoubei|szb|1601@szb|绥中北|SND|suizhongbei|szb|1602@szd|深圳东|BJQ|shenzhendong|szd|1603@szd|宿州东|SRH|suzhoudong|szd|1604@szh|师庄|SNM|shizhuang|sz|1605@szh|尚志|SZB|shangzhi|sz|1606@szh|绥中|SZD|suizhong|sz|1607@szh|孙镇|OZY|sunzhen|sz|1608@szh|深州|OZP|shenzhou|sz|1609@szi|松滋|SIN|songzi|sz|1610@szo|师宗|SEM|shizong|sz|1611@szq|苏州新区|ITH|suzhouxinqu|szxq|1612@szq|苏州园区|KAH|suzhouyuanqu|szyq|1613@tan|台安|TID|taian|ta|1614@tan|泰安|TMK|taian|ta|1615@tay|通安驿|TAJ|tonganyi|tay|1616@tba|桐柏|TBF|tongbai|tb|1617@tbe|通北|TBB|tongbei|tb|1618@tch|铁厂|TCL|tiechang|tc|1619@tch|郯城|TZK|tancheng|tc|1620@tch|桐城|TTH|tongcheng|tc|1621@tch|汤池|TCX|tangchi|tc|1622@tcu|桃村|TCK|taocun|tc|1623@tda|通道|TRQ|tongdao|td|1624@tdo|田东|TDZ|tiandong|td|1625@tga|天岗|TGL|tiangang|tg|1626@tgl|土贵乌拉|TGC|togrogul|tgwl|1627@tgo|通沟|TOL|tonggou|tg|1628@tgu|太谷|TGV|taigu|tg|1629@tha|棠海|THM|tanghai|th|1630@tha|塔哈|THX|taha|th|1631@the|泰和|THG|taihe|th|1632@the|唐河|THF|tanghe|th|1633@thu|太湖|TKH|taihu|th|1634@tji|团结|TIX|tuanjie|tj|1635@tjj|谭家井|TNJ|tanjiajing|tjj|1636@tjt|陶家屯|TOT|taojiatun|tjt|1637@tjw|唐家湾|PDQ|tangjiawan|tjw|1638@tjz|统军庄|TZP|tongjunzhuang|tjz|1639@tka|泰康|TKX|taikang|tk|1640@tld|吐列毛杜|TMD|tuliemaodu|tlmd|1641@tlh|图里河|TEX|tulihe|tlh|1642@tli|铁力|TLB|tieli|tl|1643@tli|铜陵|TJH|tongling|tl|1644@tli|田林|TFZ|tianlin|tl|1645@tli|亭亮|TIZ|tingliang|tl|1646@tlx|铁岭西|PXT|tielingxi|tlx|1647@tme|天门|TMN|tianmen|tm|1648@tmn|天门南|TNN|tianmennan|tmn|1649@tms|太姥山|TLS|taimushan|tms|1650@tmt|土牧尔台|TRC|tomortei|tmet|1651@tmz|土门子|TCJ|tumenzi|tmz|1652@tna|洮南|TVT|taonan|tn|1653@tna|潼南|TVW|tongnan|tn|1654@tpc|太平川|TIT|taipingchuan|tpc|1655@tpz|太平镇|TEB|taipingzhen|tpz|1656@tqi|台前|TTK|taiqian|tq|1657@tqi|图强|TQX|tuqiang|tq|1658@tql|天桥岭|TQL|tianqiaoling|tql|1659@tqz|土桥子|TQJ|tuqiaozi|tqz|1660@tsc|汤山城|TCT|tangshancheng|tsc|1661@tsh|桃山|TAB|taoshan|ts|1662@tsz|塔石嘴|TIM|tashizui|tsz|1663@ttu|通途|TUT|tongtu|tt|1664@twh|汤旺河|THB|tangwanghe|twh|1665@txi|桐乡|TCH|tongxiang|tx|1666@txi|土溪|TSW|tuxi|tx|1667@txi|同心|TXJ|tongxin|tx|1668@tya|田阳|TRZ|tianyang|ty|1669@tyi|汤阴|TYF|tangyin|ty|1670@tyi|天义|TND|tianyi|ty|1671@tyi|桃映|TKQ|taoying|ty|1672@tyl|驼腰岭|TIL|tuoyaoling|tyl|1673@tys|太阳山|TYJ|taiyangshan|tys|1674@tyu|汤原|TYB|tangyuan|ty|1675@tyy|塔崖驿|TYP|tayanyi|tyy|1676@tzd|滕州东|TEK|tengzhoudong|tzd|1677@tzh|天镇|TZV|tianzhen|tz|1678@tzh|滕州|TXK|tengzhou|tz|1679@tzh|天祝|TZJ|tianzhu|tz|1680@tzh|台州|TZH|taizhou|tz|1681@tzl|桐子林|TEW|tongzilin|tzl|1682@tzs|天柱山|QWH|tianzhushan|tzs|1683@wan|武安|WAP|wuan|wa|1684@wan|文安|WBP|wenan|wa|1685@waz|王安镇|WVP|wanganzhen|waz|1686@wca|旺苍|WEW|wangcang|wc|1687@wcg|五叉沟|WCT|wuchagou|wcg|1688@wch|温春|WDB|wenchun|wc|1689@wch|文昌|WEQ|wenchang|wc|1690@wdc|五大连池|WRB|wudalianchi|wdlc|1691@wde|文登|WBK|wendeng|wd|1692@wdg|五道沟|WDL|wudaogou|wdg|1693@wdh|五道河|WHP|wudaohe|wdh|1694@wdi|文地|WNZ|wendi|wd|1695@wdo|卫东|WVT|weidong|wd|1696@wds|武当山|WRN|wudangshan|wds|1697@wdu|望都|WDP|wangdu|wd|1698@weh|乌尔旗汗|WHX|orqohan|weqh|1699@wfa|潍坊|WFK|weifang|wf|1700@wft|万发屯|WFB|wanfatun|wft|1701@wfu|王府|WUT|wangfu|wf|1702@wfx|瓦房店西|WXT|wafangdianxi|wfdx|1703@wga|王岗|WGB|wanggang|wg|1704@wgo|湾沟|WGL|wangou|wg|1705@wgo|武功|WGY|wugong|wg|1706@wgt|吴官田|WGM|wuguantian|wgt|1707@wha|乌海|WVC|wuhai|wh|1708@whe|苇河|WHB|weihe|wh|1709@whu|卫辉|WHF|weihui|wh|1710@wjc|吴家川|WCJ|wujiachuan|wjc|1711@wji|渭津|WJL|weijin|wj|1712@wji|午汲|WJP|wuji|wj|1713@wji|威箐|WAM|weiqing|wq|1714@wji|五家|WUB|wujia|wj|1715@wjw|王家湾|WJJ|wangjiawan|wjw|1716@wke|倭肯|WQB|woken|wk|1717@wks|五棵树|WKT|wukeshu|wks|1718@wlb|五龙背|WBT|wulongbei|wlb|1719@wld|乌兰哈达|WLC|ulanhad|wlhd|1720@wle|万乐|WEB|wanle|wl|1721@wlg|瓦拉干|WVX|walagan|wlg|1722@wli|五莲|WLK|wulian|wl|1723@wli|温岭|VHH|wenling|wl|1724@wlq|乌拉特前旗|WQC|uradqranqi|wltqq|1725@wls|乌拉山|WSC|wulashan|wls|1726@wlt|卧里屯|WLX|wolitun|wlt|1727@wnb|渭南北|WBY|weinanbei|wnb|1728@wne|乌奴耳|WRX|onor|wne|1729@wni|万年|WWG|wannian|wn|1730@wni|万宁|WNQ|wanning|wn|1731@wnn|渭南南|WVY|weinannan|wnn|1732@wnz|渭南镇|WNJ|weinanzhen|wnz|1733@wpi|沃皮|WPT|wopi|wp|1734@wpu|吴堡|WUY|wupu|wb|1735@wqi|武清|WWP|wuqing|wq|1736@wqi|汪清|WQL|wangqing|wq|1737@wqi|吴桥|WUP|wuqiao|wq|1738@wsh|文水|WEV|wenshui|ws|1739@wsh|武山|WSJ|wushan|ws|1740@wsz|魏善庄|WSP|weishanzhuang|wsz|1741@wto|王瞳|WTP|wangtong|wt|1742@wts|五台山|WSV|wutaishan|wts|1743@wtz|王团庄|WZJ|wangtuanzhuang|wtz|1744@wwu|五五|WVR|wuwu|ww|1745@wxd|无锡东|WGH|wuxidong|wxd|1746@wxi|武乡|WVV|wuxiang|wx|1747@wxi|闻喜|WXV|wenxi|wx|1748@wxi|卫星|WVB|weixing|wx|1749@wxq|无锡新区|IFH|wuxixinqu|wxxq|1750@wxu|吴圩|WYZ|wuxu|wy|1751@wxu|武穴|WXN|wuxue|wx|1752@wya|王杨|WYB|wangyang|wy|1753@wyi|武义|RYH|wuyi|wy|1754@wyi|五营|WWB|wuying|wy|1755@wyt|瓦窑田|WIM|wayaotian|wjt|1756@wyu|五原|WYC|wuyuan|wy|1757@wzg|苇子沟|WZL|weizigou|wzg|1758@wzh|五寨|WZV|wuzhai|wz|1759@wzh|韦庄|WZY|weizhuang|wz|1760@wzt|王兆屯|WZB|wangzhaotun|wzt|1761@wzz|魏杖子|WKD|weizhangzi|wzz|1762@wzz|微子镇|WQP|weizizhen|wzz|1763@xan|兴安|XAZ|xingan|xa|1764@xan|新安|EAM|xinan|xa|1765@xax|新安县|XAF|xinanxian|xax|1766@xba|新保安|XAP|xinbaoan|xba|1767@xbc|下板城|EBP|xiabancheng|xbc|1768@xbl|西八里|XLP|xibali|xbl|1769@xch|兴城|XCD|xingcheng|xc|1770@xch|宣城|ECH|xuancheng|xc|1771@xcu|小村|XEM|xiaocun|xc|1772@xcy|新绰源|XRX|xinchuoyuan|xcy|1773@xcz|新城子|XCT|xinchengzi|xcz|1774@xcz|下城子|XCB|xiachengzi|xcz|1775@xde|喜德|EDW|xide|xd|1776@xdj|小得江|EJM|xiaodejiang|xdj|1777@xdm|西大庙|XMP|xidamiao|xdm|1778@xdo|小东|XOD|xiaodong|xdo|1779@xdo|小董|XEZ|xiaodong|xd|1780@xfe|襄汾|XFV|xiangfen|xf|1781@xfe|信丰|EFG|xinfeng|xf|1782@xfe|息烽|XFW|xifeng|xf|1783@xga|孝感|XGN|xiaogan|xg|1784@xga|新干|EGG|xingan|xg|1785@xgc|西固城|XUJ|xigucheng|xgc|1786@xgy|夏官营|XGJ|xiaguanying|xgy|1787@xgz|西岗子|NBB|xigangzi|xgz|1788@xhe|宣和|XWJ|xuanhe|xh|1789@xhe|新和|XIR|xinhe|xh|1790@xhe|襄河|XXB|xianghe|xh|1791@xhj|斜河涧|EEP|xiehejian|xhj|1792@xht|新华屯|XAX|xinhuatun|xht|1793@xhu|宣化|XHP|xuanhua|xh|1794@xhu|新化|EHQ|xinhua|xh|1795@xhu|新华|XHB|xinhua|xh|1796@xhx|兴和西|XEC|xinghexi|xhx|1797@xhy|下花园|XYP|xiahuayuan|xhy|1798@xhy|小河沿|XYD|xiaoheyan|xhy|1799@xhz|小河镇|EKY|xiaohezhen|xhz|1800@xji|新江|XJM|xinjiang|xj|1801@xji|辛集|ENP|xinji|xj|1802@xji|新绛|XJV|xinjiang|xj|1803@xji|峡江|EJG|xiajiang|xj|1804@xji|徐家|XJB|xujia|xj|1805@xjk|西街口|EKM|xijiekou|xjk|1806@xjt|许家台|XTJ|xujiatai|xjt|1807@xjt|许家屯|XJT|xujiatun|xjt|1808@xjz|谢家镇|XMT|xiejiazhen|xjz|1809@xka|兴凯|EKB|xingkai|xk|1810@xla|香兰|XNB|xianglan|xl|1811@xla|小榄|EAQ|xiaolan|xl|1812@xld|兴隆店|XDD|xinglongdian|xld|1813@xle|新乐|ELP|xinle|xl|1814@xli|仙林|XPH|xianlin|xl|1815@xli|西柳|GCT|xiliu|xl|1816@xli|西林|XYB|xilin|xl|1817@xli|新李|XLJ|xinli|xl|1818@xli|小岭|XLB|xiaoling|xl|1819@xli|新林|XPX|xinlin|xl|1820@xlt|新立屯|XLD|xinlitun|xlt|1821@xlz|新立镇|XGT|xinlizhen|xlz|1822@xlz|兴隆镇|XZB|xinglongzhen|xlz|1823@xmi|新民|XMD|xinmin|xm|1824@xms|西麻山|XMB|ximashan|xms|1825@xmt|下马塘|XAT|xiamatang|xmt|1826@xna|孝南|XNV|xiaonan|xn|1827@xnb|咸宁北|XRN|xianningbei|xnb|1828@xni|咸宁|XNN|xianning|xn|1829@xni|兴宁|ENQ|xingning|xn|1830@xpi|兴平|XPY|xingping|xp|1831@xpi|西平|XPN|xiping|xp|1832@xpt|新坪田|XPM|xinpingtian|xpt|1833@xpu|犀浦|XIW|xipu|xp|1834@xpu|溆浦|EPQ|xupu|xp|1835@xpu|霞浦|XOS|xiapu|xp|1836@xqi|新邱|XQD|xinqiu|xq|1837@xqi|新青|XQB|xinqing|xq|1838@xqp|兴泉堡|XQJ|xingquanpu|xqp|1839@xrq|仙人桥|XRL|xianrenqiao|xrq|1840@xsg|小寺沟|ESP|xiaosigou|xsg|1841@xsh|小哨|XAM|xiaoshao|xs|1842@xsh|徐水|XSP|xushui|xs|1843@xsh|下社|XSV|xiashe|xs|1844@xsh|浠水|XZN|xishui|xs|1845@xsh|夏石|XIZ|xiashi|xs|1846@xsh|杏树|XSB|xingshu|xs|1847@xsp|新松浦|XOB|xinsongpu|xsp|1848@xst|杏树屯|XDT|xingshutun|xst|1849@xsw|许三湾|XSJ|xusanwan|xsw|1850@xta|邢台|XTP|xingtai|xt|1851@xta|湘潭|XTQ|xiangtan|xt|1852@xtx|仙桃西|XAN|xiantaoxi|xtx|1853@xtz|下台子|EIP|xiataizi|xtz|1854@xwe|徐闻|XJQ|xuwen|xw|1855@xwp|新窝铺|EPD|xinwopu|xwp|1856@xwu|修武|XWF|xiuwu|xw|1857@xxi|孝西|XOV|xiaoxi|xx|1858@xxi|西峡|XIF|xixia|xx|1859@xxi|湘乡|XXQ|xiangxiang|xx|1860@xxi|西乡|XQY|xixiang|xx|1861@xxi|息县|ENN|xixian|xx|1862@xxi|新县|XSN|xinxian|xx|1863@xxj|小新街|XXM|xiaoxinjie|xxj|1864@xxx|新兴县|XGQ|xinxingxian|xxx|1865@xxz|小西庄|XXP|xiaoxizhuang|xxz|1866@xxz|西小召|XZC|xixiaozhao|xxz|1867@xya|旬阳|XUY|xunyang|xy|1868@xya|向阳|XDB|xiangyang|xy|1869@xyb|旬阳北|XBY|xunyangbei|xyb|1870@xyd|襄阳东|XWN|xiangyangdong|xyd|1871@xye|兴业|SNZ|xingye|xy|1872@xyg|小雨谷|XHM|xiaoyugu|xyg|1873@xyi|信宜|EEQ|xinyi|xy|1874@xyj|小月旧|XFM|xiaoyuejiu|xyj|1875@xyq|小扬气|XYX|xiaoyangqi|xyq|1876@xyu|襄垣|EIF|xiangyuan|xy|1877@xyu|祥云|EXM|xiangyun|xy|1878@xyx|夏邑县|EJH|xiayixian|xyx|1879@xyy|新友谊|EYB|xinyouyi|xyy|1880@xyz|新阳镇|XZJ|xinyangzhen|xyz|1881@xzd|徐州东|UUH|xuzhoudong|xzd|1882@xzf|新帐房|XZX|xinzhangfang|xzf|1883@xzh|忻州|XXV|xinzhou|xz|1884@xzh|新肇|XZT|xinzhao|xz|1885@xzh|悬钟|XRP|xuanzhong|xz|1886@xzi|汐子|XZD|xizi|xz|1887@xzm|西哲里木|XRD|xizhelimu|xzlm|1888@xzz|新杖子|ERP|xinzhangzi|xzz|1889@yan|永安|YAS|yongan|ya|1890@yan|依安|YAX|yian|ya|1891@yan|姚安|YAC|yaoan|ya|1892@yax|永安乡|YNB|yonganxiang|yax|1893@ybl|亚布力|YBB|yabuli|ybl|1894@ybs|元宝山|YUD|yuanbaoshan|ybs|1895@yca|羊草|YAB|yangcao|yc|1896@ycd|秧草地|YKM|yangcaodi|ycd|1897@ych|雁翅|YAP|yanchi|yc|1898@ych|郓城|YPK|yuncheng|yc|1899@ych|阳岔|YAL|yangcha|yc|1900@ych|阳城|YNF|yangcheng|yc|1901@ych|羊场|YED|yangchang|yc|1902@ych|晏城|YEK|yancheng|yc|1903@ych|禹城|YCK|yucheng|yc|1904@ych|应城|YHN|yingcheng|yc|1905@ych|宜城|YIN|yicheng|yc|1906@ych|阳春|YQQ|yangchun|yc|1907@ych|砚川|YYY|yanchuan|yc|1908@ych|盐池|YKJ|yanchi|yc|1909@ych|叶城|YER|yecheng|yc|1910@ych|迎春|YYB|yingchun|yc|1911@ych|阳澄湖|AIH|yangchenghu|ych|1912@ycl|云彩岭|ACP|yuncailing|ycl|1913@ycx|虞城县|IXH|yuchengxian|ycx|1914@ycz|营城子|YCT|yingchengzi|ycz|1915@yde|英德|YDQ|yingde|yd|1916@yde|永登|YDJ|yongdeng|yd|1917@ydi|永定|YGS|yongding|yd|1918@ydi|尹地|YDM|yindi|yd|1919@yds|雁荡山|YGH|yandangshan|yds|1920@ydu|园墩|YAJ|yuandun|yd|1921@ydu|于都|YDG|yudu|yd|1922@ydx|英德西|IIQ|yingdexi|ydx|1923@yfy|永丰营|YYM|yongfengying|yfy|1924@yga|阳高|YOV|yanggao|yg|1925@yga|杨岗|YRB|yanggang|yg|1926@ygu|阳谷|YIK|yanggu|yg|1927@yha|余杭|EVH|yuhang|yh|1928@yha|友好|YOB|youhao|yh|1929@yhc|沿河城|YHP|yanhecheng|yhc|1930@yhu|岩会|AEP|yanhui|yh|1931@yjh|羊臼河|YHM|yangjiuhe|yjh|1932@yji|姚家|YAT|yaojia|yj|1933@yji|燕郊|AJP|yanjiao|yj|1934@yji|叶集|YCH|yeji|yj|1935@yji|余江|YHG|yujiang|yj|1936@yji|盐津|AEW|yanjin|yj|1937@yji|营街|YAM|yingjie|yj|1938@yji|永嘉|URH|yongjia|yj|1939@yjj|岳家井|YGJ|yuejiajing|yjj|1940@yjp|一间堡|YJT|yijianpu|yjb|1941@yjs|云居寺|AFP|yunjusi|yjs|1942@yjs|英吉沙|YIR|yingjisha|yjs|1943@yjz|燕家庄|AZK|yanjiazhuang|yjz|1944@yka|永康|RFH|yongkang|yk|1945@ykd|营口东|YGT|yingkoudong|ykd|1946@yla|永郎|YLW|yonglang|yl|1947@yla|银浪|YJX|yinlang|yl|1948@ylb|宜良北|YSM|yiliangbei|ylb|1949@yld|永乐店|YDY|yongledian|yld|1950@ylh|伊拉哈|YLX|yilaha|ylh|1951@yli|杨林|YLM|yanglin|yl|1952@yli|彝良|ALW|yiliang|yl|1953@yli|杨陵|YSY|yangling|ylz|1954@yli|伊林|YLB|yilin|yl|1955@ylp|余粮堡|YLD|yuliangpu|ylb|1956@ylq|杨柳青|YQP|yangliuqing|ylq|1957@ylt|月亮田|YUM|yueliangtian|ylt|1958@ylw|亚龙湾|TWQ|yalongwan|ylw|1959@yma|义马|YMF|yima|ym|1960@yme|云梦|YMN|yunmeng|ym|1961@yme|玉门|YXJ|yumen|ym|1962@ymo|元谋|YMM|yuanmou|ym|1963@ymp|阳明堡|YVV|yangmingpu|ymp|1964@yms|一面山|YST|yimianshan|yms|1965@yna|宜耐|YVM|yinai|yn|1966@yna|沂南|YNK|yinan|yn|1967@ynd|伊宁东|YNR|yiningdong|ynd|1968@yps|营盘水|YZJ|yingpanshui|yps|1969@ypu|羊堡|ABM|yangpu|yp|1970@yqb|阳泉北|YPP|yangquanbei|yqb|1971@yqi|源迁|AQK|yuanqian|yq|1972@yqi|焉耆|YSR|yanqi|yq|1973@yqi|乐清|UPH|yueqing|yq|1974@yqt|姚千户屯|YQT|yaoqianhutun|yqht|1975@yqu|阳曲|YQV|yangqu|yq|1976@ysg|榆树沟|YGP|yushugou|ysg|1977@ysh|元氏|YSP|yuanshi|ys|1978@ysh|窑上|ASP|yaoshang|ys|1979@ysh|榆社|YSV|yushe|ys|1980@ysh|沂水|YUK|yishui|ys|1981@ysh|偃师|YSF|yanshi|ys|1982@ysh|玉石|YSJ|yushi|ys|1983@ysh|月山|YBF|yueshan|ys|1984@ysl|杨树岭|YAD|yangshuling|ysl|1985@ysp|野三坡|AIP|yesanpo|ysp|1986@yst|榆树台|YUT|yushutai|yst|1987@yst|榆树屯|YSX|yushutun|yst|1988@ysz|鹰手营子|YIP|yingshouyingzi|ysyz|1989@yta|源潭|YTQ|yuantan|yt|1990@ytp|牙屯堡|YTZ|yatunpu|ytb|1991@yts|烟筒山|YSL|yantongshan|yts|1992@ytt|烟筒屯|YUX|yantongtun|ytt|1993@yws|羊尾哨|YWM|yangweishao|yws|1994@yxi|永修|ACG|yongxiu|yx|1995@yxi|玉溪|YXM|yuxi|yx|1996@yxi|攸县|YOG|youxian|yx|1997@yxi|越西|YHW|yuexi|yx|1998@yya|余姚|YYH|yuyao|yy|1999@yya|酉阳|AFW|youyang|yy|2000@yyd|岳阳东|YIQ|yueyangdong|yyd|2001@yyd|弋阳东|YIG|yiyangdong|yyd|2002@yyi|阳邑|ARP|yangyi|yy|2003@yyu|鸭园|YYL|yayuan|yy|2004@yyz|鸳鸯镇|YYJ|yuanyangzhen|yyz|2005@yzb|燕子砭|YZY|yanzibian|yzb|2006@yzh|兖州|YZK|yanzhou|yz|2007@yzh|仪征|UZH|yizheng|yz|2008@yzh|宜州|YSZ|yizhou|yz|2009@yzi|迤资|YQM|yizi|yz|2010@yzw|羊者窝|AEM|yangzhewo|wzw|2011@yzz|杨杖子|YZD|yangzhangzi|yzz|2012@zan|治安|ZAD|zhian|za|2013@zan|镇安|ZEY|zhenan|za|2014@zba|招柏|ZBP|zhaobai|zb|2015@zbw|张百湾|ZUP|zhangbaiwan|zbw|2016@zch|赵城|ZCV|zhaocheng|zc|2017@zch|邹城|ZIK|zoucheng|zc|2018@zch|诸城|ZQK|zhucheng|zc|2019@zch|子长|ZHY|zichang|zc|2020@zch|枝城|ZCN|zhicheng|zc|2021@zda|章党|ZHT|zhangdang|zd|2022@zdo|肇东|ZDB|zhaodong|zd|2023@zfp|照福铺|ZFM|zhaofupu|zfp|2024@zgt|章古台|ZGD|zhanggutai|zgt|2025@zgu|赵光|ZGB|zhaoguang|zg|2026@zhe|中和|ZHX|zhonghe|zh|2027@zhm|中华门|VNH|zhonghuamen|zhm|2028@zjb|枝江北|ZIN|zhijiangbei|zjb|2029@zjc|钟家村|ZJY|zhongjiacun|zjc|2030@zjg|紫荆关|ZYP|zijingguan|zjg|2031@zjg|朱家沟|ZUB|zhujiagou|zjg|2032@zji|诸暨|ZDH|zhuji|zj|2033@zji|周家|ZOB|zhoujia|zj|2034@zjn|镇江南|ZEH|zhenjiangnan|zjn|2035@zjt|郑家屯|ZJD|zhengjiatun|zjt|2036@zjt|周家屯|ZOD|zhoujiatun|zjt|2037@zjw|褚家湾|CWJ|zhujiawan|cjw|2038@zjx|湛江西|ZWQ|zhanjiangxi|zjx|2039@zjy|朱家窑|ZUJ|zhujiayao|zjy|2040@zjz|曾家坪子|ZBW|caojiapingzi|zjpz|2041@zla|镇赉|ZLT|zhenlai|zl|2042@zla|张兰|ZLV|zhanglan|zla|2043@zli|枣林|ZIV|zaolin|zl|2044@zlt|扎鲁特|ZLD|zhalute|zlt|2045@zlx|扎赉诺尔西|ZXX|jalainurxi|zlnex|2046@zmt|樟木头|ZOQ|zhangmutou|zmt|2047@zmu|中牟|ZGF|zhongmu|zm|2048@znd|中宁东|ZDJ|zhongningdong|znd|2049@zni|中宁|VNJ|zhongning|zn|2050@znn|中宁南|ZNJ|zhongningnan|znn|2051@zpi|漳平|ZPS|zhangping|zp|2052@zpi|镇平|ZPF|zhenping|zp|2053@zpu|泽普|ZPR|zepu|zp|2054@zqi|章丘|ZTK|zhangqiu|zq|2055@zqi|张桥|ZQY|zhangqiao|zq|2056@zqi|枣强|ZVP|zaoqiang|zq|2057@zrh|朱日和|ZRC|zhurihe|zrh|2058@zrl|泽润里|ZLM|zerunli|zrl|2059@zsb|中山北|ZGQ|zhongshanbei|zsb|2060@zsd|樟树东|ZOG|zhangshudong|zsd|2061@zsh|樟树|ZSG|zhangshu|zs|2062@zsh|钟山|ZSZ|zhongshan|zs|2063@zsh|柞水|ZSY|zhashui|zs|2064@zsh|中山|ZSQ|zhongshan|zs|2065@zwo|珠窝|ZOP|zhuwo|zw|2066@zwt|张维屯|ZWB|zhangweitun|zwt|2067@zwu|彰武|ZWD|zhangwu|zw|2068@zxi|张辛|ZIP|zhangxin|zx|2069@zxi|镇西|ZVT|zhenxi|zx|2070@zxi|资溪|ZXS|zixi|zx|2071@zxi|钟祥|ZTN|zhongxiang|zx|2072@zxi|棕溪|ZOY|zongxi|zx|2073@zxq|正镶白旗|ZXC|zhengxiangbaiqi|zxbq|2074@zya|枣阳|ZYN|zaoyang|zy|2075@zya|紫阳|ZVY|ziyang|zy|2076@zyb|竹园坝|ZAW|zhuyuanba|zyb|2077@zye|张掖|ZYJ|zhangye|zy|2078@zyu|镇远|ZUW|zhenyuan|zy|2079@zyx|朱杨溪|ZXW|zhuyangxi|zyx|2080@zzd|漳州东|GOS|zhangzhoudong|zzd|2081@zzh|涿州|ZXP|zhuozhou|zz|2082@zzh|中寨|ZZM|zhongzhai|zz|2083@zzh|子洲|ZZY|zizhou|zz|2084@zzh|壮志|ZUX|zhuangzhi|zz|2085@zzh|漳州|ZUS|zhangzhou|zz|2086@zzi|咋子|ZAL|zhazi|zz|2087@zzs|卓资山|ZZC|zhuozishan|zzs|2088@zzx|株洲西|ZAQ|zhuzhouxi|zzx|2089@ayd|安阳东|ADF|anyangdong|ayd|2090@bch|栟茶|FWH|bencha|bc|2091@bdd|保定东|BMP|baodingdong|bdd|2092@bha|滨海|FHP|binhai|bh|2093@bhb|滨海北|FCP|binhaibei|bhb|2094@bjn|宝鸡南|BBY|baojinan|bjn|2095@csb|长寿北|COW|changshoubei|csb|2096@csh|潮汕|CBQ|chaoshan|cs|2097@cxi|长兴|CBH|changxing|cx|2098@cya|潮阳|CNQ|chaoyang|cy|2099@cya|长阳|CYN|changyang|cy|2100@dad|东安东|DCZ|dongandong|dad|2101@ddh|东戴河|RDD|dongdaihe|ddh|2102@deh|东二道河|DRB|dongerdaohe|dedh|2103@dgu|东莞|RTQ|dongguan|dg|2104@dju|大苴|DIM|daju|dj|2105@dqg|大青沟|DSD|daqinggou|dqg|2106@dqi|德清|DRH|deqing|dq|2107@dzd|定州东|DOP|dingzhoudong|dzd|2108@fcb|防城港北|FBZ|fangchenggangbei|fcgb|2109@fch|富川|FDZ|fuchuan|fc|2110@fdu|丰都|FUW|fengdu|fd|2111@flb|涪陵北|FEW|fulingbei|flb|2112@fyu|抚远|FYB|fuyuan|fy|2113@fzh|抚州|FZG|fuzhou|fz|2114@gbd|高碑店东|GMP|gaobeidiandong|gbdd|2115@gju|革居|GEM|geju|gj|2116@gmc|光明城|IMQ|guangmingcheng|gmc|2117@gpi|桂平|GAZ|guiping|gp|2118@gtb|广通北|GPM|guangtongbei|gtb|2119@gyx|高邑西|GNP|gaoyixi|gyx|2120@hbd|鹤壁东|HFF|hebidong|hbd|2121@hcg|寒葱沟|HKB|hanconggou|hcg|2122@hdd|邯郸东|HPP|handandong|hdd|2123@hdo|惠东|KDQ|huidong|hd|2124@hfc|合肥北城|COH|hefeibeicheng|hfbc|2125@hgd|横沟桥东|HNN|henggouqiaodong|hgqd|2126@hhe|洪河|HPB|honghe|hh|2127@hme|虎门|IUQ|humen|hm|2128@hme|鲘门|KMQ|houmen|hm|2129@hmn|哈密南|HLR|haminan|hmn|2130@hnd|淮南东|HOH|huainandong|hnd|2131@hqi|霍邱|FBH|huoqiu|hq|2132@hsd|贺胜桥东|HLN|heshengqiaodong|hsqd|2133@hzn|惠州南|KNQ|huizhounan|hzn|2134@jlb|军粮城北|JMP|junliangchengbei|jlcb|2135@jle|将乐|JLS|jiangle|jl|2136@jnb|建宁县北|JCS|jianningxianbei|jnxb|2137@jni|江宁|JJH|jiangning|jn|2138@jrx|句容西|JWH|jurongxi|jrx|2139@jsh|建水|JSM|jianshui|js|2140@klu|库伦|KLD|kulun|kl|2141@kta|葵潭|KTQ|kuitan|kt|2142@lbi|灵璧|GMH|lingbi|lb|2143@ldy|离堆公园|INW|liduigongyuan|ldgy|2144@lfe|陆丰|LLQ|lufeng|lf|2145@lfn|禄丰南|LQM|lufengnan|lfn|2146@lhe|滦河|UDP|luanhe|lh|2147@lhx|漯河西|LBN|luohexi|lhx|2148@lsh|溧水|LDH|lishui|ls|2149@lya|溧阳|LEH|liyang|ly|2150@mgd|明港东|MDN|minggangdong|mgd|2151@msh|庙山|MSN|miaoshan|ms|2152@mzb|蒙自北|MBM|mengzibei|mzb|2153@nch|南城|NDG|nancheng|nc|2154@ncx|南昌西|NXG|nanchangxi|ncx|2155@nfe|南丰|NFG|nanfeng|nf|2156@nhd|南湖东|NDN|nanhudong|nhd|2157@pan|普安|PAN|puan|pa|2158@pni|普宁|PEQ|puning|pn|2159@pnn|平南南|PAZ|pingnannan|pn|2160@pzh|彭州|PMW|pengzhou|pz|2161@qdb|青岛北|QHK|qingdaobei|qdb|2162@qdo|祁东|QMQ|qidong|qd|2163@qfe|前锋|QFB|qianfeng|qf|2164@qsh|庆盛|QSQ|qingsheng|qs|2165@qsh|岐山|QAY|qishan|qs|2166@qya|祁阳|QWQ|qiyang|qy|2167@qzn|全州南|QNZ|quanzhounan|qzn|2168@rdo|如东|RIH|rudong|rd|2169@rpi|饶平|RVQ|raoping|rp|2170@sho|泗洪|GQH|sihong|sh|2171@smb|三明北|SHS|sanmingbei|smb|2172@spd|山坡东|SBN|shanpodong|spd|2173@swe|汕尾|OGQ|shanwei|sw|2174@sxb|绍兴北|SLH|shaoxingbei|sxb|2175@sxi|泗县|GPH|sixian|sx|2176@sya|泗阳|MPH|siyang|sy|2177@syb|上虞北|SSH|shangyubei|syb|2178@szb|深圳北|IOQ|shenzhenbei|szb|2179@szh|神州|SRQ|shenzhou|sz|2180@szs|石嘴山|QQJ|shizuishan|szs|2181@szs|深圳坪山|IFQ|shenzhenpingshan|szps|2182@szx|石柱县|OSW|shizhuxian|szx|2183@tdd|土地堂东|TTN|tuditangdong|tdtd|2184@tha|通海|TAM|tonghai|th|2185@thx|通化县|TXL|tonghuaxian|thx|2186@tni|泰宁|TNS|taining|tn|2187@txh|汤逊湖|THN|tangxunhu|txh|2188@txi|藤县|TAZ|tengxian|tx|2189@wln|乌龙泉南|WFN|wulongquannan|wlqn|2190@wns|五女山|WET|wunvshan|wns|2191@wws|瓦屋山|WAH|wawushan|wws|2192@wzn|梧州南|WBZ|wuzhounan|wzn|2193@xcd|许昌东|XVF|xuchangdong|xcd|2194@xfe|西丰|XFT|xifeng|xf|2195@xgb|孝感北|XJN|xiaoganbei|xgb|2196@xnd|咸宁东|XKN|xianningdong|xnd|2197@xnn|咸宁南|UNN|xianningnan|xnn|2198@xtd|邢台东|EDP|xingtaidong|xtd|2199@xxd|新乡东|EGF|xinxiangdong|xxd|2200@xyc|西阳村|XQF|xiyangcun|xyc|2201@xyd|咸阳秦都|XOY|xianyangqindu|xyqd|2202@xyd|信阳东|OYN|xinyangdong|xyd|2203@ybl|迎宾路|YFW|yingbinlu|ybl|2204@yfn|永福南|YBZ|yongfunan|yfn|2205@yge|雨格|VTM|yuge|yg|2206@yhe|洋河|GTH|yanghe|yh|2207@yln|杨陵南|YEY|yanglingnan|yln|2208@yta|永泰|YTS|yongtai|yt|2209@yxi|宜兴|YUH|yixing|yx|2210@yxi|云霄|YBS|yunxiao|yx|2211@yxi|尤溪|YXS|youxi|yx|2212@yyb|余姚北|CTH|yuyaobei|yyb|2213@zan|诏安|ZDS|zhaoan|za|2214@zdc|正定机场|ZHP|zhengdingjichang|zdjc|2215@zfd|纸坊东|ZMN|zhifangdong|zfd|2216@zji|织金|IZW|zhijin|zj|2217@zmx|驻马店西|ZLN|zhumadianxi|zmdx|2218@zpu|漳浦|ZCS|zhangpu|zp|2219@zqi|庄桥|ZQH|zhuangqiao|zq|2220@zzd|郑州东|ZAF|zhengzhoudong|zzd|2221@zzd|卓资东|ZDC|zhuozidong|zzd|2222@zzd|涿州东|ZAP|zhuozhoudong|zzd|2223';
		var station = station_names.split('@');
		console.log(station);

		// Public API here
		return {
			//getTheme:getTh,
		};

		function get(){
			if(!map){
				//    $cookies.map = 0;
				$cookieStore.put('map', 0);
				map = 0;
			}
			return map;
		};

		function set(i){
			$cookieStore.put('map', i);
			map = i;
		};


		function getLang(){
			if($cookieStore.get('lang') != 0 && $cookieStore.get('lang') != 1){
				$cookieStore.put('lang', 1);
			}

			return  $cookieStore.get('lang');
		}

		function setLang(lang){

			$cookieStore.put('lang',lang);
		}

		function getTh(){
			if(!angular.isNumber($cookieStore.get('theme'))){
				$cookieStore.put('theme', 0);
			}

			return  $cookieStore.get('theme');
		}

		function setTh(th){
			$cookieStore.put('theme',th);
		}
	});
;'use strict';
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
