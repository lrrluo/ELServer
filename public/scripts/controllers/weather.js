/**
 *
 * Created by L on 14-3-19.
 */
'use strict';

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
