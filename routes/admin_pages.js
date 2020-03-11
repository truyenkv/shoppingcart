var express = require('express');
var router = express.Router();

const{ check, validationResult } = require('express-validator');

//get page model
var Page = require('../models/page');


/*
* GET pages index 
*/
// router.get('/', function(req, res){
//     res.send('admin area');
// });
router.get('/', (req, res) => {
    Page.find({}).sort({sorting: 1}).exec((err, pages) => {
        res.render('admin/pages', {
            pages: pages
        });
    });
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
    if(!errors.isEmpty()){
        console.log(errors);
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else{
        Page.findOne({slug: slug}, function(err, page){
            if(page){
                console.log('tim thanh cong')
                req.flash('danger', 'Page slug exists, choose another');
                res.render('admin/add_page',{
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });
                page.save(function(err){
                    if(err) return console.log(err);
                    req.flash('success', 'Page added');
                    res.redirect('/admin/pages');
                });
            }

        });
    }
      
});
module.exports = router;