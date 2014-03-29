/**
 *
 * Created by L on 14-1-5.
 */

var q = require("q");
var request = require("request");
var utils = require("../common/util");
var moment  = require('moment');


var mongoose = require('mongoose'),
    Schema,content,sportLiveSchema ;

mongoose.connect('mongodb://localhost/ELServer');
Schema = mongoose.Schema;
content = new Schema({
    time: String,
    content: String
});
sportLiveSchema = new Schema({
    logTime: String,
    time: String,
    content:[content]
});

citiesSchema = new Schema({
    cities: [String]
});

module.exports = {
    spLiveDao: SpostLiveModel,
    cityDao:cities
};


function cities(){
    var cityModel = mongoose.model('cities',citiesSchema);
    return{
        setModel: setCities,
        getModel: getCities
    }
    function setCities(data){
        var c = new cityModel({cities:data});
        c.save();
    }

    function getCities(callback){
        cityModel.find({},function(err,data){
                callback(data);
        })
    }
}

function SpostLiveModel(){
    var spmodel = mongoose.model('spList',sportLiveSchema);
    return {
       model: slModel,
       find: find
    }
    function find(parma,value,defer){
        spmodel.find(parma,function(err,data){
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
                var url = "http://www.zhibo8.cc/";
                request(url, function(err, resp, body) {
                    if (err)
                        throw err;
                    utils.parseHtml(body,function(result){
                        var i = 0;
                        var sm;
                        for(; i < result.length; i++){
                           result[i]["logTime"] = new moment().format("YYYY-MM-DD");
                           sm = new spmodel(result[i]);
                           sm.save();
                        }
                        if(result.length > value)
                            defer.resolve(result[value]);
                        else defer.resolve(result[0]);

                   });
                });
        })
    }
    function slModel(){
        return spmodel;
    }
};


