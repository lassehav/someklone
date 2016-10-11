'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    profileImageSmall: DataTypes.STRING,    
  }, 
  {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Post);
        User.belongsToMany(models.Post, {through: 'UserPostLikes', as: 'Likes'}); // likes are handled by creating a m-to-m join table   
      }
    },
    instanceMethods: {
      // Clear the password and salt fields when stringifying instace to JSON format 
      // since we do not want to send these outside the system
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