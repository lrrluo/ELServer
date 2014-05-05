'use strict';

/*angular.module('corsNgApp')
  .factory('Baidumap', function Baidumap() {
    // AngularJS will instantiate a singleton by calling "new" on this function
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
            setRealTime:setRealTime,
            addMarker: addMaker,
            drawRoute:drawRoute,
            drawTrack: drawTrack,
            cleanMap: cleanMap,
            cleanMarker: cleanMarkers,
            cleanPoly: cleanPoly,
            cleanTrack: cleanMarkerTrack,
            getIcon: getIcon,
            getTraceIcon:getHistoryIcon,
            realTimeTick:realTimeFlesh
        };

        function setRealTime(val){
            realTime = !!val;
        }



        function initMap(container,options){
            map = new BMap.Map(container,options);
            realTime = true;
          //  realRock = false;
            map.centerAndZoom("广州", 12);
            map.enableScrollWheelZoom(true);
            map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
            map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}));  //右上角，仅包含平移和缩放按钮
            map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT, type: BMAP_NAVIGATION_CONTROL_PAN}));  //左下角，仅包含平移按钮
            map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM}));  //右下角，仅包含缩放按钮
        }

        function addMaker(marker){
            map.addOverlay(marker);
            markers.push(marker);
        }

        function createMarker(point,ma){
            var defer = $.Deferred();
            BMap.Convertor.translate(new BMap.Point( parseFloat(point.longitude),  parseFloat(point.latitude)),0,function(p){
                if(!centerPoint){
                    centerPoint = p;
                }
                else{
                    //   centerPoint.lng = centerPoint.lng > p.
                }
                var myIcon = new BMap.Icon(getIcon(point.color), new BMap.Size(22, 36));
                var newMarker = new BMap.Marker(p,{ icon: myIcon });  // 创建标注
                //console.log(p);
                //var newMarker = new BMap.Marker(p);
                map.addOverlay(newMarker);
                ma.push(newMarker);
                defer.resolve(true);
                // realRock = false;
                // callback();
                //  return false;
            })
            return defer.promise();

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
                        if(markers[point.no] && markers[point.no].length > 0){  //如果有值，就把上一次push的值的图标改成历史图标。
                            marker =  markers[point.no];
                            map.removeOverlay(marker[marker.length -1]);
                            icon = marker[marker.length-1].getIcon();
                            // console.log(getHistoryIcon(icon.imageUrl));
                            marker[marker.length -1].setIcon(icon.setImageUrl(getHistoryIcon(icon.imageUrl)));

                            map.addOverlay(marker[marker.length -1]);
                            //  map.addOverlay(marker[marker.length -1]);
                            // console.log(marker[marker.length -1].getIcon().imageUrl);
                            //continue;
                        }
                        else{           //如果不是，就代表是新的一个集合。
                            markers[point.no] = [];
                            marker = markers[point.no];
                        }
                        if(point.posState >= point.selfPos || point.state != 0){//解状态,第一个是gga状态。第二个是该站点的解状态
                            createMarker(point,marker);
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


        function drawRoute(points,interval,callback){
            var i ,
                po;

            map.centerAndZoom(new BMap.Point(points[0].longitude, points[0].latitude), 15);
            i = 0;
            timerDrawRoute = setInterval(function(){
                po = new BMap.Polyline([
                    new BMap.Point(points[i].longitude, points[i].latitude),
                    new BMap.Point(points[i+1].longitude, points[i+1].latitude)
                ],
                    {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5}
                );
                map.addOverlay(po);
                polyLine.push(po);
                i = i + 1;
                if( i === points.length){
                    clearInterval(timerDrawRoute);
                    callback();
                }

            },interval);
        }


        // 这个方法是画历史轨迹的，第一个参数infos是包括了器件的坐标值,gga状态的一个集合，就是点的集合，而点包括了属性经纬度和gga状态。
        /*
         而第二个参数是一个配置参数的对象值，包括: state ==> 要求的解状态，color==>显示的颜色，no ==> 该器件的编号，name ==> 器件名字
         interval ==》 画的时间间隔(ms) createMarker ==> 自定义的marker生成方法，只要返回一个marker就可以。
         */
        //调用前一定要先cleanMap,防止错误
        //  第三个参数就是回调方法

        function drawTrack(points,options,callback){//options.createmarker 是用于处部传一个方法来自定义创建一个marker，return 一个marker
            var i,timer,
            track = points;
            BMap.Convertor.translate(new BMap.Point(points[0].longitude,points[0].latitude),0,function(point){
                map.centerAndZoom(point, 16);
            });
            i = 0;

            timer = setInterval(function(){
                var ma;

                BMap.Convertor.translate(new BMap.Point(points[i].longitude, points[i].latitude),0,function(p){         //translate 是用于将gps数据转化成百度地图的坐标，很特别。
                    // console.log("trans:"+i);
                    if(i === points.length ){                       //有时可能停止了，但定时器刚好进来了，就会出错，所以这里预防错误。
                        return false;
                    }
                    if(points[i].ggaState >= options.state ){
                        if(options.createMarker){                   //如果外部提供了创建makrker的方法，就调用，否则就默认创建一个。
                            if(i === points.length -1){
                                ma = options.createMarker({point:p,color:options.color,isLast:true});
                            }
                            else{
                                ma = options.createMarker({point:p,color:options.color});
                            }

                        }
                        else{
                            ma = new BMap.Marker(p);
                        }

                        map.addOverlay(ma);
                        map.setCenter(p);
                        markerTrack.push(ma);

                        i = i + 1;
                        if( i === points.length){
                            clearInterval(timer);
                            callback();
                        }
                    }

                });


            },options.interval);
            timerTrack.push(timer);

        }
// 下面是一个调用例子，第一个参数infos是包括了坐标值,gga状态的一个集合，就是点的集合，而点包括了属性经纬度和gga状态。
        /*而第二个参数是一个配置参数的对象值，包括: state ==> 要求的解状态，color==>显示的颜色，no ==> 该器件的编号，name ==> 器件名字
         interval ==》 画的时间间隔(ms) createMarker ==> 自定义的marker生成方法，只要返回一个marker就可以。
         */
        //第三个参数就是回调方法
        //调用前一定要先cleanMap,防止错误
        /*    myMap.drawTrack(infos,
         { state: $("#state").val(),
         color: $("#color").val(),
         no: $("#insName").val(),
         name: $("#insName option:selected").text(),
         interval: 200，
         createMarker: function (options) {

         var IconImg = myMap.getIcon(options.color);
         if (!options.isLast) {
         IconImg = myMap.getTraceIcon(IconImg);
         }
         var myIcon = new BMap.Icon(IconImg, new BMap.Size(22, 36));
         var marker2 = new BMap.Marker(options.point, { icon: myIcon });  // 创建标注
         return marker2;              // 将标注添加到地图中

         }
         },
         function () {
         $("#seaHistory").attr('disabled', false);
         alert("finish");
         })*/




/*
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
                    map.removeOverlay(markers[marker][i]);
                }
            }
            markers = {};

        }

        function cleanPoly(){
            var i = 0;
            for(; i < polyLine.length; i++){
                map.removeOverlay(polyLine[i]);
            }
            polyLine = [];
        }

        function cleanMarkerTrack(){
            var i = 0;
            for(; i < markerTrack.length; i++){
                map.removeOverlay(markerTrack[i]);
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
