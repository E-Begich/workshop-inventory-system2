module.exports = (sequelize, DataTypes) => {


  const ReceiptItems = sequelize.define('ReceiptItems', {
    ID_recItems: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_receipt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Receipts',
        key: 'ID_receipt',
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
    },
    ID_service: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Services',
        key: 'ID_service',
      },
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
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    PriceTax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: false,
  });

  ReceiptItems.associate = (models) => {
  ReceiptItems.belongsTo(models.Receipt, {
    foreignKey: 'ID_receipt',
    as: 'Receipt'
  });

  ReceiptItems.belongsTo(models.Materials, {
    foreignKey: 'ID_material',
    as: 'Material'
  });

  ReceiptItems.belongsTo(models.Service, {
    foreignKey: 'ID_service',
    as: 'Service'
  });
};

  return ReceiptItems;
};

