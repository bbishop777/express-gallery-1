module.exports = function(sequelize, DataTypes) {
  console.log('photo model');
  var Photo = sequelize.define("Photo", {
    author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // Photo.belongsTo(models.User);
      }
    }
  });
  return Photo;
};