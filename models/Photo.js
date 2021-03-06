module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("Photo", {
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Photo.belongsTo(models.Users);
      }
     }
    });
  return Photo;
};