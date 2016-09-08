var express = require('express');
var Promise = require('bluebird');
var router = express.Router();

module.exports = function (models)
{
    function getAllUsers(req,res,next)
    {            
        models.user.find().then(function(result){
            res.json(result);
        });
    }

    function createNewUser(req,res,next)
    {
        var u = new models.user({ name: "test"});
        u.save().then(function(err, obj){
             console.log("user created");
        });
    }

    function getSingleUser(req,res,next)
    {        
        models.user.findById(req.params.id).then(function(result){
            res.json(result);
        });
    }

    function deleteUser(req,res,next)
    {
        
    }

    function updateUser(req,res,next)
    {
        
    }

    function getUserFriends(req,res,next)
    {
        models.user.findById(req.params.id).then(result => {
            var queries = result.following.map(f => {
                return models.user.findById(f);
            });

            Promise.all(queries).then(results => {
                res.json(results);
            });            
        })
    }

    function addNewFriend(req,res,next)
    {
        var queries = [
            models.user.findById(req.params.id),
            models.user.findById(req.body.friendId)
        ];
        Promise.all(queries).then(qres => {
            console.log(qres);
            qres[0].following.push(qres[1]._id);
            qres[0].save().then(result => {
                console.log("save complete");
                console.log(result);
                res.sendStatus(200)
            });
        });
        
    }

    function deleteFriend(req,res,next)
    {

    }

    router.route('/users')
        .get(getAllUsers)
        .post(createNewUser);

    router.route('/users/:id')
        .get(getSingleUser)    
        .delete(deleteUser)
        .put(updateUser);

    router.route('/users/:id/friends')
        .get(getUserFriends)
        .post(addNewFriend)
        .delete(deleteFriend);

    return {
        test: function(){
            console.log("get all users");
        },
        router: router
    };
}
