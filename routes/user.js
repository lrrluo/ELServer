
/*
 * GET users listing.
 */

exports.list = function(req, res){
    res.render('index');
    res.render('index', { title: 'Express' });
  //res.send("respond with a resource");
};