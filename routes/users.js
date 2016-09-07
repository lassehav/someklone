var express = require('express');
var router = express.Router();

function getAllUsers(req,res,next)
{

}

function createNewUser(req,res,next)
{
    
}

function getSingleUser(req,res,next)
{
    
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


module.exports = router;