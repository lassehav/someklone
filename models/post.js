'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    image: DataTypes.STRING,    
    imageThumbnail: DataTypes.STRING,
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    caption: DataTypes.STRING    
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Post.hasOne(models.User, {as: 'Owner'});
        Post.hasMany(models.User, {as: 'Likes'});        
      }
    }
  });
  return Post;
};