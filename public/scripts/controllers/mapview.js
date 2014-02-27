'use strict';

angular.module('corsNgApp')
    .controller('MapviewCtrl', function ($scope,Baidumap,Googlemap,cookie) {

        var map = Baidumap;
        var mapType = cookie.getMap();

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


        $scope.title = "轨迹显示";



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

    });
