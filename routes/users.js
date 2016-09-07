var express = require('express');
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
        models.user.find({ _id: req.params.id }).then(function(result){
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

    }

    function addNewFriend(req,res,next)
    {

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
