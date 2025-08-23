const db = require('../models');
const dayjs = require('dayjs');


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
const getOneChange = async (req, res) => {

  let ID_change = req.params.ID_change
  let change = await WarehouseChange.findOne({ where: { ID_change: ID_change } })
  res.status(200).send(change)
}

//4. update user over id
const updateChange = async (req, res) => {
  let ID_change = req.params.ID_change
  const change = await WarehouseChange.update(req.body, { where: { ID_change: ID_change } })
  res.status(200).send(change)
}

//5. delete user by id
const deleteChange = async (req, res) => {

  let ID_change = req.params.ID_change
  await WarehouseChange.destroy({ where: { ID_change: ID_change } })
  res.send('Obrisano!')
}

/**
 * Zabilježi promjenu / akciju u sustavu
 * 
 * @param {Object} params
 * @param {number} params.userId - ID korisnika koji je napravio akciju
 * @param {string} params.actionType - tip akcije (npr. 'kreirana_ponuda', 'dodano', 'uklonjeno')
 * @param {string} params.objectType - tip entiteta na koji se akcija odnosi ('Ponuda', 'Racun', 'Materijal', 'Klijent', ...)
 * @param {number} [params.objectId] - ID entiteta na koji se akcija odnosi
 * @param {number} [params.materialId] - ID materijala ako se radi o promjeni skladišta
 * @param {number} [params.amount] - količina ako je vezano za materijal
 * @param {string} [params.note] - bilješke
 */
// controllers/warehouseChangeController.js
const logChange = async ({
  userId,
  actionType,
  objectType,
  objectId,
  materialName,
  clientType,
  clientName,
  clientContactName,
  supplierName,
  receiptNumber,
  amount,
  note
}) => {
  try {
    // Odredi prikazni naziv entiteta
    let entityName = '-';
    if (objectType === 'Materijal') entityName = materialName || '-';
    else if (objectType === 'Klijent') {
      entityName = clientType === 'Tvrtka' ? clientName || '-' : clientContactName || '-';
    }
    else if (objectType === 'Dobavljac') entityName = supplierName || '-';
    else if (objectType === 'Ponuda') entityName = `Ponuda #${objectId}`;
    else if (objectType === 'Racun') entityName = receiptNumber || '-';  // <-- samo broj računa

    await WarehouseChange.create({
      ID_user: userId,
      ActionType: actionType,
      ObjectType: objectType,
      ObjectID: objectId,
      Amount: amount,
      Note: note,
      EntityName: entityName,
    });

  } catch (error) {
    console.error('Greška kod logiranja promjene:', error);
  }
};


const getAllChanges = async (req, res) => {
  try {
    const changes = await WarehouseChange.findAll({
      attributes: [
        'ID_change',
        'ActionType',
        'ObjectType',
        'ObjectID',
        'Amount',
        'Note',
        'EntityName',
        'ChangeDate'
      ],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['Name']
        }
      ],
      order: [['ChangeDate', 'DESC']]
    });

    const formattedChanges = changes.map(change => {
      const data = change.toJSON();
      data.ChangeDate = new Date(data.ChangeDate).toISOString();
      return data;
    });

    res.status(200).json(formattedChanges);
  } catch (error) {
    console.error('Greška kod dohvaćanja promjena:', error);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

const getActivityLogs = async (req, res) => {
  try {
    const logs = await WarehouseChange.findAll({
      include: [
        {
          model: User,
          as: 'User', // ovo mora biti točno kao u associate
          attributes: ['ID_user', 'Name'] // ovdje stavi stvarno ime kolone u bazi
        }
      ],
      order: [['ChangeDate', 'DESC']],
      limit: 5
    });
    res.json(logs);
  } catch (err) {
    console.error("Greška kod dohvaćanja activity logova:", err);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};


module.exports = {
  addChange,
  getAllChange,
  getOneChange,
  updateChange,
  deleteChange,
  logChange,
  getAllChanges,
  getActivityLogs
}