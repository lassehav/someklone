'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    text: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {

        Comment.belongsTo(models.User);
        Comment.belongsTo(models.Post);
      }
    }
  });
  return Comment;
};