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

//1. KREIRANJE DOBAVLJAČA - CREATE SUPPLIER
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

    // PODACI ZA SPREMANJE U WAREHOUSECHANGE - INFORMATION FOR WAREHOUSECHANGE
    await logChange({
      userId: req.user.ID_user,
      actionType: 'Dodan novi dobavljač',
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

// 2. PREUZIMANJE SVIH DOBAVLJAČA IZ TABLICE - GET ALL SUPPLIERS FROM TABLE
const getAllSupplier = async (req, res) => {
  let supplier = await db.Supplier.findAll({})
  res.send(supplier)
}

//3. PREUZIMANJE JEDNOG DOBAVLJAČA PREKO ID - GETS ONE SUPPLIER OVER ID
const getOneSupplier = async (req, res) => {

  let ID_supplier = req.params.ID_supplier
  let supplier = await db.Supplier.findOne({ where: { ID_supplier: ID_supplier } })
  res.status(200).send(supplier)
}

//4. AŽURIRANJE DOBAVLJAČA PREKO ID - UPDATE SUPPLIER OVER ID
const updateSupplier = async (req, res) => {
  try {
    const ID_supplier = req.params.ID_supplier;

    //4.1.  Dohvati trenutnog dobavljača prije updatea (za logiranje promjene)
    const supplierBefore = await db.Supplier.findByPk(ID_supplier);

    if (!supplierBefore) {
      return res.status(404).json({ error: 'Dobavljač nije pronađen' });
    }

    // 4.2. Update
    await db.Supplier.update(req.body, { where: { ID_supplier } });

    // 4.3. Dohvati ažuriranog dobavljača
    const updatedSupplier = await db.Supplier.findByPk(ID_supplier);

    // PODACI ZA SPREMANJE U WAREHOUSECHANGE - INFORMATION FOR WAREHOUSECHANGE
    await logChange({
      userId: req.user.ID_user,
      actionType: 'Uređivanje dobavljača',
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

//5. BRISANJE DOBAVLJAČA PUTEM ID - DELETE SUPPLIER OVER ID
const deleteSupplier = async (req, res) => {
  try {
    const ID_supplier = req.params.ID_supplier;

    //5.1. Dohvati dobavljača prije brisanja za logiranje
    const supplier = await db.Supplier.findByPk(ID_supplier);

    if (!supplier) {
      return res.status(404).json({ error: 'Dobavljač nije pronađen' });
    }

    //5.2. Obriši dobavljača
    await db.Supplier.destroy({ where: { ID_supplier } });

    // PODACI ZA SPREMANJE U WAREHOUSECHANGE - INFORMATION FOR WAREHOUSECHANGE
    await logChange({
      userId: req.user.ID_user,
      actionType: 'Brisanje dobavljača',
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


// 6. PREUZIMANJE ENUM VRIJEDNOSTI ZA TIP DOBAVLJAČA (FIZIČKA OSOBA ILI TVRTKA) - GETS ENUM VALUES FOR TYPE SUPPLIER
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