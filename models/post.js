'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    image: DataTypes.STRING,    
    imageThumbnail: DataTypes.STRING,    
    caption: DataTypes.STRING    
  }, {
    classMethods: {
      associate: function(models) {

        Post.belongsTo(models.User);
        Post.belongsToMany(models.User, {through: 'UserPostLikes', as: 'Likes'});
        Post.hasMany(models.Comment);
      }
    }
  });
  return Post;
};