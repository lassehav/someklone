var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config.json');

var app = express();

mongoose.Promise = require('bluebird');

mongoose.connect(process.env.MONGODB_URI || config.mongoUri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    var models = { user: require('./models/user.js')};
    var userRoutes = require('./routes/users.js')(models);       
        
    // You can store key-value pairs in express, here we store the port setting
    app.set('port', (process.env.PORT || 80));

    // bodyParser needs to be configured for parsing JSON from HTTP body
    app.use(bodyParser.json());

    // Mount our routes behind /api/ prefix
    app.use('/api', userRoutes.router);

    // Simple hello world route
    app.get('/', function(req, res) {
        res.send("Hello world");
    });

    // start listening for incoming HTTP connections
    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });
});


