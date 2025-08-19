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
const addMaterial = async (req, res) => {
  try {
    // Pripremamo podatke za kreiranje materijala
    const info = {
      NameMaterial: req.body.NameMaterial,
      CodeMaterial: req.body.CodeMaterial,
      Amount: req.body.Amount,
      Unit: req.body.Unit,
      Location: req.body.Location,
      Description: req.body.Description,
      MinAmount: req.body.MinAmount,
      PurchasePrice: req.body.PurchasePrice,
      SellingPrice: req.body.SellingPrice,
      ID_supplier: req.body.ID_supplier,
      TypeChange: req.body.TypeChange, // OBAVEZNO
    };

    // Kreiramo materijal u bazi
    const material = await Materials.create(info);

    // Logiranje kreiranja materijala
    await logChange({
      userId: req.user.ID_user,
      actionType: 'dodano',            // tip akcije
      objectType: 'Materijal',
      objectId: material.ID_material,
      materialName: material.NameMaterial,  // OBAVEZNO za ispis EntityName
      amount: material.Amount,
      note: `Materijal "${material.NameMaterial}" je dodan`
    });

    // Odgovor klijentu
    res.status(200).json(material);

  } catch (error) {
    console.error('Greška pri dodavanju materijala:', error);
    res.status(500).json({ error: error.message });
  }
};



// 2. Gets all users from table
const getAllMaterial = async (req, res) => {
  let material = await Materials.findAll({})
  res.send(material)
}

//3. Get one user over id
const getOneMaterial = async (req, res) => {

  let ID_material = req.params.ID_material
  let material = await Materials.findOne({ where: { ID_material: ID_material } })
  res.status(200).send(material)
}

//4. update user over id
const updateMaterial = async (req, res) => {
  const ID_material = req.params.ID_material;

  try {
    // Dohvati instancu materijala
    const material = await Materials.findByPk(ID_material);

    if (!material) {
      return res.status(404).json({ message: 'Materijal nije pronađen.' });
    }

    // Ažuriraj podatke
    await material.update(req.body);

    // Logiranje promjene
    await logChange({
      userId: req.user.ID_user,
      actionType: 'ispravak',            // tip akcije
      objectType: 'Materijal',
      objectId: material.ID_material,
      materialName: material.NameMaterial,  // OBAVEZNO za ispis EntityName
      amount: material.Amount,
      note: `Materijal "${material.NameMaterial}" je uređen.`
    });

    res.status(200).json(material);
  } catch (error) {
    console.error('Greška kod ažuriranja materijala:', error);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

//5. delete material by id
//const deleteMaterial = async (req, res) => {
//  let ID_material = req.params.ID_material
//  await Materials.destroy({ where: { ID_material: ID_material } })
//  res.send('Materijal je obrisan!')
//}

const deleteMaterial = async (req, res) => {
  const ID_material = req.params.ID_material;

  try {
    // Prvo provjerimo postoji li materijal
    const material = await Materials.findByPk(ID_material);
    if (!material) {
      return res.status(404).json({ message: 'Materijal nije pronađen.' });
    }

    // Logiranje brisanja
    await logChange({
      userId: req.user.ID_user,
      actionType: 'uklonjeno_sa_skladista',            // tip akcije
      objectType: 'Materijal',
      objectId: material.ID_material,
      materialName: material.NameMaterial,  // OBAVEZNO za ispis EntityName
      amount: -material.Amount,
      note: `Materijal "${material.NameMaterial}" je obrisan`
    });

    // Brisanje materijala
    await material.destroy();

    res.status(200).json({ message: 'Materijal je obrisan!' });
  } catch (error) {
    console.error('Greška kod brisanja materijala:', error);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

// 6. Get enum values for Location
const getLocationEnum = (req, res) => {
  const locationEnums = Materials.rawAttributes.Location.values;
  res.status(200).json(locationEnums);
};

// 7. Get enum values for Unit
const getUnitEnum = (req, res) => {
  const unitEnums = Materials.rawAttributes.Unit.values;
  res.status(200).json(unitEnums);
};

// 8. Get enum values for TypeChange
const getTypeChangeEnum = (req, res) => {
  const typeEnums = Materials.rawAttributes.TypeChange.values;
  res.status(200).json(typeEnums);
};

// 9. Ažuriraj količinu materijala (smanji na osnovu računa)
// PUT /api/aplication/updateMaterialAmount/:ID_material
const updateMaterialAmount = async (req, res) => {
  const ID_material = req.params.ID_material;
  const { Amount: usedAmount } = req.body;

  try {
    const material = await Materials.findOne({ where: { ID_material } });

    if (!material) {
      return res.status(404).json({ message: 'Materijal nije pronađen.' });
    }

    const newAmount = material.Amount - usedAmount;

    if (newAmount < 0) {
      return res.status(400).json({ message: 'Nema dovoljno materijala na skladištu.' });
    }

    await Materials.update(
      { Amount: newAmount },
      { where: { ID_material } }
    );

    const warning = newAmount <= material.MinAmount;

    res.status(200).json({
      message: warning ? 'Materijal je pao ispod minimalne količine!' : 'Količina ažurirana.',
      warning,
    });
  } catch (error) {
    console.error('Greška kod ažuriranja materijala:', error);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};



// 10. Provjeri ima li dovoljno materijala
const checkMaterialStock = async (req, res) => {
  const { ID_material, requestedAmount } = req.body;

  try {
    const material = await Materials.findByPk(ID_material);
    if (!material) {
      return res.status(404).json({ message: 'Materijal nije pronađen.' });
    }

    const newAmount = material.Amount - requestedAmount;

    if (newAmount < 0) {
      return res.status(400).json({
        sufficient: false,
        message: `Nema dovoljno materijala: ${material.NameMaterial}. Dostupno: ${material.Amount}, potrebno: ${requestedAmount}.`,
      });
    }

    if (newAmount < material.MinAmount) {
      return res.status(200).json({
        sufficient: true,
        warning: true,
        message: `Upozorenje: Materijal ${material.NameMaterial} past će ispod minimalne količine (${material.MinAmount}).`,
      });
    }

    return res.status(200).json({ sufficient: true });
  } catch (error) {
    console.error('Greška kod provjere skladišta:', error);
    res.status(500).json({ message: 'Greška kod provjere skladišta.' });
  }
};




module.exports = {
  addMaterial,
  getAllMaterial,
  getOneMaterial,
  updateMaterial,
  deleteMaterial,
  getLocationEnum,
  getUnitEnum,
  getTypeChangeEnum,
  updateMaterialAmount,
  checkMaterialStock
}