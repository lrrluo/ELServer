'use strict';

angular.module('corsNgApp')
  .controller('OnlineCtrl', function ($scope,Language,cookie) {


        $scope.language = Language["online"];

        function init(sign){
            $scope.title = $scope.language.title[sign];

            $scope.headers = [
                {colName: $scope.language.userName[sign],name:'userName'},
                {colName: $scope.language.serverType[sign],name:'serverType'},
                {colName: $scope.language.account[sign],name:'account'},
                {colName: $scope.language.expirationDate[sign],name:'expirationDate'},
                {colName:'DX',name:'dx'},{colName:'DY',name:'dy'},
                {colName:'DZ',name:'dz'},{colName:'RX',name:'rx'},
                {colName:'RY',name:'ry'},{colName:'RZ',name:'rz'}
            ];

        }

        init(cookie.getLang());
        $scope.$on('switchLang',function(e,index){
            init(cookie.getLang());
        });


        $scope.data = [
            {userName:'移动站1',serverType:'RTK',account:5000,expirationDate:'2014-12-12',dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'},
            {userName:'移动站2',serverType:'RTK',account:5001,expirationDate:'2014-12-13',dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'},
            {userName:'移动站3',serverType:'RTK',account:5002,expirationDate:'2014-12-14',dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'},
            {userName:'移动站4',serverType:'RTK',account:5003,expirationDate:'2014-12-15',dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'},
            {userName:'移动站5',serverType:'RTK',account:5004,expirationDate:'2014-12-16',dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'},
            {userName:'移动站6',serverType:'RTK',account:5005,expirationDate:'2014-12-17',dx:'dx',dy:'dy',dz:'dz',rx:'dx',ry:'dy',rz:'dz'}
        ]
  });
