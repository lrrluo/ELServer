/**
 *
 * Created by L on 14-1-9.
 */

var fs = require('fs');
var q = require('q');
var cheerio = require('cheerio');
var request = require('request');
var xml2json = require("xml2js");
var util = require('./util');
var cityModel = require('../model/models').cityDao();

exports.webCtrl = webReqCtrl();

function webReqCtrl(){
    return{
        getSupportCities:getCities,
        getWeather: getWeather,
        getTv: getTv,
        getBus:getBus
    }

    function getBus(bus){
        console.log('in web ctrl '+bus);
        var defer = q.defer();
        request('http://gzbusnow.sinaapp.com/index.php?c=busrunningv2&a=query&monitor=&keyword='+bus
            ,function(error, response, body){
                util.pareseBus(body,function(data){
                    defer.resolve(data);
                });
            });
        return defer.promise;

    }

    function getWeather(city){
        var defer = q.defer();
        request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'http://www.webxml.com.cn/WebServices/WeatherWebservice.asmx/getWeatherbyCityName',
            body:    "theCityName="+city
        }, function(error, response, body){
            var parser,
                cities;
            parser = new xml2json.Parser();
            parser.parseString(body, function (err, result) {
                var weather = result.ArrayOfString.string;
                defer.resolve(weather);
            });
        });
        return defer.promise;

    }
    function getTv(){
        var defer = q.defer();
        request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'http://www.webxml.com.cn/WebServices/WeatherWebservice.asmx/getWeatherbyCityName',
            body:    "theCityName="+city
        }, function(error, response, body){
            var parser,
                cities;
            parser = new xml2json.Parser();
            parser.parseString(body, function (err, result) {
                var weather = result.ArrayOfString.string;
                defer.resolve(weather);
            });
        });
        return defer.promise;

    }

    function getCities(){
        var defer = q.defer();

        if(cityModel.getModel(function(data){ //如果db有就直接取
            if(data.length > 0){
                defer.resolve(data[0].cities);
            }
            else{//没有就向web service 请求并保存在数据库里。数据库理论上只有一条记录。
                request.post({
                    headers: {'content-type' : 'application/x-www-form-urlencoded'},
                    url:     'http://www.webxml.com.cn/WebServices/WeatherWebservice.asmx/getSupportCity',
                    body:    "byProvinceName=all"
                }, function(error, response, body){
                    var parser,
                        cities;
                    parser = new xml2json.Parser();
                    parser.parseString(body, function (err, result) {
                        cities = result.ArrayOfString.string.map(util.parseCities);
                        cityModel.setModel(cities);
                        defer.resolve(cities);
                    });
                });

            }
        }))
            fs.exists("./public/resourses/citiestest.xml",function(exists){
                if(exists){
                }
                else{
                }
            })
        return defer.promise;
    }
};

function getList(time){
    var defer = q.defer();
    var slModel = require('../model/models').spLiveDao();
    slModel.find({time:time},defer);
    return defer.promise;
}

