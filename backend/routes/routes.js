//ovdje uvozimo kontrolere za svaku tablicu posebno - u kontrolerima su funkcije za svaku tablicu posebno
//za pregled, dodavanje, brisanje i uređivanje

const userController = require('../controllers/userController.js')
const clientController = require('../controllers/clientController.js')
const serviceController = require('../controllers/serviceController.js')
const offerController = require('../controllers/offerController.js')
const offerItemsController = require('../controllers/offerItemsController.js')
const warehouseChangeController = require('../controllers/warehouseChangeController.js')
const receiptController = require('../controllers/receiptController.js')
const receiptItemsController = require('../controllers/receiptItemsController.js')
const supplierController = require('../controllers/supplierController.js')
const materialsController = require('../controllers/materialsController.js')


const router = require('express').Router()


//Table User
router.post('/addUser', userController.addUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getOneUser/:ID_user', userController.getOneUser);
router.put('/updateUser/:ID_user', userController.updateUser);
router.delete('/deleteUser/:ID_user', userController.deleteUser);

router.get('/getRoleEnum', userController.getRoleEnum);
router.post('/login', userController.loginUser);

//table Client
router.post('/addClient', clientController.addClient);
router.get('/getAllClients', clientController.getAllClients);
router.get('/getOneClient/:ID_client', clientController.getOneClient);
router.put('/updateClient/:ID_client', clientController.updateClient);
router.delete('/deleteClient/:ID_client', clientController.deleteClient);

router.get('/getTypeClientEnum', clientController.getTypeClientEnum);

//Table Service
router.post('/addService', serviceController.addService);
router.get('/getAllService', serviceController.getAllService);
router.get('/getOneService/:ID_service', serviceController.getOneService);
router.put('/updateService/:ID_service', serviceController.updateService);
router.delete('/deleteService/:ID_service', serviceController.deleteService);

//Table Offer
router.post('/addOffer', offerController.addOffer);
router.get('/getAllOffer', offerController.getAllOffer);
router.get('/getOneOffer/:ID_offer', offerController.getOneOffer);
router.put('/updateOffer/:ID_offer', offerController.updateOffer);
router.delete('/deleteOffer/:ID_offer', offerController.deleteOffer);

router.get('/generateOfferPDF/:ID_offer', offerController.generateOfferPDF);
router.get('/getOfferWithDetails/:ID_offer', offerController.getOfferWithDetails);

// Table OfferItems
router.post('/addOfferItems', offerItemsController.addOfferItems);
router.get('/getAllOfferItems', offerItemsController.getAllOfferItems);
router.get('/getOneOfferItem/:ID_offerItems', offerItemsController.getOneOfferItem);
router.put('/updateOfferItem/:ID_offerItems', offerItemsController.updateOfferItem);
router.delete('/deleteOfferItem/:ID_offerItems', offerItemsController.deleteOfferItem);

router.get('/getTypeItemEnum', offerItemsController.getTypeItemEnum);


//Table WarehouseChange
router.post('/addChange', warehouseChangeController.addChange);
router.get('/getAllChange', warehouseChangeController.getAllChange);
router.get('/getOneChange/:ID_change', warehouseChangeController.getOneChange);
router.put('/updateChange/:ID_change', warehouseChangeController.updateChange);
router.delete('/deleteChange/:ID_change', warehouseChangeController.deleteChange);

//Table Receipt
router.post('/addReceipt', receiptController.addReceipt);
router.get('/getAllReceipt', receiptController.getAllReceipt);
router.get('/getOneReceipt/:ID_receipt', receiptController.getOneReceipt);
router.put('/updateReceipt/:ID_receipt', receiptController.updateReceipt);
router.delete('/deleteReceipt/:ID_receipt', receiptController.deleteReceipt);

router.post('/createReceiptFromOffer', receiptController.createReceiptFromOffer);
router.get('/getPaymentEnum', receiptController.getPaymentEnum);
router.get('/generateReceiptPDF/:ID_receipt', receiptController.generateReceiptPDF);
router.get('/getReceiptWithDetails/:ID_receipt', receiptController.getReceiptWithDetails);



//Table ReceiptItems
router.post('/addReceiptItem', receiptItemsController.addReceiptItems);
router.get('/getAllReceiptItem', receiptItemsController.getAllReceiptItems);
router.get('/getOneReceiptItem/:ID_recItems', receiptItemsController.getOneReceiptItem);
router.put('/updateReceiptItem/:ID_recItems', receiptItemsController.updateReceiptItem);
router.delete('/deleteReceiptItem/:ID_recItems', receiptItemsController.deleteReceiptItem);

router.get('/getRecTypeItemEnum', receiptItemsController.getRecTypeItemEnum);


//Table Supplier
router.post('/addSupplier', supplierController.addSupplier);
router.get('/getAllSupplier', supplierController.getAllSupplier);
router.get('/getOneSupplier/:ID_supplier', supplierController.getOneSupplier);
router.put('/updateSupplier/:ID_supplier', supplierController.updateSupplier);
router.delete('/deleteSupplier/:ID_supplier', supplierController.deleteSupplier);

router.get('/getTypeEnum', supplierController.getTypeEnum);

//Table Materials
router.post('/addMaterial', materialsController.addMaterial);
router.get('/getAllMaterial', materialsController.getAllMaterial);
router.get('/getOneMaterial/:ID_material', materialsController.getOneMaterial);
router.put('/updateMaterial/:ID_material', materialsController.updateMaterial);
router.delete('/deleteMaterial/:ID_material', materialsController.deleteMaterial);


router.get('/getLocationEnum', materialsController.getLocationEnum);
router.get('/getUnitEnum', materialsController.getUnitEnum);
router.get('/getTypeChangeEnum', materialsController.getTypeChangeEnum);
router.put('/updateMaterialAmount/:ID_material', materialsController.updateMaterialAmount);
router.post('/checkMaterialStock', materialsController.checkMaterialStock);




module.exports = router;