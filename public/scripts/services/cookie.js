'use strict';
angular.module('easyApp')
  .factory('cookie', function ($cookieStore) {
    // Service logic
    // ...

    var map =$cookieStore.get('map');

    // Public API here
    return {
      getTheme:getTh,
      setTheme:setTh,
      getMap: get,
      setMap: set,
      getLang: getLang,
      setLang: setLang
    };

        function get(){
            if(!map){
            //    $cookies.map = 0;
                $cookieStore.put('map', 0);
                map = 0;
            }
            return map;
        };

        function set(i){
            $cookieStore.put('map', i);
            map = i;
        };


        function getLang(){
            if($cookieStore.get('lang') != 0 && $cookieStore.get('lang') != 1){
                $cookieStore.put('lang', 1);
            }

            return  $cookieStore.get('lang');
        }

        function setLang(lang){

            $cookieStore.put('lang',lang);
        }

        function getTh(){
            if(!angular.isNumber($cookieStore.get('theme'))){
                $cookieStore.put('theme', 0);
            }

            return  $cookieStore.get('theme');
        }

        function setTh(th){
            $cookieStore.put('theme',th);
        }
  });
