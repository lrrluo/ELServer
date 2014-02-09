/**
 * Created by L on 14-1-6.
 */

var mom = require("moment");

var time = mom().format("MM月DD日");
var t = "01月07日 sdfsdfsd";
t.search(/^/)
console.log(time);
function re(){
    var a= [];
    a.push({time:"222",con:"sdfds"});
    a.push({time:"333",con:"dfff"});
    return a;
}
var t = re();
console.log(t);