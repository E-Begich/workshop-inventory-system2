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
const addService = async (req, res) => {
    try {
        let info = {
            ID_service: req.body.ID_service,
            Name: req.body.Name,
            Description: req.body.Description,
            PriceNoTax: req.body.PriceNoTax,
            Tax: req.body.Tax === '' || req.body.Tax == null ? 25 : parseFloat(req.body.Tax),
            PriceTax: req.body.PriceTax
        };

        const service = await Service.create(info);
        res.status(200).send(service);
        console.log('Dodana usluga:', service);
    } catch (error) {
        console.error('Greška prilikom dodavanja servisa:', error);
        res.status(500).send({ error: 'Neuspješno dodavanje usluge' });
    }
};

// 2. Gets all users from table
const getAllService = async (req, res) => {
    let service = await Service.findAll({})
    res.send(service)
}

//3. Get one user over id
const getOneService= async (req, res) => {

    let ID_service = req.params.ID_service
    let service = await Service.findOne({ where: { ID_service: ID_service}})
    res.status(200).send(service)
}

//4. update user over id
const updateService = async (req, res) => {
    let ID_service = req.params.ID_service
    const service = await Service.update(req.body, {where: { ID_service: ID_service }})
    res.status(200).send(service)
}

//5. delete user by id
const deleteService = async (req, res) => {

    let ID_service = req.params.ID_service
    await Service.destroy({where: { ID_service: ID_service }})
    res.send('Usluga je obrisana!')
}

module.exports = {
    addService,
    getAllService,
    getOneService,
    updateService,
    deleteService
}