'use strict';

angular.module('corsNgApp')
  .controller('MainCtrl', ['$scope','$location','cookie','Language', function ($scope,$location,cookie,Language) {

      /*  $scope.theme = "bootstrap-classic.css";
        $scope.themeList = [
            'Classic','Cerulean','Cyborg','Redy','Journal','Simplex','Slate','Spacelab','United'
        ]
        $scope.switchTheme =function(url){
            url = url.toLowerCase();
            $scope.theme = "bootstrap-" + url + '.css';
        }*/

        $scope.language = Language["main"];

        function init(sign){
            var i, path, findUrl = false;
            $scope.langtitle = $scope.language.langTitle[sign];
            $scope.function = $scope.language.func[sign];
            $scope.theme = $scope.language.theme[sign];

            $scope.themes = [
                {name:$scope.language.cerulean[sign],active:false,skin:$scope.language.cerulean[0]},
                {name:$scope.language.classic[sign],active:false,skin:$scope.language.classic[0]},
                {name:$scope.language.slate[sign],active:false,skin:$scope.language.slate[0]}
            ];

            $scope.langs = [
                {name:$scope.language.en[sign],active:false},
                {name:$scope.language.ch[sign],active:false}
            ];



            $scope.langs[sign].active = true;
            $scope.themes[cookie.getTheme()].active = true;
            $scope.skin = $scope.themes[cookie.getTheme()].skin; //+'.css';


            $scope.headers = [
                {name:$scope.language.weather[sign],active:true,url:"/weather",icon:'icon-home'},
                {name:$scope.language.sportLive[sign],active:false,url:"/sport",icon:'icon-picture'}
/*                {name:$scope.language.online[sign],active:false,url:"/online"},
                {name:$scope.language.userManager[sign],active:false,url:"/userManager"},
                {name:$scope.language.log[sign],active:false,url:"/log"},
                {name:$scope.language.zone[sign],active:false,url:"/zone"},
                {name:$scope.language.fileDownLoad[sign],active:false,url:"/fileDownLoad"}*/
            ]

            path = $location.path();
            for(i = 0; i < $scope.headers.length ; i++){
                $scope.headers[i].active = false;
                if(path.indexOf($scope.headers[i].url) >= 0){
                    $scope.headers[i].active = true;
                    findUrl = true;
                }
            }
            if(!findUrl){
                $scope.headers[0].active = true;
            }
        }

        init(cookie.getLang());

        $scope.switchLang = function(index){
            var i;
            if($scope.langs[index].active){
                return false;
            }
            else{
                for(i = 0; i<$scope.langs.length; i++){
                    $scope.langs[i].active = false;
                }
                $scope.langs[index].active = true;
                cookie.setLang(index);
                init(cookie.getLang());
                $scope.$broadcast("switchLang",index);
            }
        }

        $scope.switchTheme = function(index){
            var i;
            if($scope.themes[index].active){
                return false;
            }
            else{
                for(i = 0; i<$scope.themes.length; i++){
                    $scope.themes[i].active = false;
                }
                $scope.themes[index].active = true;
                $scope.skin = $scope.themes[index].skin; //+'.css';
                cookie.setTheme(index);
            }
        }

        $scope.jump = function(url,index){
            var i;
            for(i = 0; i<$scope.headers.length; i++){
                $scope.headers[i].active = false;
            }
            $scope.headers[index].active = true;
            $location.path($scope.headers[index].url);
        }


        $scope.$on("$locationChangeSuccess",function(e,path){
            var i = 0;
            for(i; i < $scope.headers.length ; i++){
                $scope.headers[i].active = false;
                if(path.indexOf($scope.headers[i].url) >= 0){
                    $scope.headers[i].active = true;
                }
            }
        })
  }]);
