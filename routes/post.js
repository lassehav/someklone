var express = require('express');
var bcrypt = require('bcryptjs');
var cloudinary = require('cloudinary');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var router = express.Router();

/*
var posts = [
        {
            id: 0,
            user: {
                id: 1,
                username: "dtrump",
                profileImageSmall: "http://core0.staticworld.net/images/article/2015/11/111915blog-donald-trump-100629006-primary.idge.jpg" 
            },                                                 
            image: "http://media1.fdncms.com/sacurrent/imager/u/original/2513252/donald_trump4.jpg",
            imageThumbnail: "http://media1.fdncms.com/sacurrent/imager/u/original/2513252/donald_trump4.jpg",
            likes: 892,
            userLike: true,
            caption: "Always winning #elections",
            tags: ['elections'],         
            comments: [
                {
                    id: 0,
                    user: {
                        id: 2,
                        username: "POTUS",
                        profileImageSmall: "http://core0.staticworld.net/images/article/2015/11/111915blog-donald-trump-100629006-primary.idge.jpg"
                    },                    
                    text: "You're never going to make it don #losing",
                    userRefs: [],
                    tags: ["losing"]
                },
                {
                    id: 1,
                    user: {
                        id: 3,
                        username: "HillaryC",
                        profileImageSmall: "http://core0.staticworld.net/images/article/2015/11/111915blog-donald-trump-100629006-primary.idge.jpg"
                    },                    
                    text: "Damn right @POTUS",
                    userRefs: ["POTUS"],
                    tags: []       
                }                                               
            ]
        }
    ]
*/

module.exports = function(models)
{
    router.route('/')
        .get(function(req,res){
            models.Post.findAll({
                                    include: [models.User],
                                    order: [
                                        ['createdAt', 'DESC']
                                    ]
                                }).then(function(s) {
                res.json(s);
            });
        })
        
        .post(upload.single('image'), function(req, res, next) {
        
            if(req.file != undefined)
            {
                cloudinary.uploader.upload(req.file.path, function(cloudinaryResult) { 
                    models.User.findById(req.body.userId).then(function(u){
                        if(u===null)
                        {
                            res.sendStatus(400);
                            return;
                        }

                        u.createPost({
                            image: cloudinary.url(cloudinaryResult.public_id, { width: 800, height: 600, crop: 'fill' } ),        
                            imageThumbnail: cloudinary.url(cloudinaryResult.public_id, { width: 150, height: 100, crop: 'fill' } ),        
                            caption: req.body.caption })        
                        .then(function(p) { 
                            p.dataValues.user = u;           
                            res.json(p);                                
                        });                    
                    });
                })                                
            }
            else
            {
                res.sendStatus(400);
            }
            
            /*
            {                
                
            }*/

            /* Request body
                {
                    "userId":value,
                    "image:"x-www-form-urlencoded,
                    "caption":string
                }
            */
                
        });
    
    router.route('/:postId')
        .get(function(req, res, next){    
            models.Post.findById(req.params.postId).then(function(s) {
                res.json(s);
            }); 
        });

    return { router: router }
}
