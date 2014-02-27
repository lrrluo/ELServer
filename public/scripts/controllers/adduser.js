'use strict';

angular.module('corsNgApp')
  .controller('AdduserCtrl', function ($scope,$routeParams,$location,cookie,Language) {
        console.log($routeParams.id);
        $scope.nullFilter = function(obj){
            if(obj){
                return true;
            }
            else{
                return false;
            }
        }

        $scope.nav = $location.path().split('/');

        console.log($scope.nav);

        $scope.language = Language["userManager"];
        $scope.commonLang = Language["common"];
        function init(sign){
            $scope.title = $scope.language.add[sign];

            $scope.um = $scope.language.userName[sign];
            $scope.ser = $scope.language.serverType[sign];
            $scope.ac = $scope.language.account[sign];
            $scope.ph = $scope.language.phone[sign];
            $scope.exDate = $scope.language.expirationDate[sign];

            $scope.submit = $scope.commonLang.submit[sign];
            $scope.back = $scope.commonLang.back[sign];
            $scope.req = $scope.commonLang.req[sign];
        }

        init(cookie.getLang());


        $scope.$on('switchLang',function(e,index){
            init(cookie.getLang());
        });

        $scope.backTo = function(){
            $location.path("/zone");
        }
  });
