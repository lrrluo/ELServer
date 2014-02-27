'use strict';

angular.module('corsNgApp')
  .controller('ZoneCtrl', function ($scope,cookie,Language) {
        $scope.language = Language["zone"];
        var sort = ['userName','serverType'],
        // shop = JSON.parse(localStorage.getItem('user')).name,
            colOpe = [1,1],          //这是每行的操作,包含 edit delete , 0 for hide 1 for show
            ope = [             //这里相对整个table的操作。
                {need:true,name:$scope.language.add[cookie.getLang()]},
                {need:false,name:''}
            ];
        /*if(shop !== "admin"){
         ope[0].need = false;
         }*/

        function init(sign){
            $scope.title = $scope.language.title[sign];

            ope = [             //这里相对整个table的操作。
                {need:true,name:$scope.language.add[sign]},
                {need:false,name:''}
            ];

            $scope.option = {
                title: $scope.language.title[sign],
                colNum: 2,
                restName: "zone/add",
                //add operate(自定义，在grid显示) update delete(这两个是默认需要的)
                operate:ope,
                colOpe:colOpe,
                headers: [
                    {name: $scope.language.zoneName[sign],order:false},
                    {name: $scope.language.points[sign],order:true}
                ],
                reqUrl: {getUrl:'../ajaxService/restful.svc/getClothes',delUrl:'../ajaxService/restful.svc/delClothes'},
                searchBy:[{text:'作业区域名字',value:0,type:'text'}],
                content: content
            }
        }

        init(cookie.getLang());
        $scope.$on('switchLang',function(e,index){
            init(cookie.getLang());
        });


        //下面这个方法用于订制化地输出表格的内容，以sort（上面的）的顺序来显示，并如果要格式化，也在这里格式化。perfect.
        function content(index,item){
            /*            if(index === 2){
             return size[item['size']];
             }
             else{
             return item[sort[index]];
             }*/
            return item[sort[index]];
        }
  });
