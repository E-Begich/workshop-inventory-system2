const db = require('../models')
const { logChange } = require('./warehouseChangeController');

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
    try {
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
        // Logiranje kreiranja klijenta
        await logChange({
            userId: req.user.ID_user,
            actionType: 'dodavanje_klijenta',
            objectType: 'Klijent',
            objectId: client.ID_client,
            clientType: client.TypeClient,
            clientName: client.Name,
            clientContactName: client.ContactName,
            note: `Dodani klijent: ${client.TypeClient === 'Tvrtka' ? client.Name : client.ContactName}.`
        });

        res.status(200).send(client)
        console.log(client)
    } catch (error) {
        console.error('Greška pri dodavanju materijala:', error);
        res.status(500).send({ error: error.message });
    }
};

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
// UPDATE
const updateClient = async (req, res) => {
    const ID_client = req.params.ID_client;

    try {
        const client = await Client.findByPk(ID_client);
        if (!client) {
            return res.status(404).json({ message: 'Klijent nije pronađen.' });
        }

        await client.update(req.body);

        // logiraj promjenu
        await logChange({
            userId: req.user.ID_user,
            actionType: 'uređivanje_klijenta',
            objectType: 'Klijent',
            objectId: client.ID_client,
            clientType: client.TypeClient,
            clientName: client.Name,
            clientContactName: client.ContactName,
            note: `Ažurirani podaci klijenta: ${client.TypeClient === 'Tvrtka' ? client.Name : client.ContactName}.`
        });

        res.status(200).json(client);
    } catch (error) {
        console.error('Greška kod ažuriranja klijenta:', error);
        res.status(500).json({ message: 'Greška na serveru.' });
    }
};

//5. delete user by id
// DELETE
const deleteClient = async (req, res) => {
    const ID_client = req.params.ID_client;

    try {
        const client = await Client.findByPk(ID_client);
        if (!client) {
            return res.status(404).json({ message: 'Klijent nije pronađen.' });
        }

        // logiraj brisanje prije nego što ga obrišeš
        await logChange({
            userId: req.user.ID_user,
            actionType: 'brisanje_klijenta',
            objectType: 'Klijent',
            objectId: client.ID_client,
            clientType: client.TypeClient,
            clientName: client.Name,
            clientContactName: client.ContactName,
            note: `Klijent "${client.TypeClient === 'Tvrtka' ? client.Name : client.ContactName}" je obrisan.`
        });

        await client.destroy();

        res.status(200).json({ message: 'Klijent je obrisan!' });
    } catch (error) {
        console.error('Greška kod brisanja klijenta:', error);
        res.status(500).json({ message: 'Greška na serveru.' });
    }
};

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