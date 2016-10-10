var Promise = require("bluebird");
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var models = require('./models');
var app = express();


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


//models.sequelize.sync({force: true}).then(function() {
models.sequelize.sync().then(function() {
    
    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });
    
});
