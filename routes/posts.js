var express = require('express');
var Promise = require('bluebird');
var router = express.Router();

module.exports = function (models)
{
    function getRecentPosts(req,res,next)
    {
        models.post.find().then(posts => {
            res.json(posts);
        })
    }

    function createNewPost(req,res,next)
    {
        var p = new models.post({
                                    imageUrl: "https://nicedeb.files.wordpress.com/2007/12/chuck_norris.jpg",
                                    owner: req.body.owner,
                                    description: req.body.description
                                 });
        p.save().then(result => {
            res.sendStatus(201);
        });                                 
    }

    function getSinglePost(req,res,next)
    {
        models.post.findById(req.params.id).then(result => {
            res.json(result);
        });
    }

    function addComment(req,res,next)
    {
        models.post.findById(req.params.id).then(result => {
            result.comment.push({
                text: req.body.text,
                user: req.body.user
            });
            result.save().then( () => {
                res.sendStatus(200);
            });

        });
    }

    function addLike(req,res,next)
    {

    }

    function getUserPosts(req,res,next)
    {

    }

    router.route('/posts')
        .get(getRecentPosts)
        .post(createNewPost);
        
    router.route('/posts/user/:id')
        .get(getUserPosts);        

    router.route('/posts/:id')
        .get(getSinglePost);          
        
    router.route('/posts/:id/comment')        
        .post(addComment);

    router.route('/posts/:id/like')        
        .post(addLike);            

    return {        
        router: router
    };
}
