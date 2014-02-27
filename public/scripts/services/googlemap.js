'use strict';

angular.module('corsNgApp')
  .factory('Googlemap', function Googlemap() {
    // AngularJS will instantiate a singleton by calling "new" on this function
        // 通过 require 引入依赖
        //   var $ = require('jquery');
        //  var Spinning = require('./spinning');

        // 通过 exports 对外提供接口
        //exports.doSomething = ...

        // 或者通过 module.exports 提供整个接口
        var map,
            realTime,markers,markerTrack,polyLine,timerDrawRoute,timerTrack,markerIconList,centerPoint;

        markers = {};
        polyLine = [];
        markerTrack = [];
        timerTrack = [];        //为了应付多个历史轨迹，对应多个定时器。

        markerIconList = {
            "green": "../../images/googlemap_icon_green.gif",
            "orange": "../../images/googlemap_icon_orange.gif",
            "gray": "../../images/googlemap_icon_gray.gif",
            "red": "../../images/googlemap_icon_red.gif",

            "greenHistory": "../../images/hgreen.png",
            "orangeHistory": "../../images/horange.png",
            "grayHistory": "../../images/hgray.png",
            "redHistory": "../../images/hred.png"
        };


        return {
            init: initMap,
            //  addMarker: addMaker,
            //  drawRoute:drawRoute,
            drawTrack: drawTrack,
            cleanMap: cleanMap,
            cleanMarker: cleanMarkers,
            cleanPoly: cleanPoly,
            cleanTrack: cleanMarkerTrack,
            getIcon: getIcon,
            getTraceIcon:getHistoryIcon,
            realTimeTick:realTimeFlesh
        };


        function initMap(container,options){
            map = new google.maps.Map(document.getElementById(container), options);
            var geocoder;
            if(!options.center){
                geocoder = new google.maps.Geocoder();
                geocoder.geocode( { 'address': 'china,GZ'}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        /*                    var marker = new google.maps.Marker({
                         map: map,
                         position: results[0].geometry.location
                         });*/
                    } else {
                        alert("Geocode was not successful for the following reason: " + status);
                    }
                });
            }
            realTime = true; //not used

        }

        //callpre 要执行marker的更新时的前一步动作，用户自定义，例如可以改变某些状态，最后返回一个点的集合就好了。
        function realTimeFlesh(callpre,callback){

            //   var collection = callpre();
            var promise = callpre();
            promise.then(function(collection){
                var i,length,marker,icon,point;
                if(realTime === true){
                    for(i = 0;i < collection.length; i++){
                        point = collection[i];
                        if(markers[point.no] && markers[point.no].length > 0){      //如果有值，就把上一次push的值的图标改成历史图标。
                            marker =  markers[point.no];
                            marker[marker.length -1].setIcon(getHistoryIcon(marker[marker.length -1].getIcon()));
                        }
                        else{           //如果不是，就代表是新的一个集合。
                            markers[point.no] = [];
                            marker = markers[point.no];
                        }
                        if(point.posState >= point.selfPos || point.state != 0){    //解状态,第一个是gga状态。第二个是该站点的解状态
                            marker.push(createMarker(point));
                        }
                        else{
                            //   realRock = false;
                        }
                    }
                    //callback();
                }
                else{
                    // callback();
                }
            })


        }

        function createMarker(option) {
            var IconImg = getColor(option.color);

            var myLatLng = new google.maps.LatLng(option.longitude, option.latitude);
            var beachMarker = new google.maps.Marker({
                position: myLatLng,
                icon: IconImg,
                map: map,
                zIndex: markers.length,
                title: option.no
            });

            google.maps.event.addListener(beachMarker, 'mouseover', function () {
                //   showInfoWindow(false, beachMarker, myDate, myNo, myName, "B:" + covertLBFormat(myLatitude) + " <br/>L:" + covertLBFormat(myLongitude));
            });
            google.maps.event.addListener(beachMarker, 'mouseout', function () {

            });
            google.maps.event.addListener(beachMarker, 'click', function () {//showInfoWindow
                map.setCenter(myLatLng);
            });
            // markers = markers.concat(beachMarker);
            return beachMarker;
        }


        function drawTrack(points,options,callback){//options.createmarker 是用于处部传一个方法来自定义创建一个marker，return 一个marker
            var i,timer,
                track = points;
            map.setCenter( new google.maps.LatLng(points[0].longitude,points[0].latitude));
            map.setZoom(16);
            i = 0;

            timer = setInterval(function(){
                var ma,latLng;
                latLng = new google.maps.LatLng(points[i].longitude,points[i].latitude);
                //  BMap.Convertor.translate(new BMap.Point(points[i].longitude, points[i].latitude),0,function(p){         //translate 是用于将gps数据转化成百度地图的坐标，很特别。
                // console.log("trans:"+i);

                if(i === points.length ){                       //有时可能停止了，但定时器刚好进来了，就会出错，所以这里预防错误。
                    return false;
                }
                if(points[i].ggaState >= options.state ){
                    if(options.createMarker){                   //如果外部提供了创建makrker的方法，就调用，否则就默认创建一个。
                        if(i === points.length -1){
                            ma = options.createMarker({point:latLng,color:options.color,isLast:true});
                        }
                        else{
                            ma = options.createMarker({point:latLng,color:options.color});
                        }

                    }
                    else{
                        ma = new google.maps.Marker({
                            position: latLng,
                            title: "Default marker"
                        });
                    }
                    ma.setMap(map);
                    map.setCenter(latLng);
                    markerTrack.push(ma);

                    i = i + 1;
                    if( i === points.length){
                        clearInterval(timer);
                        callback();
                    }
                }

                //      });
            },options.interval);
            timerTrack.push(timer);

        }



        function cleanMap(){
            cleanTimer();
            cleanMarkers();
            cleanPoly();
            cleanMarkerTrack();
        }

        function cleanMarkers(){
            var i,marker;
            for(marker in markers){
                i = 0;
                for(; i < markers[marker].length; i++){
                    //map.removeOverlay(markers[marker][i]);
                    markers[marker][i].setMap(null);
                }
            }
            markers = {};
        }

        function cleanPoly(){
            var i = 0;
            for(; i < polyLine.length; i++){
                map.removeOverlay(polyLine[i]);
            }
            polyLine= [];
        }

        function cleanMarkerTrack(){
            var i = 0;
            for(; i < markerTrack.length; i++){
                //  map.removeOverlay(markerTrack[i]);
                markerTrack[i].setMap(null);
            }
            markerTrack = [];
        }

        function cleanTimer(){
            var i = 0;
            for(; i < timerTrack.length; i++){
                clearInterval(timerTrack[i]);
            }
            timerTrack = [];

            if(timerDrawRoute){
                clearInterval(timerDrawRoute);
            }
        }

        function getHistoryIcon(ima){
            if (ima.search(/red/) > 0) {
                return markerIconList["redHistory"];
                //  console.log("red");
            }
            else if (ima.search(/green/) > 0) {
                return markerIconList["greenHistory"];
                // console.log("green");
            }
            else if (ima.search(/gray/) > 0) {
                return markerIconList["grayHistory"];
                //  console.log("grayHistory");
            }
            else if (ima.search(/orange/) > 0) {
                return markerIconList["orangeHistory"];
                //  console.log("orangeHistory");
            }
        }


        function getIcon(color) {
            var IconImg;
            switch (color) {
                case "0":
                    IconImg = markerIconList.green;
                    break;
                case "1":
                    IconImg = markerIconList.orange;
                    break;
                case "2":
                    IconImg = markerIconList.gray;
                    break;
                case "3":
                    IconImg = markerIconList.red;
                    break;
                default:
                    IconImg = markerIconList.orange;
                    break;
            }
            return IconImg;
        }
  });
