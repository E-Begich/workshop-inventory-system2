const db = require('../models')

//creating main models
const User = db.User
const Client = db.Client
const Service = db.Service
const Supplier = db.Supplier
const Materials = db.Materials
const Receipt = db.Receipt
const ReceiptItems = db.ReceiptItems
const Offer = db.Offer
const OfferItems = db.OfferItems
const WarehouseChange = db.WarehouseChange

//1. create user 
const addSupplier = async (req, res) => {

    let info = {
        ID_supplier: req.body.ID_supplier,
        Type: req.body.Type,
        Name: req.body.Name,
        PersonalNumber: req.body.PersonalNumber,
        ContactName: req.body.ContactName,
        Contact: req.body.Contact,
        Email: req.body.Email,
        Address: req.body.Address,
        City: req.body.City,
        PostalCode: req.body.PostalCode,
        Country: req.body.Country

    }

    const supplier = await Supplier.create(info)
    res.status(200).send(supplier)
    console.log(supplier)
}

// 2. Gets all supplier from table
const getAllSupplier = async (req, res) => {
    let supplier = await db.Supplier.findAll({})
    res.send(supplier)
}

//3. Get one user over id
const getOneSupplier = async (req, res) => {

    let ID_supplier = req.params.ID_supplier
    let supplier = await db.Supplier.findOne({ where: { ID_supplier: ID_supplier}})
    res.status(200).send(supplier)
}

//4. update user over id
const updateSupplier = async (req, res) => {
    let ID_supplier = req.params.ID_supplier
    const supplier = await db.Supplier.update(req.body, {where: { ID_supplier: ID_supplier }})
    res.status(200).send(supplier)
}

//5. delete user by id
const deleteSupplier = async (req, res) => {

    let ID_supplier = req.params.ID_supplier
    await Supplier.destroy({where: { ID_supplier: ID_supplier }})
    res.send('Dobavljač je obrisan!')
}

// 6. Get enum values for Type
const getTypeEnum = (req, res) => {
  const typeEnum = Supplier.rawAttributes.Type.values;
  res.status(200).json(typeEnum);
};

module.exports = {
    addSupplier,
    getAllSupplier,
    getOneSupplier,
    updateSupplier,
    deleteSupplier,
    getTypeEnum
}