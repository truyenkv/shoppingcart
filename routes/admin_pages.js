var express = require('express');
var router = express.Router();

const{ check, validationResult } = require('express-validator');

//get page model
var Page = require('../models/page');


/*
* GET pages index 
*/

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
                    sorting: 0
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

// POST reorder page 
router.post('/reorder-pages', (req, res) => {
    var ids = req.body['id[]'];
    var count = 0;
    for(var i=0; i< ids.length; i++){
        var id = ids[i];
        count++;
        ((count) => {
            Page.findById(id, (err, page) => {
                page.sorting = count;
                page.save((err) => {
                    if(err)
                        return console.log(err);
                });
            });
        })(count);
    }
    
});


/*
* GET edit page
*/
router.get('/edit-page/:slug', (req, res) => {
    Page.findOne({slug: req.params.slug}, (err, page) => {
        if(err)
            return console.log(err);
         res.render('admin/edit_page', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
    });
    
    });
    
});

/*
* POST edit page
*/
router.post('/edit-page/:slug',[
    check('title').notEmpty().withMessage('Title must have a value'),
    check('content').notEmpty().withMessage('Content must have a value')
], (req, res) => {
    var title = req.body.title;
     var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
     if(slug== "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id = req.body.id;
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    } else{
        Page.findOne({slug: slug, _id:{'$ne': id}}, function(err, page){
            if(page){
                req.flash('danger', 'Page slug exists, choose another');
                res.render('admin/edit_page',{
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {
                Page.findById(id, (err, page) => {
                    if(err)
                        return console.log(err);
                    page.title = title;
                    page.slug = slug;
                    page.content = content;
                    page.save((err) => {
                        if(err) return console.log(err);
                        req.flash('success', 'Page added');
                        res.redirect('/admin/pages/edit-page/'+page.slug);
                    });
                });
                
                
            }

        });
    }
      
});

/*
* GET pages delete 
*/

router.get('/delete-page/:id', (req, res) => {
    Page.findByIdAndRemove(req.params.id, (err)=>{
        if(err) return console.log(err);
        req.flash('success', 'Page deleted');
        res.redirect('/admin/pages');
    });
});



module.exports = router;