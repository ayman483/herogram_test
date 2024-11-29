// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// class FileTags extends Model {}

// FileTags.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     file_id: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: 'Files',
//         key: 'id',
//       },
//     },
//     tag_name: {
//       type: DataTypes.STRING(100),
//     },
//   },
//   {
//     sequelize,
//     modelName: 'FileTags',
//     tableName: 'FileTags',
//   }
// );

// module.exports = FileTags;


const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Import the File model AFTER it's defined
const File = require('./file');

class FileTags extends Model {}

FileTags.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Files',
        key: 'id',
      },
    },
    tag_name: {
      type: DataTypes.STRING(100),
    },
  },
  {
    sequelize,
    modelName: 'FileTags',
    tableName: 'FileTags',
  }
);

// Define the reverse association: A FileTag belongs to a File

module.exports = FileTags;
