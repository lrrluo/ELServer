/**
 *
 * Created by L on 14-3-19.
 */
'use strict';

angular.module('easyApp')
    .controller('WeatherCtrl',
        ['$scope','$location','cookie','Language', '$http', function ($scope, $location, cookie, Language, $http) {

            //get the local city by baiduMap api and get the local weather
            setTimeout(function(){
                var myCity = new BMap.LocalCity();
                myCity.get(function(resutl){
                    var city = new String(resutl.name);
                    console.log(city)
                    city = city.replace(/市/,'');
                    console.log(city);
                    $scope.getWeather(city);
                });
            },0)
            var language = Language["weather"];
            var commonLang = Language['common'];
            function init(sign){
                $scope.title = language.title[sign];
                $scope.cityName = language.cityName[sign] ;
                $scope.search_T = commonLang.sear[sign];
                $scope.phCityName = language.placeholderCity[sign];
            }

            init(cookie.getLang());

            function chartSeries(data) {
                var ret = [];
                if(!data){
                    return [{"name": "", "data": []},{"name": "", "data": []}]
                }
                else{
                    ret[0] = {
                        name: language.lowTem[cookie.getLang()],
                        data: [
                            +data[5].split('\/')[0].match(/\d+/)[0],
                            +data[12].split('\/')[0].match(/\d+/)[0],
                            +data[17].split('\/')[0].match(/\d+/)[0]
                        ]
                    }
                    ret[1] = {
                        name: language.highTem[cookie.getLang()],
                        data: [
                            +data[5].split('\/')[1].match(/\d+/)[0],
                            +data[12].split('\/')[1].match(/\d+/)[0],
                            +data[17].split('\/')[1].match(/\d+/)[0]
                        ]
                    }
                    return ret;
                }
            }



            $scope.getWeather = function(city){
                if(city){
                    if($scope.charConfig){
                        $scope.charConfig.loading = true;
                    }
                    $http.get('/service/weather?city='+city).success(function(data){
                        console.log(data);
                        if(!data[1]){
                            alert(language.errorCity[cookie.getLang()]);
                            $scope.city = "";
                            return false;
                        }
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
                    //$scope.charConfig.loading = true;
                })
            }
            return false;
        }


            $scope.$on('switchLang',function(e,index){
                init(cookie.getLang());
            });

}])
