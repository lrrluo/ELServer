/**
 *
 * Created by L on 13-12-27.
 */

var fs = require('fs');
var q = require('q');
var cheerio = require('cheerio');
var request = require('request');
var utils = require('./util');
var moment = require('moment');


function find(defer){
	var url = "http://www.zhibo8.cc/";
	request(url, function(err, resp, body) {
		if (err)
			throw err;
		utils.parseHtml(body,function(result){
			var i = 0;
			for(; i < result.length; i++){
				result[i]["logTime"] = new moment().format("YYYY-MM-DD");
				//sm = new spmodel(result[i]);
				//sm.save();
			}
			defer.resolve(result);
			//if(result.length > value)
			//	defer.resolve(result[value]);
			//else defer.resolve(result[0]);

		});
	});
	/*spmodel.find(parma,function(err,data){
		var now = new moment(),
			logTime ;
		if(data.length >0){
			logTime = new moment(data[0]["logTime"]);
			if(logTime.diff(now,'days') >= 0){
				defer.resolve(data[0]);
				spmodel.remove(function(){
					console.log(arguments,'empty');
				})
				return false;
			}
		}
	})*/
}


function getList(){
    var defer = q.defer();
	find(defer)
    return defer.promise;
}

exports.get = getList;

/*fs.exists("./public/resourses/SL/"+time,function(exists){
 console.log(exists+"::in exists callback");
 if(!exists){
 defer.resolve(true);
 console.log("file here");
 }
 else if(1==1){
 fs.readFile('public/resourses/tv.html', function(err, data) {
 var $ = cheerio.load(data);
 $("#left").each(function(i,v){
 console.log("time:"+this.find(".titlebar h2").html()+"::end");
 this.find("ul li").each(function(){

 //fs.writeFile("./public/resourses/SL/"+time,this.html());
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
 console.log("live:"+this.html())
 var livePattern = /<a[\s\S]+?[直播]{1}<\/a>/g;
 if(this.html().search(livePattern) > 0){
 console.log('has <a></a>')
 }
 //var tem =livePattern.exec(this.html());
 //console.log(tem)
 console.log("the ret array:"+this.html().match(livePattern));
 //console.log(tem.replace(/<a[\s\S]+?>]/,""));
 objLive = livePattern.exec(this.html());
 //console.log(objLive);
 return false;




 result.push({time:objTime.toString(),content:objContent.toString()})
 //console.log(this.html());
 });
 //console.log("the result is :"+JSON.stringify(result));
 //   fs.writeFile("./public/resourses/SL/"+time,this.find("ul").html());
 defer.resolve(true);
 return false;
 //  console.log(this.find("ul").html());
 });
 });

 console.log("file not here");
 }
 })*/

