module.exports = (sequelize, DataTypes) => {
  const WarehouseChange = sequelize.define('WarehouseChange', {
    ID_change: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      allowNull: true,
    },
    ActionType: {
      type: DataTypes.ENUM(
        'Dodan novi materijal', //ovo trebam ispraviti + sve u ispisu ispraviti
        'Uređen materijal',
        'Obrisan materijal',
        'Kreirana ponuda',
        'Uređena ponuda',
        'Obrisana ponuda',
        'Kreiran račun iz ponude',
        'Kreiran račun',
        'Uređen račun',
        'Obrisan račun',
        'Dodan novi dobavljač',
        'Uređivanje dobavljača',
        'Brisanje dobavljača',
        'Dodan klijent',
        'Uređivanje klijenta',
        'Brisanje klijenta'
      ),
      allowNull: false,
    },
    ObjectType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ObjectID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    EntityName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'WarehouseChange',
    timestamps: true,
    createdAt: 'ChangeDate',
    updatedAt: false,
  });

  WarehouseChange.associate = (models) => {
    WarehouseChange.belongsTo(models.User, {
      foreignKey: 'ID_user',
      as: 'User',
    });
  };

  return WarehouseChange;
};
