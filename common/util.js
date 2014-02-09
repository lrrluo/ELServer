/**
 *
 * Created by L on 14-1-5.
 */
var cheerio = require('cheerio');

module.exports = {
    parseHtml: parseHtml,
    pareseBus:pareseBus,
    parseCities: parseCities
};

function parseCities(city){//用于正则得到xml中的城市化名字，就是格式吧，原来：["广州 (12312)"] ==> ["广州"]
    return city.replace(/\(\d+\)/g,"");
}
//result: {
//         upRoute:{
//                  name:'',
//                  route:[{
//                          hasBus:'n',
//                          stopName:''
//                          }
//                        ]},
//         downRoute:{name:'',route:[{hasBus:'n',stopName:''}]}
//         }
function pareseBus(body,callback){
    var result,
        temp,hasBusPattern,busNum,stopNamePattern;

    busNum = 0;
    hasBusPattern = /\d/;
    stopNamePattern = /^\S*&nbsp/;

    result = {
        upRoute:{},
        downRoute:{}
    };

    $ = cheerio.load(body);
    temp =  $(".bus_direction");
    result.upRoute.name = temp.eq(0).html().replace(/\s|&nbsp/g,"");
    result.downRoute.name = temp.eq(1).html().replace(/\s|&nbsp/g,"");
    result.upRoute.route = [];
    result.downRoute.route = [];

    $("table").each(function(i,v){
        var p;
        if(i === 0){//uproute
            p =  result.upRoute;
        }
        else{//downroute
            p =  result.downRoute;
        }
        this.find('td').each(function(j,v){
            var sn;
            if(j%2){ //站名。奇数
                sn = stopNamePattern.exec($(this).html())[0];
                p.route[Math.floor(j/2)].stopName = sn.substr(0,sn.indexOf('&'));
            }
            else{   //此站有几部车。
                if(!p.route[Math.floor(j/2)]){ //空对象时要表明是一个对象才能有属性赋值。
                    p.route[Math.floor(j/2)] = {};
                }
                busNum = hasBusPattern.exec($(this).html())? hasBusPattern.exec($(this).html())[0]:busNum;
                p.route[Math.floor(j/2)].hasBus =busNum;
                busNum = 0;
            }
        })
    })
    callback(result);
}


function parseHtml(body,callback){
    var result = [];
    var record = [];
    var date;
    var timePattern = /\d{2}:\d{2}/;
    var sportNamePattern = /\s[\s\S]+?<a/;
//var livePattern = /<a(\s\S)+?<\/a>/;
    var objTime;
    var objContent = new String();
    var objLive ;
    $ = cheerio.load(body);
    $("#left div.box").each(function(i,v){
        date =  this.find(".titlebar h2").html()
        result = [];
        this.find("ul li").each(function(){
            //下面是搜索出时间的正则
            objTime = timePattern.exec(this.html());

            //下面是搜索出节目名称的
            if(this.html().search(/<b>/) > 0){//has <b>
                this.html().replace(/<(\/)?b>/g,"");
                objContent = sportNamePattern.exec(this.html().replace(/<(\/)?b>/g,""));
                objContent = objContent.toString().replace(/<a/,"");
            }
            else{//no <b>
                objContent = sportNamePattern.exec(this.html().replace(/<(\/)?b>/g,""));
                objContent = objContent.toString().replace(/<a/,"");
            }

            //下面是搜索出直播的平台。
            //console.log("live:"+this.html())
            var livePattern = /<a[\s\S]+?[直播]{1}<\/a>/g;
            if(this.html().search(livePattern) > 0){
                //console.log('has <a></a>')
            }
            //var tem =livePattern.exec(this.html());
            //console.log(tem)
            //console.log("the ret array:"+this.html().match(livePattern));
            //console.log(tem.replace(/<a[\s\S]+?>]/,""));
            objLive = livePattern.exec(this.html());
            //console.log(objLive);
            result.push({time:objTime.toString(),content:objContent.toString()})
            //console.log(this.html());
        });
        record.push({time:date,content:result})
    });
    callback(record);
}
