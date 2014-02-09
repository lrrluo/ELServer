/**
 *
 * Created by L on 14-1-5.
 */

var q = require("q");
var request = require("request");
var utils = require("../common/util");


var mongoose = require('mongoose'),
    Schema,content,sportLiveSchema ;

mongoose.connect('mongodb://localhost/ELServer');
Schema = mongoose.Schema;
content = new Schema({
    time: String,
    content: String
});
sportLiveSchema = new Schema({
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
    function find(parma,defer){
        spmodel.find(parma,function(err,data){
            if(data.length >0){
                defer.resolve(data[0]);
            }
            else{
                var url = "http://www.zhibo8.cc/";
                request(url, function(err, resp, body) {
                    if (err)
                        throw err;
                    utils.parseHtml(body,function(result){
                        var i = 0;
                        var sm;
                        for(; i < result.length; i++){
                           sm = new spmodel(result[i]);
                           sm.save();
                        }
                       defer.resolve(result[0]);

                   });
                });
            }
        })
    }
    function slModel(){
        return spmodel;
    }
};


