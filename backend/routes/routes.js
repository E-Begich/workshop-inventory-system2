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



const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize'); // putanja do authorize.js



//Table User
router.post('/addUser', authMiddleware, authorize('User', 'create'), userController.addUser);
router.get('/getAllUsers', authMiddleware, authorize('User', 'read'), userController.getAllUsers);
router.get('/getOneUser/:ID_user', authMiddleware, authorize('User', 'read'), userController.getOneUser);
router.put('/updateUser/:ID_user', authMiddleware, authorize('User', 'update'), userController.updateUser);
router.delete('/deleteUser/:ID_user', authMiddleware, authorize('User', 'delete'), userController.deleteUser);

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
router.post('/addService', authMiddleware, authorize('Service', 'create'), serviceController.addService);
router.get('/getAllService', authMiddleware, authorize('Service', 'read'), serviceController.getAllService);
router.get('/getOneService/:ID_service', authMiddleware, authorize('Service', 'read'), serviceController.getOneService);
router.put('/updateService/:ID_service', authMiddleware, authorize('Service', 'update'), serviceController.updateService);
router.delete('/deleteService/:ID_service', authMiddleware, authorize('Service', 'delete'), serviceController.deleteService);

//Table Offer
router.post('/addOffer', authMiddleware, authorize('Offer', 'create'), offerController.addOffer);
router.get('/getAllOffer', authMiddleware, authorize('Offer', 'read'), offerController.getAllOffer);
router.get('/getOneOffer/:ID_offer', authMiddleware, authorize('Offer', 'read'), offerController.getOneOffer);
router.put('/updateOffer/:ID_offer', authMiddleware, authorize('Offer', 'update'), offerController.updateOffer);
router.delete('/deleteOffer/:ID_offer', authMiddleware, authorize('Offer', 'delete'), offerController.deleteOffer);

router.get('/generateOfferPDF/:ID_offer', authMiddleware, authorize('Offer', 'read'), offerController.generateOfferPDF);
router.get('/getOfferWithDetails/:ID_offer', authMiddleware, authorize('Offer', 'read'), offerController.getOfferWithDetails);
router.get("/getActiveOffers", authMiddleware, authorize("Offer", "read"), offerController.getActiveOffers);
router.get("/getArhivedOffers", authMiddleware, authorize("Offer", "read"), offerController.getArhivedOffers);


// Table OfferItems
router.post('/addOfferItems', authMiddleware, offerItemsController.addOfferItems);
router.get('/getAllOfferItems', authMiddleware, offerItemsController.getAllOfferItems);
router.get('/getOneOfferItem/:ID_offerItems', authMiddleware, offerItemsController.getOneOfferItem);
router.put('/updateOfferItem/:ID_offerItems', authMiddleware, offerItemsController.updateOfferItem);
router.delete('/deleteOfferItem/:ID_offerItems', authMiddleware, offerItemsController.deleteOfferItem);

router.get('/getTypeItemEnum', offerItemsController.getTypeItemEnum);

//Table WarehouseChange
router.post('/addChange', authMiddleware,warehouseChangeController.addChange);
router.get('/getAllChanges', authMiddleware, warehouseChangeController.getAllChanges);
router.get('/getOneChange/:ID_change', authMiddleware, warehouseChangeController.getOneChange);
router.put('/updateChange/:ID_change', authMiddleware, warehouseChangeController.updateChange);
router.delete('/deleteChange/:ID_change', authMiddleware, warehouseChangeController.deleteChange);

router.get('/getActivityLogs', authMiddleware, warehouseChangeController.getActivityLogs);
router.get('/getUnreadActivityLogs', authMiddleware, warehouseChangeController.getUnreadActivityLogs);
router.post('/markLogsAsRead', authMiddleware,warehouseChangeController.markLogsAsRead);

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
router.get("/getMonthlySales", authMiddleware, receiptController.getMonthlySales);
router.get("/getTopMaterials", authMiddleware, receiptController.getTopMaterials);


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