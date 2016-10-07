'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    profileImageSmall: DataTypes.STRING,
    
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Post);

        User.belongsToMany(models.Post, {through: 'UserPostLikes', as: 'Likes'});   
      }
    },
    instanceMethods: {
      toJSON: function () {
        var values = this.get();

        delete values.password;
        delete values.salt;
        return values;
      }  
    }
  });
  
  return User;
};