'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: { type: DataTypes.STRING, primaryKey: true, autoIncrement: true},
    username: DataTypes.STRING,
    profileImageSmall: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Post, {through: 'UserPosts'});
        User.belongsToMany(models.Post, {through: 'PostLikes'})
      }
    }
  });
  return User;
};