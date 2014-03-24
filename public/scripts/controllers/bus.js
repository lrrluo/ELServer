/**
 * Created by L on 14-3-23.
 */
'use strict';

angular.module('easyApp')
    .controller('BusCtrl',
        ['$scope','$location','cookie','Language', '$http', function ($scope, $location, cookie, Language, $http) {

            var language = Language["bus"];
            var commonLang = Language['common'];
            $scope.chartConfig = {};
            function init(sign){
                $scope.title = language.title[sign];
                $scope.search_T = commonLang.sear[sign];
                $scope.phBusName = language.placeholderBus[sign];
            }

            init(cookie.getLang());


            $scope.getBus = function(bus){
                var i, obj = {name:'', data:[]};
                if(!bus){
                    return false;
                }
                $http.get('/service/GDbus?bus='+bus).success(function(data){
                    console.log(data);
                    if(data.error){
                        alert(language.errorBus[cookie.getLang()]);
                        return false;
                    }

                    $scope.chartConfig.options ={
                       chart:{
                            type : 'column'
                        },
                       title: {
                           text: data['upRoute'].name
                       },
                       xAxis: {
                           category: []
                       },
                       yAxis: {
                           title: {
                               text: language.busNumber[cookie.getLang()]
                           }
                       },
                       legend: {
                           enabled: false
                       },
                       plotOptions: {
                           series: {
                               borderWidth: 0,
                               dataLabels: {
                                   enabled: true,
                                   format: '{point.y:.1f}%'
                               }
                           }
                       },
                       tooltip: {
                           headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                           pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                       }
                   }
                    obj.name = language.busNumber[cookie.getLang()];
                    for(i = 0; i < data['upRoute'].length; i++){
                        obj.data.push(1);
                        $scope.chartConfig.options.xAxis.category.push(data['upRoute'][route][i].stopName);
                    }
                    $scope.chartConfig.series = obj;
                    console.log($scope.chartConfig);
                })

            }

            $scope.$on('switchLang',function(e,index){
                init(cookie.getLang());
            });

    }])
