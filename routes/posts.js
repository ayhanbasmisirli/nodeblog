var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');


router.get('/add',function(req,res,next){


    var categories = db.get('categories');
    categories.find({},{},function(err,categories){

        res.render('addpost',{
            'title':'Add Post',
            'categories':categories
        });

    })


});
router.post('/add',function(req,res,next){

	//get  form values
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();

	if (req.files.mainimage) {
		var mainimageOriginalName = req.files.mainimage.originalname;
		var mainimageName= req.files.mainimage.name;
		var mainimageMime= req.files.mainimage.mimetype;
		var mainimagePath= req.files.mainimage.path;
		var mainimageExt= req.files.mainimage.extension;
		var mainimagesize= req.files.mainimage.size;


	}else{
		var mainimageName = 'noimage.png';
	}
    req.checkBody('title','title field is required').notEmpty();
    req.checkBody('body','Body field is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('addpost',{
           "errors":errors,
            "title":title,
            "body":body
        });
    }else{
        var posts = db.get('posts');

        posts.insert({
            "title":title,
            "body":body,
            "category":category,
            "author":author,
            "date":date,
            "mainimage":mainimageName



        },function(err,post){
            if(err){res.send("There is a issue submitting post");}
            else{
                req.flash('success','Post Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }

});


module.exports = router;