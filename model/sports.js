/**
 *
 * Created by L on 13-12-27.
 */
    var mongodb = require("../common/db");

    function sportsLive(obj){
        this.time = obj.time;
        this.content = obj.content;
    }


    module.exports = sportsLive;

    sportsLive.prototype.addRecord = function(callback){
        var spoLive = {
            time:this.time,
            content:this.content
        }

        mongodb.open(function(err,db){
            if(err){
                return callback(err,":open");
            }

            db.collection('sportsLive',function(err,collection){
                if(err){
                    mongodb.close();
                    return callback(err,"collection");
                }
                collection.ensureIndex("time",{unique:true});
                collection.insert(spoLive,{safe:true},function(err,spo){
                    if(err){
                        mongodb.close();
                        return callback(err,"insert");
                    }
                    mongodb.close();
                    callback(err,spo);
                })
            })
        })


    }
