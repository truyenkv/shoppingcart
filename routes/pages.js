var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.render('index', {
      title: 'Home'
    });
});

//sau dau / chinh la url 
// router.get('/test', function(req, res){
//   res.send('testing area....')
// });
//export
module.exports = router;