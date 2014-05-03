'use strict';

angular.module('easyApp')
  .controller('MainCtrl', ['$scope','$location','cookie','Language', '$document', function ($scope,$location,cookie,Language,$document) {

        var language = Language["main"]
			,sign = 1;


		$scope.option = {
			menu:{
				name: 'topMenu',
				items:[
					 {url:'service',name:language.index[sign],active:true}
					,{url:'login',name:language.login[sign],active:false}
					,{url:'advice',name:language.advice[sign],active:false}
					,{url:'about',name:language.aboutMe[sign],active:false}
				]

			},
			dropdown: [
				{
					name:'theme',
					title: language.theme[sign],
					items:[
						{name:language.cerulean[sign],active:true,skin:language.cerulean[0]},
						{name:language.classic[sign],active:false,skin:language.classic[0]},
						{name:language.slate[sign],active:false,skin:language.slate[0]}
					]
				},
				{
					name: 'lang',
					title: language.langTitle[sign],
					items: [
						{name:language.en[sign],active:true},
						{name:language.ch[sign],active:false}
					]
				}
			]
		};

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
            $scope.skin = $scope.themes[cookie.getTheme()].skin.toLowerCase(); //+'.css';


            $scope.headers = [
                {name:$scope.language.weather[sign],active:true,url:"/weather",icon:'icon-home'},
                {name:$scope.language.sportLive[sign],active:false,url:"/zhibo",icon:'icon-picture'},
                {name:$scope.language.bus[sign],active:false,url:"/bus",icon:'icon-picture'},
                {name:$scope.language.train[sign],active:false,url:"/train",icon:'icon-picture'}
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

        //init(0);

        //$scope.switchLang = function(index){
        //    var i;
        //    if($scope.langs[index].active){
        //        return false;
        //    }
        //    else{
        //        for(i = 0; i<$scope.langs.length; i++){
        //            $scope.langs[i].active = false;
        //        }
        //        $scope.langs[index].active = true;
        //        cookie.setLang(index);
        //        init(cookie.getLang());
        //        $scope.$broadcast("switchLang",index);
        //    }
        //}

        //$scope.switchTheme = function(index){
        //    var i;
        //    if($scope.themes[index].active){
        //        return false;
        //    }
        //    else{
        //        for(i = 0; i<$scope.themes.length; i++){
        //            $scope.themes[i].active = false;
        //        }
        //        $scope.themes[index].active = true;
        //        $scope.skin = $scope.themes[index].skin.toLowerCase(); //+'.css';
        //        cookie.setTheme(index);
        //    }
        //}

        //$scope.jump = function(url,index){
        //    var i;
        //    for(i = 0; i<$scope.headers.length; i++){
        //        $scope.headers[i].active = false;
        //    }
        //    $scope.headers[index].active = true;
        //    $location.path($scope.headers[index].url);
        //}

		$scope.$on('dropdown',function(e, p){
			console.log(e,p);
			switch (p.name){
				case 'lang':
					console.log(p.param);
					break;
				case 'theme':
					console.log(p.param);
					break;
			}
		});

		$scope.$on('menu',function(e, p){
			console.log(e,p);
			switch (p.name){
				case 'topMenu':
					console.log(p.param);
					break;
			}
		});


		// 全局 click 事件，body
		$document.on('click', function(e){
			$scope.$broadcast('click',e);
		});


        //$scope.$on("$locationChangeSuccess",function(e,path){
        //    var i = 0;
        //    for(i; i < $scope.headers.length ; i++){
        //        $scope.headers[i].active = false;
        //        if(path.indexOf($scope.headers[i].url) >= 0){
        //            $scope.headers[i].active = true;
        //        }
        //    }
        //})
  }]);
