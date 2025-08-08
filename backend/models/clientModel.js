module.exports = (sequelize, DataTypes) => {


  const Client = sequelize.define('Client', {
    ID_client: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TypeClient: {
      type: DataTypes.ENUM('Fizička osoba', 'Tvrtka'),
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isValidName(value) {
          if (this.TypeClient === 'Tvrtka' && (!value || value.trim() === '')) {
            throw new Error('Naziv tvrtke mora biti unesen ako je klijent tipa "Tvrtka".');
          }
        }
      }
    },
    PersonalNumber: {
  type: DataTypes.STRING(20),
  allowNull: true, // općenito je opcionalan
  validate: {
    isValidPersonalNumber(value) {
      if (this.TypeClient === 'Tvrtka' && (!value || value.trim() === '')) {
        throw new Error('OIB mora biti unesen ako je klijent tipa "Tvrtka".');
      }
    }
  }
},
    ContactName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Contact: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    Address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    City: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    PostalCode: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Country: {
      type: DataTypes.STRING(200),
      allowNull: false,
    }

  }, {
    timestamps: false,
  });

  Client.associate = (models) => {
    Client.hasMany(models.Offer, {
      foreignKey: 'ID_client',
      as: 'Offers'
    })

    Client.hasMany(models.Receipt, {
      foreignKey: 'ID_client',
      as: 'Receipts'
    })

  }


  return Client;
};

