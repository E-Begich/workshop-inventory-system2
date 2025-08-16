module.exports = (sequelize, DataTypes) => {

  const WarehouseChange = sequelize.define('WarehouseChange', {
    ID_change: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_material: {
      type: DataTypes.INTEGER,
      allowNull: true, // sada može biti null ako se logira npr. kreiranje ponude
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
      allowNull: true, // može biti null za aktivnosti koje nisu skladišne promjene
    },
    ActionType: {
      type: DataTypes.ENUM(
        'dodano',
        'uklonjeno',
        'inventura',
        'ispravak',
        'kreirana_ponuda',
        'kreiran_racun',
        'dodano_na_skladiste',
        'uklonjeno_sa_skladista'
      ),
      allowNull: false,
    },
    Note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ObjectType: {   // tip entiteta: Materijal, Ponuda, Racun, Klijent itd.
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Materijal',
    },
    ObjectID: {     // ID entiteta na koji se akcija odnosi
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'WarehouseChange',
    timestamps: true,
    createdAt: 'ChangeDate', // koristi postojeće polje kao createdAt
    updatedAt: false,
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
