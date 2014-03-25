/**
 * Created by L on 14-3-23.
 */
'use strict';

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
