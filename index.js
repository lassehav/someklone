var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var models = require('./models');
var app = express();


app.use(cors());

// You can store key-value pairs in express, here we store the port setting
app.set('port', (process.env.PORT || 80));

// bodyParser needs to be configured for parsing JSON from HTTP body
app.use(bodyParser.json());

// Simple hello world route
app.get('/', function(req, res, next) {
    res.send("Hello world");
});
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
app.get('/posts', function(req, res, next){    
    models.Posts.findAll().then(function(s) {
        res.json(s);
    }); 
});

app.get('/posts/:id', function(req, res, next){    
    models.Posts.findById(req.params.id).then(function(s) {
        res.json(s);
    }); 
});

app.get('/posts/user/:userId', function(req, res, next){    
    models.User.findById(req.params.userId)
    .getUserPosts()
    .then(function(s) {
        res.json(s);
    }); 
})

app.post('/users', function(req,res,next){
    models.User.create({
        username: "Test",
        profileImageSmall: "http://core0.staticworld.net/images/article/2015/11/111915blog-donald-trump-100629006-primary.idge.jpg"    
    }).then(function(i) {
        res.json({
            id: i.dataValues.id
        });        
    });
});

app.post('/posts', function(req,res,next){
    models.Post.create({
        image: "https://lh4.ggpht.com/wKrDLLmmxjfRG2-E-k5L5BUuHWpCOe4lWRF7oVs1Gzdn5e5yvr8fj-ORTlBF43U47yI=w300",        
        imageThumbnail: "https://lh4.ggpht.com/wKrDLLmmxjfRG2-E-k5L5BUuHWpCOe4lWRF7oVs1Gzdn5e5yvr8fj-ORTlBF43U47yI=w300",        
        caption: "Jelloo"    
    }).then(function(i) {
        res.json({
            id: i.dataValues.id
        });        
    });
});




models.sequelize.sync().then(function() {
    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });
});


