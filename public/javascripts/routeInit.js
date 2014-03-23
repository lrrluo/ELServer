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


    app.get('/', routes.index);

    app.get('/service/IP', function(req,res,next){
        console.log("IP");
        res.send("IP service");
    });

    app.get('/views/weather',function(req,res){
        res.render('weather',{});
    })

    app.get('/views/zhibo',function(req,res){
        res.render('zhibo',{});
    })

    app.get('/service/weather', function(req,res,next){
        var pro,city , cb;
        city = req.query.city;
        cb = req.query.callback;
        if(city){
            console.log(city);
            pro = webCtrl.getWeather(city);
            pro.then(function(data){
                if(cb){
                    res.send(cb+'('+JSON.stringify(data)+')');
                }
                else
                    res.send(JSON.stringify(data));
            },function(err){
                if(cb){
                    res.send(cb +'('+JSON.stringify({status:'error'})+')');
                }
                else
                    res.send(JSON.stringify({status:'error'}));
            })
        }
        else{
            if(cb){
                res.send(cb+'('+JSON.stringify({error:"please specity the city name"})+')');
            }
            else
                res.send(JSON.stringify({error:"please specity the city name"}));
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
        res.send("TV service");
    });

    app.get('/service/airLine', function(req,res,next){
        res.send("airLine service");
    });

    app.get('/service/trainLine', function(req,res,next){
        res.send("trainLine service");
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

    app.get('/service/sportLive', function(req,res,next){
        var time = mom().format("MM月DD日");
        var pro = sp.get({$regex : time+".*"});
        pro.then(function(data){
            if(req.query.callback){
                res.send(req.query.callback+'('+JSON.stringify(data)+')');
            }
            else{
                res.send(JSON.stringify(data));
            }
        })
    });

    app.get('/service/weibo', function(req,res,next){
        res.send("weibo service");
    });

    app.get('/service/GDbus', function(req,res,next){
        var pro,bus;
        bus = req.query.bus;
        if(bus){
            console.log(bus);
            pro = webCtrl.getBus(bus);
            pro.then(function(data){
                res.send(req.query.callback+'('+JSON.stringify(data)+')');
            },function(err){
                res.send(req.query.callback+'('+JSON.stringify({status:'error'})+')');
            })
        }
        else{
            console.log(req.query.city);
            res.send(req.query.callback+'('+JSON.stringify({error:"please specity the city name"})+')');
        }
    });


    //  app.get('/service/weather', routes.weather);
};