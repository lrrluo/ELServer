'use strict';

angular.module('corsNgApp')
  .controller('FiledownloadCtrl', function ($scope,Language,cookie) {

        $scope.language = Language["fileDownload"];

        function init(sign){
            $scope.title = $scope.language.title[sign];

            $scope.headers = [
                {colName:  $scope.language.fileName[sign],name:'fileName'}
            ];

        }

        init(cookie.getLang());
        $scope.$on('switchLang',function(e,index){
            init(cookie.getLang());
        });


        $scope.data = [
            {fileName:'file1.txt'},
            {fileName:'file2.txt'},
            {fileName:'file3.txt'},
            {fileName:'file4.txt'},
            {fileName:'file5.txt'},
            {fileName:'file6.txt'}
        ]
  });
