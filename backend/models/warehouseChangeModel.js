module.exports = (sequelize, DataTypes) => {


  const WarehouseChange = sequelize.define('WarehouseChange', {
    ID_change: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_material: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Materials',
        key: 'ID_material',
      },
    },
    ID_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'ID_user',
      },
    },
    ChangeDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    Amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    TypeChange: {
      type: DataTypes.ENUM('dodano', 'uklonjeno', 'inventura', 'ispravak'),
      allowNull: false,
    },
    Note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'WarehouseChange',
    timestamps: false,
  });

  WarehouseChange.associate = (models) => {
  WarehouseChange.belongsTo(models.Materials, {
    foreignKey: 'ID_material',
    as: 'Material'
  });

    WarehouseChange.belongsTo(models.User, {
    foreignKey: 'ID_user',
    as: 'User'
  });
};

  return WarehouseChange;
};
