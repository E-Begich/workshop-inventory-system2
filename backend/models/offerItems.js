module.exports = (sequelize, DataTypes) => {

  
  const OfferItems = sequelize.define('OfferItems', {
    ID_offerItem: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_offer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Offers',
        key: 'ID_offer',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    TypeItem: {
      type: DataTypes.ENUM('Materijal', 'Usluga'),
      allowNull: false,
    },
    ID_material: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Materials',
        key: 'ID_material',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    ID_service: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Services',
        key: 'ID_service',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    Amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    PriceNoTax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    Tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    PriceTax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: false,
  });

  OfferItems.associate = (models) => {
  OfferItems.belongsTo(models.Offer, {
    foreignKey: 'ID_offer',
    as: 'Offer'
  });

  OfferItems.belongsTo(models.Materials, {
    foreignKey: 'ID_material',
    as: 'Material'
  });

  OfferItems.belongsTo(models.Service, {
    foreignKey: 'ID_service',
    as: 'Service'
  });
};

  return OfferItems;
};
