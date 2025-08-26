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

//1. KREIRANJE STAVKI ZA RAČUN - CREATE RECEIPTITEMS
const addReceiptItems = async (req, res) => {
  try {
    console.log("Primljene stavke:", req.body);

    const cleanedItems = req.body.map(item => ({
      ...item,
      ID_material: item.ID_material || null,
      ID_service: item.ID_service || null,
    }));

    const receiptItems = await ReceiptItems.bulkCreate(cleanedItems);
    res.status(200).send(receiptItems);
    console.log("Spremeljene stavke:", receiptItems);
  } catch (error) {
    console.error("Greška pri dodavanju stavki:", error);
    res.status(500).send({ error: "Došlo je do greške pri spremanju stavki." });
  }
};

// 2. PREUZMI SVE OFFERITEMS IZ TABLICE - GET ALL OFFERITEMS FROM TABLE
const getAllReceiptItems = async (req, res) => {
  let receiptItems = await db.ReceiptItems.findAll({})
  res.send(receiptItems)
}

//3. UZIMANJE JEDNOG OFFERITEMS IZ TABLICE - GET ONE OFFERITEMS FROM TABLE
const getOneReceiptItem = async (req, res) => {

  let ID_recItems = req.params.ID_recItems
  let receiptItems = await db.ReceiptItems.findOne({ where: { ID_recItems: ID_recItems } })
  res.status(200).send(receiptItems)
}

//4. AŽURIRANJE JEDNOG OFFERITEMS IZ TABLICE - UPDATE ONE OFFERITEMS FROM TABLE (OVO TREBA U SLUČAJU AŽURIRANJA PRILIKOM IZRADE RAČUNA)
const updateReceiptItem = async (req, res) => {
  let ID_recItems = req.params.ID_recItems
  const receiptItems = await db.ReceiptItems.update(req.body, { where: { ID_recItems: ID_recItems } })
  res.status(200).send(receiptItems)
}

//5. BRISANJE STAVKE U RAČUNU - PRILIKOM IZRADE RAČUNA - DELETE ITEM FROM RECEIPT - JUST WHEN NEED TO DELETE BEFORE CREATE RECEIPT
const deleteReceiptItem = async (req, res) => {

  let ID_recItems = req.params.ID_recItems
  await ReceiptItems.destroy({ where: { ID_recItems: ID_recItems } })
  res.send('Stavka je obrisana!')
}

// 8. UZIMANJE ENUM VRIJEDNOSTI ZA TIP STAVKE (MATERIJAL, USLUGA) - GETS ENUM VALUE FOR TYPEITEM
const getRecTypeItemEnum = (req, res) => {
  const typeEnums = OfferItems.rawAttributes.TypeItem.values;
  res.status(200).json(typeEnums);
};

module.exports = {
  addReceiptItems,
  getAllReceiptItems,
  getOneReceiptItem,
  updateReceiptItem,
  deleteReceiptItem,
  getRecTypeItemEnum
}