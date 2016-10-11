var express = require('express');
var Promise = require('bluebird');
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
    router.route('/') // Get all posts
        .get(function(req,res){
            models.Post.findAll({
                include: [ 
                            { 
                                model: models.User,
                                attributes: ['id','username','profileImageSmall']
                            },
                            { 
                                model: models.Comment, 
                                include: {
                                            model: models.User,
                                            attributes: ['id','username','profileImageSmall']
                                            }
                            }
                        ],
                order: [
                    ['createdAt', 'DESC']
                ]
            }).then(function(posts) {
                Promise.all(posts.map(function(post){
                    return post.countLikes();
                })).then(function(likes){
                    var postsWithLikes = posts.map(function(post, index){
                        post.dataValues.likes = likes[index];
                        return post;
                    });

                    res.json(postsWithLikes);
                })                                
            }).catch(function(err){
                console.log(err);
                res.sendStatus(500);
            });
        })
        
        .post(upload.single('image'), function(req, res, next) { // new post upload with image
        
            if(req.file != undefined)
            {
                cloudinary.uploader.upload(req.file.path, function(cloudinaryResult) { 
                    models.User.findById(req.body.userId).then(function(u){
                        if(u===null)
                        {
                            res.sendStatus(400);
                            return;
                        }

                        fs.unlink(req.file.path, function(err) {
                            if (err)
                            {
                                console.log("file deletion error " + err);
                            };                            
                        });

                        // store the post to db
                        u.createPost({
                            image: cloudinary.url(cloudinaryResult.public_id, { width: 800, height: 600, crop: 'fill' } ),        
                            imageThumbnail: cloudinary.url(cloudinaryResult.public_id, { width: 150, height: 100, crop: 'fill' } ),        
                            caption: req.body.caption })        
                        .then(function(p) { 
                            p.dataValues.user = u;           
                            res.json(p);                                
                        }).catch(function(err){
                            console.log(err);
                            res.sendStatus(500);
                        });                    
                    });
                })                                
            }
            else
            {
                // For development allow post creation without image
                models.User.findById(req.body.userId).then(function(u){
                    if(u===null)
                    {
                        res.sendStatus(400);
                        return;
                    }
                            
                    u.createPost({
                        image: "",
                        imageThumbnail: "",        
                        caption: req.body.caption })        
                    .then(function(p) { 
                        p.dataValues.user = u;           
                        res.json(p);                                
                    }).catch(function(err){
                        console.log(err);
                        res.sendStatus(500);
                    });
                });
            }                                
        });
    
    router.route('/:postId')
        .get(function(req, res, next){ // get single post    
            models.Post.findById(req.params.postId,
                                { include: [ 
                                            { 
                                                model: models.User,
                                                attributes: ['id','username','profileImageSmall']
                                            },
                                            { 
                                                model: models.Comment, 
                                                include: {
                                                            model: models.User,
                                                            attributes: ['id','username','profileImageSmall']
                                            }
                                        }
                                    ] 
                                }).then(function(s) {
                                    res.json(s);
                                }); 
        });
    
    router.route('/:postId/comment')
        .post(function(req,res){ // Add comment to a post
            models.Comment.create({
                UserId: req.body.userId,
                text: req.body.comment,
                PostId: req.params.postId
            }).then(function(comment) {
                res.json(comment);                                      
            }).catch(function(err){
                console.log(err);
                res.sendStatus(500);
            });
        });

    router.route('/:postId/like')
        .post(function(req,res){ // add a like to a post
            Promise.all([
                models.User.findById(req.body.likerUserId),
                models.Post.findById(req.params.postId)
            ]).then(function(results){
                var u = results[0];
                var p = results[1];

                p.addLike(u).then(function(likeRes){
                    res.json(likeRes);
                }).catch(function(err){
                    console.log(err);
                    res.sendStatus(500);
                });                
            })
        });
    
    router.route('/:postId/unlike')
        .post(function(req,res){ // remove a like from a post
            Promise.all([
                models.User.findById(req.body.likerUserId),
                models.Post.findById(req.params.postId)
            ]).then(function(results){
                var u = results[0];
                var p = results[1];

                p.removeLike(u).then(function(likeRes){                    
                    res.json(likeRes);
                }).catch(function(err){
                    console.log(err);
                    res.sendStatus(500);
                });                
            })
        });
    
    router.route('/user/:userId')
        .get(function(req, res, next){  // get posts of a single user
            models.Post.findAll({ where: { UserId: req.params.userId }}).then(function(posts) {
                res.json(posts);
            }).catch(function(){
                res.sendStatus(400)
            }); 
        });

    return { router: router }
}
