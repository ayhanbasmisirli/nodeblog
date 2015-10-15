var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require("monk")('localhost/nodeblog');

///Home page blog post
router.get('/add', function(req, res, next) {
    res.render('addcategory',{
        "title":"Add Category"
    })
});

router.post('/add',function(req,res,next){

    //get  form values
    var title = req.body.title;



    req.checkBody('title','title field is required').notEmpty();


    var errors = req.validationErrors();

    if(errors){
        res.render('addcategory',{
            "errors":errors,
            "title":title,

        });
    }else{
        var categories = db.get('categories');

        categories.insert({
            "title":title

        },function(err,post){
            if(err){res.send("There is a issue submitting category");}
            else{
                req.flash('success','Category Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }

});


module.exports = router;