const db = require('../models');
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
const addSupplier = async (req, res) => {
  try {
    const info = {
      Type: req.body.Type,
      Name: req.body.Name,
      PersonalNumber: req.body.PersonalNumber,
      ContactName: req.body.ContactName,
      Contact: req.body.Contact,
      Email: req.body.Email,
      Address: req.body.Address,
      City: req.body.City,
      PostalCode: req.body.PostalCode,
      Country: req.body.Country,
    };

    const supplier = await Supplier.create(info);

    // Logiranje kreiranja dobavljača
    await logChange({
      userId: req.user.ID_user,
      actionType: 'dodano',
      objectType: 'Dobavljac',
      objectId: supplier.ID_supplier,
      supplierName: supplier.Name || supplier.ContactName, // prikazni naziv
      note: `Dobavljač "${supplier.Name || supplier.ContactName}" je dodan`
    });

    res.status(200).json(supplier);
  } catch (error) {
    console.error('Greška pri dodavanju dobavljača:', error);
    res.status(500).json({ error: error.message });
  }
};

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
  try {
    const ID_supplier = req.params.ID_supplier;

    // Dohvati trenutnog dobavljača prije updatea (za logiranje promjene)
    const supplierBefore = await db.Supplier.findByPk(ID_supplier);

    if (!supplierBefore) {
      return res.status(404).json({ error: 'Dobavljač nije pronađen' });
    }

    // Update
    await db.Supplier.update(req.body, { where: { ID_supplier } });

    // Dohvati ažuriranog dobavljača
    const updatedSupplier = await db.Supplier.findByPk(ID_supplier);

    // Logiranje promjene
    await logChange({
      userId: req.user.ID_user,
      actionType: 'uređivanje_dobavljača',
      objectType: 'Dobavljac',
      objectId: ID_supplier,
      supplierName: updatedSupplier.Name || updatedSupplier.ContactName,
      note: `Dobavljač "${updatedSupplier.Name || updatedSupplier.ContactName}" je ažuriran`
    });

    res.status(200).json(updatedSupplier);

  } catch (error) {
    console.error('Greška pri ažuriranju dobavljača:', error);
    res.status(500).json({ error: error.message });
  }
};

//5. delete user by id
const deleteSupplier = async (req, res) => {
  try {
    const ID_supplier = req.params.ID_supplier;

    // Dohvati dobavljača prije brisanja za logiranje
    const supplier = await db.Supplier.findByPk(ID_supplier);

    if (!supplier) {
      return res.status(404).json({ error: 'Dobavljač nije pronađen' });
    }

    // Obriši dobavljača
    await db.Supplier.destroy({ where: { ID_supplier } });

    // Logiranje brisanja
    await logChange({
      userId: req.user.ID_user,
      actionType: 'brisanje_dobavljaca',
      objectType: 'Dobavljac',
      objectId: ID_supplier,
      supplierName: supplier.Name || supplier.ContactName,
      note: `Dobavljač "${supplier.Name || supplier.ContactName}" je obrisan`
    });

    res.status(200).send('Dobavljač je obrisan!');

  } catch (error) {
    console.error('Greška pri brisanju dobavljača:', error);
    res.status(500).json({ error: error.message });
  }
};


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