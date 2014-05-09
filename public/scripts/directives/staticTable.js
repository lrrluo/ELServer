/**
 * Created by L on 14-3-29.
 */
'use strict';
angular.module('easyApp')
    .directive('stable',['cookie','Language',function (cookie,Language) {
        return {
            templateUrl:"/views/staticTable",
            restrict: 'AE',
            scope:{
                option: '='
            },
            link: function postLink($scope, element, attrs) {

                var tvData = null;
                $scope.tableConfig = {};

                $scope.$watch("option.data", function(data){
                    if(data){
                        $scope.tableConfig.pageSize = 50 ;
                        $scope.tableConfig.totalPage = Math.ceil(data.length / 50);
                        $scope.tableConfig.pageNow = 1;
                        $scope.tableConfig.total = data.length;
                        $scope.tableConfig.pageState = {first:true,last:false,prev:false,next:false};
                        tvData = data;
                        parseTvData();
                        adjustPage();
                    }

                });

                function parseTvData(){
                    var config = $scope.tableConfig,
                        start = (config.pageNow-1)*config.pageSize;

                    $scope.data = tvData.slice(start,start + config.pageSize);
                    console.log($scope.data);
                }

                $scope.changeSize = function(){
                    $scope.tableConfig.pageSize = $scope.pageSize;
                    //ajaxAsk($scope.option.reqUrl.getUrl,{page:$scope.tableConfig},pageSuccess)
                }

                $scope.changePage = function(how){
                    switch(how){
                        case 'first':
                            $scope.tableConfig.pageNow = 1;
                            break;
                        case 'pre':
	                        if($scope.tableConfig.pageNow != 1)
                                $scope.tableConfig.pageNow--;
                            break;
                        case 'next':
	                        if($scope.tableConfig.pageNow != $scope.tableConfig.totalPage)
                                $scope.tableConfig.pageNow++;
                            break;
                        case 'last':
                            $scope.tableConfig.pageNow = $scope.tableConfig.totalPage;
                            break;
                        default:break;
                    }
                    adjustPage();
                    parseTvData();
                }


                function adjustPage(){
                    var temp = $scope.tableConfig;
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
