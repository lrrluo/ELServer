'use strict';

angular.module('corsNgApp')
  .controller('MaphistoryCtrl', function ($scope,Baidumap,Googlemap,cookie,Language) {

        $scope.language = Language["mapHistory"];
        var map = Baidumap;
        var mapType = cookie.getMap();
        function init(sign){
            $scope.title = $scope.language.title[sign];
            $scope.ms = $scope.language.mobileStation[sign];
            $scope.st = $scope.language.state[sign];
            $scope.co = $scope.language.color[sign];
            $scope.ST = $scope.language.startTime[sign];
            $scope.ET = $scope.language.endTime[sign];
            $scope.submit = $scope.language.submit[sign];
            $scope.back = $scope.language.back[sign];

        }

        init(cookie.getLang());

        if(mapType == 0){
            map = Googlemap;
            setTimeout(function(){
                map.init("content", {
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            },0);
        }
        else{
            setTimeout(function(){
                map.init("content", {
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            },0)
        }





        setTimeout(function(){
            map.init("content", {
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        },0)

        $scope.$on('switchLang',function(e,index){
            init(cookie.getLang());
        });

        $scope.$on('switchMap',function(e,index){
            console.log(index);
            if(index === mapType){
                return;
            }
            else{
                if(index == 1){
                    map = Baidumap;
                    map.init("content", {
                        // center: new google.maps.LatLng(-34.397, 150.644),
                    });
                }
                else{
                    map = Googlemap;
                    map.init("content", {
                        zoom: 10,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                }
                mapType = index;
            }

        });

        $scope.mobileList = ["移动站1","移动站2","移动站3","移动站4"];
        $scope.colorList = ["green","orange","gray","red"];
        $scope.mobile = 0;//移动站值，index
        $scope.jieState = 1;//解状态
        $scope.color = 0;
        $scope.jieList = [
            {name:"固定解",value:4},{name:"浮动解",value:3},
            {name:"单点",value:1}
        ]

        $scope.saveEndTime = function(){
            console.log($scope.endTime);
        }

        $scope.myhide = true;
  });
