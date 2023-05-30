const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js');

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
}, {
  // Options
});

module.exports = Comment;
