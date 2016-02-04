//change to singular User and then do so on server and anywhere else
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    }
  }, {
    classMethods: {
      associate: function(models) {
      Users.hasMany(models.Photo);
      }
     }
    });
  return Users;
};