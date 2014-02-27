'use strict';

angular.module('corsNgApp')
  .controller('AddzoneCtrl', function ($scope,cookie,Language,$location,$routeParams) {

        $scope.language = Language["zone"];
        $scope.commonLang = Language["common"];
        function init(sign){
            $scope.title = $scope.language.add[sign];
            $scope.submit = $scope.commonLang.submit[sign];
            $scope.back = $scope.commonLang.back[sign];
            $scope.zm = $scope.language.zoneName[sign];
            $scope.points = $scope.language.points[sign];
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
