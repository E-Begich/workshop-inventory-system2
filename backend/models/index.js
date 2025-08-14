const dbConfig = require('../config/dbConfig.js');
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: 0,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle

        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('Connected...')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

//ovdje idu nazivi tablica kako se tocno nazivaju u bazi i nazivi fajlova vezano za svaku tablicu posebno. Ti fajlovi nalaze se ovdje u mapi models
db.User = require('./userModel.js')(sequelize, DataTypes)
db.Client = require('./clientModel.js')(sequelize, DataTypes)
db.Service = require('./serviceModel.js')(sequelize, DataTypes)
db.Supplier = require('./supplierModel.js')(sequelize, DataTypes)
db.Materials = require('./materialsModel.js')(sequelize, DataTypes)
db.Receipt = require('./receiptModel.js')(sequelize, DataTypes)
db.ReceiptItems = require('./receiptItemsModel.js')(sequelize, DataTypes)
db.Offer = require('./offerModel.js')(sequelize, DataTypes)
db.OfferItems = require('./offerItemsModel.js')(sequelize, DataTypes)
db.WarehouseChange = require('./warehouseChangeModel.js')(sequelize, DataTypes)

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})



//dio koji je jako bitan za bazu i omogućuje da se bitne informacije iz baze ne izgube
db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})

module.exports = db