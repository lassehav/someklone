var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
        imageUrl: String,    
        owner: String,
        description: String,    
        comments: [],
        likes: []
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Post', postSchema);
