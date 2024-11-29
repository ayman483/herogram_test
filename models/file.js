const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const FileTags = require('./filetag');

// Define the File model
const File = sequelize.define('File', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  clickCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Initially, no clicks
  },
});

// Define the relationship: A File can have many FileTags
File.hasMany(FileTags, { foreignKey: 'file_id', as: 'fileTags' });

FileTags.belongsTo(File, { foreignKey: 'file_id', as: 'file' });


module.exports = File;
