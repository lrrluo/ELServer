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
        getSupportCities:getCities
        ,getWeather: getWeather
        ,getTv: getTv
        ,getBus:getBus
	    ,getTrain:getTrain
    }

	function getTrain(date,start,end){
		var defer = q.defer();
		//url : https://kyfw.12306.cn/otn/lcxxcx/query?purpose_codes=ADULT&queryDate=2014-04-12&from_station=BJP&to_station=GZQ
		var url = 'https://kyfw.12306.cn/otn/lcxxcx/query?purpose_codes=ADULT';
		url = url + '&queryDate='+ date+'&from_station=' + start +'&to_station='+end;
		console.log(url);
		request(
			{url:url,rejectUnauthorized: false}
			,function(error, response, body){
				var priceUrl,temp, j,sum ,len,saveData,sendData;
				body = JSON.parse(body);
				if(error){
					defer.resolve({msg:'error no data'});
				}
				else if(body.status){
					console.log(body);
					// seat_types=1413&
					if(body.data.flag){

						j = 0, sum = 0,len = body.data.datas.length;
						sendData = body.data.datas;
						saveData = {};
						for(var i =0;i < len; i++){
							priceUrl = "https://kyfw.12306.cn/otn/leftTicket/queryTicketPrice?";
							temp = sendData[i];
							if(saveData[temp["train_no"]]){
								saveData[temp["train_no"]].push(i);
								continue;
							}
							else{
								sum++;
								saveData[temp["train_no"]] = [];
								saveData[temp["train_no"]].push(i);
							}
							priceUrl = priceUrl + 'train_no='+ temp["train_no"]
								+ '&from_station_no='+temp["from_station_no"]
								+ '&to_station_no='+temp["to_station_no"]
								+ '&seat_types='+temp["seat_types"]
								+ '&train_date='+ date;

							console.log(priceUrl);
							request(
								{url:priceUrl,rejectUnauthorized: false}
								,function(err,res,body){
									body = JSON.parse(body);
									if(body.status){
										var priceData = body.data,
											isSeat = /_num$/;
											t = saveData[priceData.train_no];
										console.log(t, t.length);
										for(var i = 0;i < t.length;i++){
											for(var o in sendData[t[i]]){
												if(isSeat.test(o) && !isNaN(sendData[t[i]][o])){
													sendData[t[i]][o] += '张';
												}
											}
											sendData[t[i]]["gr_num"] +=  !priceData["A6"]? "": ', '+priceData["A6"];
											sendData[t[i]]["qt_num"] +=  !priceData["OT"][0]? "": ', '+priceData["OT"][0];
											sendData[t[i]]["rw_num"] +=  !priceData["A4"]? "": ', '+priceData["A4"];
											sendData[t[i]]["rz_num"] +=  !priceData["A2"]? "": ', '+priceData["A2"];
											sendData[t[i]]["tz_num"] +=  !priceData["P"]? "": ', '+priceData["P"];
											sendData[t[i]]["wz_num"] +=  !priceData["WZ"]? "": ', '+priceData["WZ"];
											sendData[t[i]]["yw_num"] +=  !priceData["A3"]? "": ', '+priceData["A3"];
											sendData[t[i]]["yz_num"] +=  !priceData["A1"]? "": ', '+priceData["A1"];
											sendData[t[i]]["ze_num"] +=  !priceData["O"]? "": ', '+priceData["O"];
											sendData[t[i]]["zy_num"] +=  !priceData["M"]? "": ', '+priceData["M"];
											sendData[t[i]]["swz_num"]+=  !priceData["A9"]? "": ', '+priceData["A9"];
										}
									}
									if(sum == ++j){
										defer.resolve(sendData);
										console.log('=============',sum,j);
									}
									console.log(sum,j);
							})
						}
					}
					else defer.resolve(body.data);
				}
			//defer.resolve(data);
			});
		return defer.promise;

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

