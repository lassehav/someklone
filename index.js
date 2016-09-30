var cloudinary = require('cloudinary');
var cloudinaryStorage = require('multer-storage-cloudinary');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// Config cloudinary storage for multer-storage-cloudinary
// https://github.com/affanshahid/multer-storage-cloudinary
var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'someklone',
  allowedFormats: ['jpg', 'png'],
});

var parser = multer({ storage: storage });


mongoose.Promise = require('bluebird');

mongoose.connect(process.env.MONGODB_URI || require('./config.json').mongoUri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    var models = { 
        user: require('./models/user.js'),
        post: require('./models/post.js')
    };
    var userRoutes = require('./routes/users.js')(models);
    var postRoutes = require('./routes/posts.js')(models);       
        
    // You can store key-value pairs in express, here we store the port setting
    app.set('port', (process.env.PORT || 80));

    // bodyParser needs to be configured for parsing JSON from HTTP body
    app.use(bodyParser.json());

    // Mount our routes behind /api/ prefix
    app.use('/api', userRoutes.router);
    app.use('/api', postRoutes.router);

    // Simple hello world route
    app.get('/', function(req, res) {
        res.send("Hello world");
    });

    // Create the upload route for image uploading
    // The .single method is documented here https://github.com/expressjs/multer#singlefieldname    
    app.post('/upload', parser.single('image'), function (req, res) {        
        console.log(req.file);
        res.sendStatus(201);
    });

    // start listening for incoming HTTP connections
    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });
});


