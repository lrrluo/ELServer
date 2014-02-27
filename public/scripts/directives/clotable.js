'use strict';



angular.module('corsNgApp')
  .directive('cloTable',['$http','$cookieStore',function ($http,$cookieStore) {
    return {
      templateUrl:"views/clotable.html",
      restrict: 'AE',
      scope:{
        option: '='
      },
      link: function postLink($scope, element, attrs) {
          var lang = $cookieStore.get('lang');
          if(lang != 0 && lang != 1){
              $cookieStore.put('lang',1);
              lang = 1;
          }

          initLang(lang);

          $scope.$on('switchLang',function(e,index){
              initLang(index);
          });

          function initLang(lan){
              if(lan == 1){
                  $scope.editText = "编辑";
                  $scope.delText = "删除";
                  $scope.idText = "序号";
                  $scope.operText = "操作";
                  $scope.searchText = "搜索";
                  $scope.pageSize = "每页数据";
              }
              else{
                  $scope.editText = "Edit";
                  $scope.delText = "Delete";
                  $scope.idText = " Serial No";
                  $scope.operText = "Operate";
                  $scope.searchText = "Search";
                  $scope.pageSize = "Page Size";
              }
          }



          $scope.col = [];
          var i,
            reqData;
          for(i=0; i<$scope.option.colNum;i++){
              $scope.col.push(i);
          }

        reqData = {pageSize:10,pageNow:1,order:1,orderBy:"",filter:"",filterNo:''};
          $scope.canEdit = true;
          $scope.canDele = true;
        if($scope.option.colOpe){
            $scope.canEdit = $scope.option.colOpe[0];
            $scope.canDele = $scope.option.colOpe[1];
        }
/*          $scope.canDele = false;
              if(JSON.parse(localStorage.getItem('user')).name !=="admin"){
                  $scope.canDele = true;
              }*/
        $scope.pageSize = reqData.pageSize;

        $scope.tableConfig = {pageSize:10,pageNow:1,total:0,totalPage:0,data:[],
                              pageState:{first:true,last:false,prev:false,next:false}};


        $scope.searchType = $scope.option.searchBy[0].type;
        reqData.filterNo = -1;

        ajaxAsk($scope.option.reqUrl.getUrl,{page:reqData},pageSuccess)

        $scope.del = function(id){
            if(window.confirm("确定要删除吗？")){
                $http.post($scope.option.reqUrl.delUrl,{id:id}).success(function(data){
                    alert('删除成功');
                    ajaxAsk($scope.option.reqUrl.getUrl,{page:reqData},pageSuccess)
                }).error(function(){
                        $scope.loading = false;
                        alert("操作错误，如果错误还是继续，请刷新页面");
                    })
            }
        }

        $scope.changeSize = function(){
            reqData.pageSize = $scope.pageSize;
            ajaxAsk($scope.option.reqUrl.getUrl,{page:reqData},pageSuccess)
        }

        $scope.changeSearch = function(){
            $scope.searchType = $scope.option.searchBy[$scope.searchBy].type;
        }
        $scope.search = function(){
            if(!$scope.searchBy){
                alert('请在下列框先选择相应的搜索项。')
                return;
            }
            reqData.filterNo = $scope.option.searchBy[$scope.searchBy].value;
            reqData.filter = $scope.searText;
            if(!$scope.searText){
                reqData.filterNo = -1;
            }
            ajaxAsk($scope.option.reqUrl.getUrl,{page:reqData},pageSuccess)
        }

        $scope.sort = function(sb){
            if(!sb){
                return false;
            }
            reqData.order = !reqData.order;
            reqData.orderBy = sb;
            ajaxAsk($scope.option.reqUrl.getUrl,{page:reqData},pageSuccess)
        }

        $scope.changePage = function(how){
            switch(how){
                case 'first':
                        reqData.pageNow = 1;
                        break;
                case 'pre':
                        reqData.pageNow--;
                        break;
                case 'next':
                        reqData.pageNow++;
                        break;
                case 'last':
                        reqData.pageNow = $scope.tableConfig.totalPage;
                        break;
                default:break;
            }
            ajaxAsk($scope.option.reqUrl.getUrl,{page:reqData},pageSuccess);
        }

        function ajaxAsk(url,data,success,error){
            $scope.loading = true;
            $http.post(url,data)
                .success(function(data){
                    console.log(data);
                    success(data);
                }).error(function(){

                    success({d:{pageSize:10,pageNow:1,total:0,totalPage:0,data:[
                        {id:1,userName:'移动站1',serverType:'RTK',account:5000,phone:'12548635412',isOnline:1,dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'},
                        {id:2,userName:'移动站2',serverType:'RTK',account:5001,phone:'12548635412',isOnline:1,dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'},
                        {id:3,userName:'移动站3',serverType:'RTK',account:5002,phone:'12548635412',isOnline:0,dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'},
                        {id:4,userName:'移动站4',serverType:'RTK',account:5003,phone:'12548635412',isOnline:0,dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'},
                        {id:5,userName:'移动站5',serverType:'RTK',account:5004,phone:'12548635412',isOnline:0,dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'},
                        {id:6,userName:'移动站6',serverType:'RTK',account:5005,phone:'12548635412',isOnline:1,dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'}
                    ]}})
                    $scope.loading = false;
                   // alert("操作错误，如果错误还是继续，请刷新页面");
                })
        }
        function pageSuccess(data){
            $scope.tableConfig =  handelPage(data.d);
            console.log('false')
            $scope.loading = false;
        }

        function handelPage(data){
            var temp = {pageState:{}};
            angular.extend(temp,data);

          //  temp.data.order = $scope.contentSort;
            console.log(temp)
            adjustPage(temp);
            return temp;
        }//function handle Page


        function adjustPage(temp){
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
