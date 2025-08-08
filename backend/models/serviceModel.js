module.exports = (sequelize, DataTypes) => {


  const Service = sequelize.define('Service', {
    ID_service: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    PriceNoTax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    Tax: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 25
    },
    PriceTax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: false,
  });

  Service.associate = (models) => {
    Service.hasMany(models.OfferItems, {
      foreignKey: 'ID_service',
      as: 'OfferItems'
    });

    Service.hasMany(models.ReceiptItems, {
      foreignKey: 'ID_service',
      as: 'ReceiptItems'
    });
  };

  return Service;
};
