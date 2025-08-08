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
const addChange = async (req, res) => {

    let info = {
        ID_change: req.body.ID_change,
        ID_material: req.body.ID_material,
        ID_user: req.body.ID_user,
        ChangeDate: req.body.ChangeDate,
        Amount: req.body.Amount,
        TypeChange: req.body.TypeChange,
        Note: req.body.Note,
    }

    const change = await WarehouseChange.create(info)
    res.status(200).send(change)
    console.log(change)
}

// 2. Gets all users from table
const getAllChange = async (req, res) => {
    let change = await WarehouseChange.findAll({})
    res.send(change)
}

//3. Get one user over id
const getOneChange= async (req, res) => {

    let ID_change = req.params.ID_change
    let change = await WarehouseChange.findOne({ where: { ID_change: ID_change}})
    res.status(200).send(change)
}

//4. update user over id
const updateChange = async (req, res) => {
    let ID_change = req.params.ID_change
    const change = await WarehouseChange.update(req.body, {where: { ID_change: ID_change }})
    res.status(200).send(change)
}

//5. delete user by id
const deleteChange = async (req, res) => {

    let ID_change = req.params.ID_change
    await WarehouseChange.destroy({where: { ID_change: ID_change }})
    res.send('Obrisano!')
}

module.exports = {
    addChange,
    getAllChange,
    getOneChange,
    updateChange,
    deleteChange
}