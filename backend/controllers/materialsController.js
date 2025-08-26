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

//1. KREIRANJE MATERIJALA - CREATE MATERIAL 
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
      TypeChange: req.body.TypeChange,
    };

    const material = await Materials.create(info);

    // PODACI ZA SPREMANJE U WAREHOUSECHANGE - INFORMATION FOR WAREHOUSECHANGE
    await logChange({
      userId: req.user.ID_user,
      actionType: 'Dodan novi materijal',
      objectType: 'Materijal',
      objectId: material.ID_material,
      materialName: material.NameMaterial,
      amount: material.Amount,
      note: `Materijal "${material.NameMaterial}" je dodan`
    });

    res.status(200).json(material);

  } catch (error) {
    console.error('Greška pri dodavanju materijala:', error);
    res.status(500).json({ error: error.message });
  }
};

// 2. UZIMA SVE MATERIJALE IZ BAZE - GETS ALL MATERIALS FROM BASE
const getAllMaterial = async (req, res) => {
  let material = await Materials.findAll({})
  res.send(material)
}

//3. UZIMA JEDAN MATERIJAL IZ BAZE PO ID - GET ONE MATERIAL OVER ID
const getOneMaterial = async (req, res) => {

  let ID_material = req.params.ID_material
  let material = await Materials.findOne({ where: { ID_material: ID_material } })
  res.status(200).send(material)
}

//4. AŽURIRA PODATKE MATERIJALA PO ID - UPDATE MATERIAL OVER ID
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

    // PODACI ZA SPREMANJE U WAREHOUSECHANGE - INFORMATION FOR WAREHOUSECHANGE
    await logChange({
      userId: req.user.ID_user,
      actionType: 'Uređen materijal',
      objectType: 'Materijal',
      objectId: material.ID_material,
      materialName: material.NameMaterial,
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
//5. BRISANJE MATERIJALA PREMA ID - DELETE MATERIAL OVER ID
const deleteMaterial = async (req, res) => {
  const ID_material = req.params.ID_material;

  try {
    // Prvo provjerimo postoji li materijal - CHECK IF MATERIAL EXIST
    const material = await Materials.findByPk(ID_material);
    if (!material) {
      return res.status(404).json({ message: 'Materijal nije pronađen.' });
    }

    // PODACI ZA SPREMANJE U WAREHOUSECHANGE - INFORMATION FOR WAREHOUSECHANGE
    await logChange({
      userId: req.user.ID_user,
      actionType: 'Obrisan materijal',           
      objectType: 'Materijal',
      objectId: material.ID_material,
      materialName: material.NameMaterial, 
      amount: -material.Amount,
      note: `Materijal "${material.NameMaterial}" je obrisan`
    });
    // BRISANJE MATERIJALA - DELETE MATERIAL
    await material.destroy();

    res.status(200).json({ message: 'Materijal je obrisan!' });
  } catch (error) {
    console.error('Greška kod brisanja materijala:', error);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

// 6.  DOHVAT ENUM PODATAKA ZA LOKACIJU (SKLADIŠTE) - GET ENUM VALUES FOR LOCATION (STORAGE)
const getLocationEnum = (req, res) => {
  const locationEnums = Materials.rawAttributes.Location.values;
  res.status(200).json(locationEnums);
};

// 7.  DOHVAT ENUM PODATAKA ZA JEDINICU - GET ENUM VALUES FOR UNIT
const getUnitEnum = (req, res) => {
  const unitEnums = Materials.rawAttributes.Unit.values;
  res.status(200).json(unitEnums);
};

// 8.  DOHVAT ENUM PODATAKA ZA VRSTU PROMJENE (TypeChange) - GET ENUM VALUES FOR TypeChange
const getTypeChangeEnum = (req, res) => {
  const typeEnums = Materials.rawAttributes.TypeChange.values;
  res.status(200).json(typeEnums);
};

// 9.  AŽURIRAJ KOLIČINU MATERIJALA U SKLADIŠTU (PRI IZRADI RAČUNA) - UPDATE THE AMOUNT OF MATERIALS IN THE WAREHOUSE (WHEN CREATING RECEIPTS)
const updateMaterialAmount = async (req, res) => {
  const ID_material = req.params.ID_material;
  const { Amount: usedAmount } = req.body;

  try {
    const material = await Materials.findOne({ where: { ID_material } });

    if (!material) { //ako materijal ne postoji
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



// 10. PROVJERI IMA LI DOVOLJNO MATERIJALA - CHECK IF THERE IS ENOUGH MATERIAL
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