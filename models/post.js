const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js');
const User = require('./user.js');
const Comment = require('./comment.js');

const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }, 
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    } 
  }
}, {
  // Options
});


module.exports = Post;
