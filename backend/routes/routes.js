//ovdje uvozimo kontrolere za svaku tablicu posebno - u kontrolerima su funkcije za svaku tablicu posebno
//za pregled, dodavanje, brisanje i uređivanje

const userController = require('../controllers/userController.js');
const clientController = require('../controllers/clientController.js');
const serviceController = require('../controllers/serviceController.js');
const offerController = require('../controllers/offerController.js');
const offerItemsController = require('../controllers/offerItemsController.js')
const warehouseChangeController = require('../controllers/warehouseChangeController.js')
const receiptController = require('../controllers/receiptController.js')
const receiptItemsController = require('../controllers/receiptItemsController.js')
const supplierController = require('../controllers/supplierController.js')
const materialsController = require('../controllers/materialsController.js')
const authMiddleware = require('../middlewares/authMiddleware');



const router = require('express').Router()


//Table User
router.post('/addUser', authMiddleware, userController.addUser);
router.get('/getAllUsers', authMiddleware, userController.getAllUsers);
router.get('/getOneUser/:ID_user', authMiddleware, userController.getOneUser);
router.put('/updateUser/:ID_user', authMiddleware, userController.updateUser);
router.delete('/deleteUser/:ID_user', authMiddleware, userController.deleteUser);

router.get('/getRoleEnum', authMiddleware, userController.getRoleEnum);
router.post('/login', userController.loginUser);

//table Client
router.post('/addClient', authMiddleware, clientController.addClient);
router.get('/getAllClients', authMiddleware, clientController.getAllClients);
router.get('/getOneClient/:ID_client', authMiddleware, clientController.getOneClient);
router.put('/updateClient/:ID_client', authMiddleware, clientController.updateClient);
router.delete('/deleteClient/:ID_client', authMiddleware, clientController.deleteClient);

router.get('/getTypeClientEnum', authMiddleware, clientController.getTypeClientEnum);

//Table Service
router.post('/addService', authMiddleware, serviceController.addService);
router.get('/getAllService', authMiddleware, serviceController.getAllService);
router.get('/getOneService/:ID_service', authMiddleware, serviceController.getOneService);
router.put('/updateService/:ID_service', authMiddleware, serviceController.updateService);
router.delete('/deleteService/:ID_service', authMiddleware, serviceController.deleteService);

//Table Offer
router.post('/addOffer', authMiddleware, offerController.addOffer);
router.get('/getAllOffer', authMiddleware, offerController.getAllOffer);
router.get('/getOneOffer/:ID_offer', authMiddleware, offerController.getOneOffer);
router.put('/updateOffer/:ID_offer', authMiddleware, offerController.updateOffer);
router.delete('/deleteOffer/:ID_offer', authMiddleware, offerController.deleteOffer);

router.get('/generateOfferPDF/:ID_offer', authMiddleware,offerController.generateOfferPDF);
router.get('/getOfferWithDetails/:ID_offer', authMiddleware, offerController.getOfferWithDetails);

// Table OfferItems
router.post('/addOfferItems', authMiddleware, offerItemsController.addOfferItems);
router.get('/getAllOfferItems', authMiddleware, offerItemsController.getAllOfferItems);
router.get('/getOneOfferItem/:ID_offerItems', authMiddleware, offerItemsController.getOneOfferItem);
router.put('/updateOfferItem/:ID_offerItems', authMiddleware, offerItemsController.updateOfferItem);
router.delete('/deleteOfferItem/:ID_offerItems', authMiddleware, offerItemsController.deleteOfferItem);

router.get('/getTypeItemEnum', offerItemsController.getTypeItemEnum);


//Table WarehouseChange
router.post('/addChange', authMiddleware,warehouseChangeController.addChange);
router.get('/getAllChange', authMiddleware, warehouseChangeController.getAllChange);
router.get('/getOneChange/:ID_change', authMiddleware, warehouseChangeController.getOneChange);
router.put('/updateChange/:ID_change', authMiddleware, warehouseChangeController.updateChange);
router.delete('/deleteChange/:ID_change', authMiddleware, warehouseChangeController.deleteChange);

//Table Receipt
router.post('/addReceipt', authMiddleware, receiptController.addReceipt);
router.get('/getAllReceipt', authMiddleware, receiptController.getAllReceipt);
router.get('/getOneReceipt/:ID_receipt', authMiddleware, receiptController.getOneReceipt);
router.put('/updateReceipt/:ID_receipt', authMiddleware, receiptController.updateReceipt);
router.delete('/deleteReceipt/:ID_receipt', authMiddleware, receiptController.deleteReceipt);

router.post('/createReceiptFromOffer', authMiddleware, receiptController.createReceiptFromOffer);
router.get('/getPaymentEnum', authMiddleware, receiptController.getPaymentEnum);
router.get('/generateReceiptPDF/:ID_receipt', authMiddleware, receiptController.generateReceiptPDF);
router.get('/getReceiptWithDetails/:ID_receipt', authMiddleware, receiptController.getReceiptWithDetails);



//Table ReceiptItems
router.post('/addReceiptItem', authMiddleware, receiptItemsController.addReceiptItems);
router.get('/getAllReceiptItem', authMiddleware, receiptItemsController.getAllReceiptItems);
router.get('/getOneReceiptItem/:ID_recItems', authMiddleware, receiptItemsController.getOneReceiptItem);
router.put('/updateReceiptItem/:ID_recItems', authMiddleware, receiptItemsController.updateReceiptItem);
router.delete('/deleteReceiptItem/:ID_recItems', authMiddleware, receiptItemsController.deleteReceiptItem);

router.get('/getRecTypeItemEnum', authMiddleware, receiptItemsController.getRecTypeItemEnum);


//Table Supplier
router.post('/addSupplier', authMiddleware, supplierController.addSupplier);
router.get('/getAllSupplier', authMiddleware, supplierController.getAllSupplier);
router.get('/getOneSupplier/:ID_supplier', authMiddleware, supplierController.getOneSupplier);
router.put('/updateSupplier/:ID_supplier', authMiddleware, supplierController.updateSupplier);
router.delete('/deleteSupplier/:ID_supplier', authMiddleware, supplierController.deleteSupplier);

router.get('/getTypeEnum', authMiddleware, supplierController.getTypeEnum);

//Table Materials
router.post('/addMaterial', authMiddleware, materialsController.addMaterial);
router.get('/getAllMaterial', authMiddleware, materialsController.getAllMaterial);
router.get('/getOneMaterial/:ID_material', authMiddleware, materialsController.getOneMaterial);
router.put('/updateMaterial/:ID_material', authMiddleware, materialsController.updateMaterial);
router.delete('/deleteMaterial/:ID_material', authMiddleware, materialsController.deleteMaterial);


router.get('/getLocationEnum', authMiddleware, materialsController.getLocationEnum);
router.get('/getUnitEnum', authMiddleware, materialsController.getUnitEnum);
router.get('/getTypeChangeEnum', authMiddleware, materialsController.getTypeChangeEnum);
router.put('/updateMaterialAmount/:ID_material', authMiddleware, materialsController.updateMaterialAmount);
router.post('/checkMaterialStock', authMiddleware, materialsController.checkMaterialStock);




module.exports = router;