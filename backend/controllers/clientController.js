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
const addClient = async (req, res) => {

    let info = {
        ID_client: req.body.ID_client,
        TypeClient: req.body.TypeClient,
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

    const client = await Client.create(info)
    res.status(200).send(client)
    console.log(client)
}

// 2. Gets all users from table
const getAllClients = async (req, res) => {
    let client = await Client.findAll({})
    res.send(client)
}

//3. Get one user over id
const getOneClient = async (req, res) => {

    let ID_client = req.params.ID_client
    let client = await Client.findOne({ where: { ID_client: ID_client } })
    res.status(200).send(client)
}

//4. update user over id
const updateClient = async (req, res) => {
    let ID_client = req.params.ID_client
    const client = await Client.update(req.body, { where: { ID_client: ID_client } })
    res.status(200).send(client)
}

//5. delete user by id
const deleteClient = async (req, res) => {

    let ID_client = req.params.ID_client
    await Client.destroy({ where: { ID_client: ID_client } })
    res.send('Profil klijenta je obrisan!')
}

// 6. Get enum values for Role
const getTypeClientEnum = (req, res) => {
    const clientEnum = Client.rawAttributes.TypeClient.values;
    res.status(200).json(clientEnum);
};

module.exports = {
    addClient,
    getAllClients,
    getOneClient,
    updateClient,
    deleteClient,
    getTypeClientEnum
}