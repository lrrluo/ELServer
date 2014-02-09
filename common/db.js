/**
 * Created by L on 13-12-27.
 */
//var dbSetting  = require('../public/javascripts/dbSetting');
//var Db = require('mongodb').Db;
//var connection = require('mongodb').Connection;
//var Server = require('mongodb').Server;
//module.exports = new Db(dbSetting.db, new Server(dbSetting.host,connection.DEFAULT_PORT,{safe:false}));
module.exports = {
   SportsLiveModel: SpostLiveModel
};

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

    function SpostLiveModel(){
        return mongoose.model('spList',sportLiveSchema);
    };

//var mom = require("moment");
//var mo = new spList({
//    time: mom().format("YYYY-MM-DD"),
//    content:[{time:"9:00",content:"test"}]
//})
//mo.save();
//var mo = mongoose.model('spList');
//spList.find({},function(err,data){
//    if (err){
//        console.log("errrorrororo");
//    }
//    console.log("the list is :"+data);
//})


