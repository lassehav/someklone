var Promise = require("bluebird");
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var models = require('./models');
//var multer = require('multer');
var cloudinary = require('cloudinary');
//var cloudinaryStorage = require('multer-storage-cloudinary');
var app = express();

// Config cloudinary storage for multer-storage-cloudinary
/*var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: '', // give cloudinary folder where you want to store images
  allowedFormats: ['jpg', 'png'],
});*/

//var uploadParser = multer({ storage: storage });

var userRoutes = require('./routes/user')(models);
var postRoutes = require('./routes/post')(models);

app.use(cors());

// You can store key-value pairs in express, here we store the port setting
app.set('port', (process.env.PORT || 80));

// bodyParser needs to be configured for parsing JSON from HTTP body
app.use(bodyParser.json());

// Simple hello world route
app.get('/', function(req, res, next) {
    res.send("Hello world");
});



app.use('/users', userRoutes.router);
app.use('/posts', postRoutes.router);


/*




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

app.get('/users', function(req,res,next){
    models.User.findAll().then(function(u){
        res.json(u);
    })
});

app.post('/posts', function(req,res,next){
    models.User.findById(1).then(function(u){
        u.createPost({
            image: "https://lh4.ggpht.com/wKrDLLmmxjfRG2-E-k5L5BUuHWpCOe4lWRF7oVs1Gzdn5e5yvr8fj-ORTlBF43U47yI=w300",        
            imageThumbnail: "https://lh4.ggpht.com/wKrDLLmmxjfRG2-E-k5L5BUuHWpCOe4lWRF7oVs1Gzdn5e5yvr8fj-ORTlBF43U47yI=w300",        
            caption: "Jelloo"})        
        .then(function(p) { 
            p.dataValues.User = u;           
            res.json(p);                                
        });       
    });    
});

app.post('/posts/:postId/likes/:userId', function(req,res,next){
    Promise.all([
        models.User.findById(req.params.userId),
        models.Post.findById(req.params.postId)
    ]).then(function(results){
        var u = results[0];
        var p = results[1];

        p.addLike(u).then(function(likeRes){
            res.json(likeRes);
        })
        .catch(function(err){
            console.log(err);
            res.sendStatus(500);
        });
        
    })
});

app.get('/posts/:postId/likes/count',function(req,res,next){

    models.Post.findById(req.params.postId).then(function(post){
        post.countLikes().then(function(l){
            res.json(l);
        });
        
    });    
});


*/


models.sequelize.sync({force: true}).then(function() {
    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });
});

