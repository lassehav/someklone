var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
        name: String,
        password: String,
        email: String,
        following: [mongoose.Schema.Types.ObjectId]
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('User', userSchema);
