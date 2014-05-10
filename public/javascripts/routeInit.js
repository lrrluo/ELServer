/**
 * Created by L on 13-12-27.
 */

exports.init = function(app,routes){
	var cheerio = require('cheerio');
	var xml2json = require("xml2js");
	var fs = require('fs');
	var request = require('request')
	var sp = require("../../common/SLhandle");
	var mom = require("moment");
	var webCtrl = require('../../common/webCtrl').webCtrl;

	function sendData(data,cb){
		if(cb){
			return cb+'('+JSON.stringify(data)+')';
		}
		else
			return JSON.stringify(data);

	}

	app.get('/service/IP', function(req,res,next){
		console.log("IP");
		res.send("IP service");
	});


	app.get('/', routes.index);
	app.get('/views/service',function(req,res){
		res.render('service',{});
	})

	app.get('/views/breadcrumb',function(req,res){
		res.render('breadcrumb',{});
	})

	app.get('/views/nav',function(req,res){
		res.render('nav',{});
	})


	app.get('/views/dropdown',function(req,res){
		res.render('dropdown',{});
	})

	app.get('/views/weather',function(req,res){
		res.render('weather',{});
	})

	app.get('/views/zhibo',function(req,res){
		res.render('zhibo',{});
	})
	app.get('/views/bus',function(req,res){
		res.render('bus',{});
	})
	app.get('/views/train',function(req,res){
		res.render('train',{});
	})
	app.get('/views/staticTable',function(req,res){
		res.render('staticTable',{});
	})
	app.get('/views/narbar',function(req,res){
		console.log(req.param.name);
		res.render("narbar",{});
	})


	app.get('/service/weather', function(req,res,next){
		var pro,city , cb;
		city = req.query.city;
		cb = req.query.callback;
		if(city){
			console.log(city);
			pro = webCtrl.getWeather(city);
			pro.then(function(data){
				res.send(sendData(data,cb));
			},function(err){
				res.send(sendData({status:'error'},cb));
			})
		}
		else{
			res.send(sendData({error:"please specity the city name"},cb))
		}
	});

	app.get('/service/weather/cities', function(req,res,next){
		var pro;
		pro = webCtrl.getSupportCities();
		pro.then(function(data){
			res.send(req.query.callback+'('+JSON.stringify(data)+')');
		},function(err){
			res.send(req.query.callback+'('+JSON.stringify({status:'error'})+')');
		})
	});

	app.get('/service/TV', function(req,res,next){
		var pro,city , cb;
		city = req.query.city;
		cb = req.query.callback;
		if(city){
			console.log(city);
			pro = webCtrl.getWeather(city);
			pro.then(function(data){
				res.send(sendData(data,cb));
			},function(err){
				res.send(sendData({status:'error'},cb));
			})
		}
		else{
			res.send(sendData({error:"please specity the city name"},cb))
		}
	});

	app.get('/service/airLine', function(req,res,next){
		res.send("airLine service");
	});

	app.get('/service/trainLine', function(req,res,next){
		var pro
			,date = req.query.date
			,start = req.query.from
			,end = req.query.end
			,cb = req.query.callback;
		if(start && end && date){
			//url : https://kyfw.12306.cn/otn/lcxxcx/query?purpose_codes=ADULT&queryDate=2014-04-12&from_station=BJP&to_station=GZQ
			console.log(start,end,date);
			pro = webCtrl.getTrain(date,start,end);
			pro.then(function(data){
				res.send(sendData(data,cb));
			},function(err){
				res.send(sendData({status:'error'},cb));
			})
		}
		else{
			res.send(sendData({error:"please specity the city name"},cb))
		}
	});

	app.get('/service/stock', function(req,res,next){
		res.send("stock service");
	});

	app.get('/service/forex', function(req,res,next){
		res.send("forex service");
	});

	app.get('/service/QQonLine', function(req,res,next){
		res.send("QQonLine service");
	});

	app.get('/service/postCode', function(req,res,next){
		res.send("postCode service");
	});

	app.get('/service/phoneNumber', function(req,res,next){
		res.send("phoneNumber service");
	});

	app.get('/service/GpsMap', function(req,res,next){
		//var parser = new xml2json.Parser();
		//fs.readFile('public/resourses/allcity.xml', function(err, data) {
		//    parser.parseString(data, function (err, result) {
		//        console.dir(result);
		//        console.log('Done');
		//    });
		//});
		var url = 'http://www.baidu.com';
		var url2 = "http://www.webxml.com.cn/WebServices/WeatherWebService.asmx/getSupportProvince";
		var url3 = "http://news.163.com/special/00011K6L/rss_newstop.xml";
		request(url3, function(err, resp, body) {
			console.log(body);
			if (err)
				throw err;
			$ = cheerio.load(body);
			var parser = new xml2json.Parser();
			parser.parseString(body,function(err,result){
				console.log(result);
				var js = JSON.stringify(result);
				res.send(req.query.callback+'('+js+')');

			})
			console.log(req.query.callback);
			//res.send(req.query.callback+'({"test":"aaa"})');
			// TODO: scraping goes here!
		});

		//res.send("service Gpsmap");

	});

	app.get('/service/translation', function(req,res,next){
		res.send("translation service");
	});

	app.get('/service/RSS', function(req,res,next){
		res.send("RSS service");
	});

	var spInfo = null;
	app.get('/service/sportLive', function(req,res,next){
		var value = req.query.value,
			time = new mom().startOf('day'),
			pro,
			cb = req.query.callback;

		if(spInfo){
			var logTime = new mom(spInfo[0]["logTime"]).startOf('day');
			//console.log(logTime.format('YYYY-MM-DD'))
			//console.log(time.format('YYYY-MM-DD'))
			if(logTime.diff(time,'days') >= 0){
				//console.log('has data',spInfo[0]['content'],logTime)
				res.send(sendData(spInfo[value],cb));
			}
			else{
				spInfo = null;
				//console.log('empty value')
				pro = sp.get();
				pro.then(function(data){
					spInfo = data;
					res.send(sendData(data[value],cb));
				})
			}
		}
		else{
			//console.log('gogooog');
			pro = sp.get();
			pro.then(function(data){
				spInfo = data;
				res.send(sendData(data[value],cb));
			})
		}
	});

	app.get('/service/weibo', function(req,res,next){
		res.send("weibo service");
	});


	app.get('/service/GDbus', function(req,res,next){
		var pro,bus,cb;
		bus = req.query.bus;
		cb = req.query.callback;
		if(bus){
			//console.log(bus);
			pro = webCtrl.getBus(bus);
			pro.then(function(data){
				//console.log(data);
				res.send(sendData(data,cb));
			},function(err){
				res.send(sendData({status:'error'},cb));
			})
		}
		else{
			//console.log(req.query.city);
			res.send(sendData({error:"please specity the bus number"},req.query.callback));
		}
	});


	//  app.get('/service/weather', routes.weather);
};