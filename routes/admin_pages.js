var express = require('express');
var router = express.Router();
const{ check, validationResult } = require('express-validator');

/*
* GET pages index 
*/
router.get('/', function(req, res){
    res.send('admin area');
});

/*
* GET add page
*/
router.get('/add-page', function(req, res){
    var title = "";
    var slug = "";
    var content = "";
    res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content
    });
    
});


/*
* POST add page
*/
router.post('/add-page',[
    check('title').notEmpty().withMessage('Title must have a value'),
    check('content').notEmpty().withMessage('Content must have a value')
], (req, res) => {
    var title = req.body.title;
     var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
     if(slug== "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var errors = validationResult(req);
    console.log('-------------------',errors);
    if(errors){
        console.log(errors);
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    }
    // else {
    //     console('success');
    // }   
});
// router.post('/add-page', function(req, res){
//     // req.checkBody('title', 'Title must have a value').notEmpty();
//     // req.checkBody('Content', 'Content must have a value').notEmpty();
//     var title = req.body.title;
//     var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
//     if(slug== "") slug = title.replace(/\s+/g, '-').toLowerCase();
//     var content = req.body.content;
//     check('title', 'Title must have a value').notEmpty();
//     check('content', 'Content must have a value').notEmpty();
//     var errors = validationResult(req);
//     if(errors){
//         console.log(errors);
//         res.render('admin/add_page', {
//             errors: errors,
//             title: title,
//             slug: slug,
//             content: content
//         });
//     }else {
//         console('success');
//     }   
// });

//export
module.exports = router;