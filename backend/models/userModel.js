module.exports = (sequelize, DataTypes) => {


  const User = sequelize.define('User', {
    ID_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Lastname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Contact: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Role: {
      type: DataTypes.ENUM('admin', 'zaposlenik'),
      allowNull: false,
      defaultValue: 'zaposlenik',
    },
  }, {
    timestamps: false,  // ako ne koristiš createdAt / updatedAt
  });

  User.associate = (models) => {
    User.hasMany(models.Offer, {
      foreignKey: 'ID_user',
      as: 'Offers'
    });

    User.hasMany(models.Receipt, {
      foreignKey: 'ID_user',
      as: 'Receipts'
    });

    User.hasMany(models.WarehouseChange, {
      foreignKey: 'ID_user',
      as: 'WarehouseChanges',
    });
  };

  return User

}
