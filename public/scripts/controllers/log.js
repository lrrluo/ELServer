'use strict';

angular.module('corsNgApp')
  .controller('LogCtrl', function ($scope,Language,cookie) {


        $scope.language = Language["log"];

        function init(sign){
            $scope.title = $scope.language.title[sign];

            $scope.headers = [
                {colName: $scope.language.userName[sign],name:'userName'},

                {colName: $scope.language.logTime[sign],name:'logTime'},
                {colName: $scope.language.content[sign],name:'content'}
            ];
        }

        init(cookie.getLang());
        $scope.$on('switchLang',function(e,index){
            init(cookie.getLang());
        });


        $scope.data = [
            {userName:"移动站", logTime:'2014-01-01 12:02:25',content:'RTKsdlkjrwernwejrh'},
            {userName:"移动站1",logTime:'2014-01-01 12:02:30',content:'RTKsdlkjrwernwejrh'},
            {userName:"移动站2",logTime:'2014-01-01 12:02:40',content:'RTKsdlkjrwernwejrh'},
            {userName:"移动站3",logTime:'2014-01-01 12:02:56',content:'RTKsdlkjrwernwejrh'},
            {userName:"移动站4",logTime:'2014-01-01 12:03:25',content:'RTKsdlkjrwernwejrh'},
            {userName:"移动站5",logTime:'2014-01-01 12:04:25',content:'RTKsdlkjrwernwejrh'}
        ]
  });
