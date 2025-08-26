const db = require('../models');
const { logChange } = require('./warehouseChangeController');
const sequelize = db.sequelize; // ovo je ključ! instanca Sequelize

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

//1. KREIRANJE računa - CREATE RECEIPT 
const addReceipt = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const latestReceipt = await Receipt.findOne({
      where: db.sequelize.where(
        db.sequelize.fn('YEAR', db.sequelize.col('DateCreate')),
        currentYear
      ),
      order: [['ID_receipt', 'DESC']]
    });

    let nextNumber = 1;
    if (latestReceipt && latestReceipt.ReceiptNumber) {
      const lastNumber = parseInt(latestReceipt.ReceiptNumber.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    const receiptNumber = `R-${currentYear}-${String(nextNumber).padStart(5, '0')}`;

    let info = {
      ReceiptNumber: receiptNumber,
      ID_client: req.body.ID_client,
      DateCreate: req.body.DateCreate,
      PriceNoTax: req.body.PriceNoTax,
      Tax: req.body.Tax,
      PriceTax: req.body.PriceTax,
      ID_offer: req.body.ID_offer || null,
      ID_user: req.body.ID_user,
      PaymentMethod: req.body.PaymentMethod
    };

    // console.log("Finalni receipt info:", info);

    const receipt = await db.Receipt.create(info);

    // PODACI ZA SPREMANJE U WAREHOUSECHANGE - INFORMATION FOR WAREHOUSECHANGE
    await logChange({
      userId: req.body.ID_user,
      actionType: 'Kreiran račun',
      objectType: 'Racun',
      objectId: receipt.ID_receipt,
      receiptNumber: receipt.ReceiptNumber,
      note: `Račun "${receipt.ReceiptNumber}" je dodan`
    });

    res.status(201).json(receipt);
  } catch (error) {
    console.error("Greška u addReceipt:", error);
    res.status(500).json({ error: "Greška pri spremanju računa." });
  }
};


// 2. UZIMA SVE RAČUNE IZ BAZE - GETS ALL RECEIPTS FROM BASE
const getAllReceipt = async (req, res) => {
  let receipt = await Receipt.findAll({})
  res.send(receipt)
}

//3. UZIMA JEDAN RAČUN IZ BAZE PO ID - GET ONE RECEIPT OVER ID
const getOneReceipt = async (req, res) => {

  let ID_receipt = req.params.ID_receipt
  let receipt = await Receipt.findOne({ where: { ID_receipt: ID_receipt } })
  res.status(200).send(receipt)
}

//4. UPDATE RECEIPT // ZA SADA SE NE KORISTI ALI ZA UBUDUĆE DA IMAMO
const updateReceipt = async (req, res) => {
  try {
    let ID_receipt = req.params.ID_receipt;

    // prvo dohvatimo račun da znamo broj
    const receipt = await Receipt.findByPk(ID_receipt);
    if (!receipt) {
      return res.status(404).json({ error: "Račun nije pronađen." });
    }

    await Receipt.update(req.body, { where: { ID_receipt } });

    // PODACI ZA SPREMANJE U WAREHOUSECHANGE - INFORMATION FOR WAREHOUSECHANGE
    await logChange({
      userId: req.body.ID_user,
      actionType: 'Uređen račun',
      objectType: 'Racun',
      objectId: receipt.ID_receipt,
      receiptNumber: receipt.ReceiptNumber,
      note: `Račun "${receipt.ReceiptNumber}" je izmijenjen`
    });

    res.status(200).json({ message: "Račun je uspješno ažuriran." });
  } catch (error) {
    console.error("Greška u updateReceipt:", error);
    res.status(500).json({ error: "Greška pri ažuriranju računa." });
  }
};

//5. DELETE RECEIPT // ZA SADA SE NE KORISTI BRISANJE, UKOLIKO NEKADA BUDE POTREBNO 
const deleteReceipt = async (req, res) => {
  try {
    let ID_receipt = req.params.ID_receipt;

    // DOHVAT RAČUNA PRIJE BRISANJA - POTREBNO ZA WAREHOUSECHANGE LOG - TAKE RECEIPT BEFORE DELETE FOR WAREHOUSE ACTIVITY LOG
    const receipt = await Receipt.findByPk(ID_receipt);
    if (!receipt) {
      return res.status(404).json({ error: "Račun nije pronađen." });
    }

    await Receipt.destroy({ where: { ID_receipt } });

    // PODACI ZA SPREMANJE U WAREHOUSECHANGE - INFORMATION FOR WAREHOUSECHANGE
    await logChange({
      userId: req.body.ID_user,
      actionType: 'Obrisan račun',
      objectType: 'Racun',
      objectId: receipt.ID_receipt,
      receiptNumber: receipt.ReceiptNumber,
      note: `Račun "${receipt.ReceiptNumber}" je obrisan`
    });

    res.send('Račun je obrisan!');
  } catch (error) {
    console.error("Greška u deleteReceipt:", error);
    res.status(500).json({ error: "Greška pri brisanju računa." });
  }
};

// 6. KREIRANJE RAČUNA IZ PONUDE - CREATE RECEIPT FROM OFFER
const createReceiptFromOffer = async (req, res) => {
  const { ID_offer, ID_user, PaymentMethod } = req.body;
  const currentYear = new Date().getFullYear();

  try {
    // 6.1. PRONAĐI PONUDU SA STAVKAMA - FIND OFFER WITH ITEMS
    const offer = await Offer.findOne({
      where: { ID_offer },
      include: [{ model: OfferItems, as: 'OfferItems' }],
    });

    if (!offer) {
      return res.status(404).json({ error: 'Ponuda nije pronađena' });
    }

    // 6.2 PROVJERA HASRECEIPT - CHECK HASRECEIPT (in base)
    if (offer.HasReceipt) {
      return res.status(400).json({ error: 'Ova ponuda već ima kreiran račun' });
    }

    // 6.3. IZRAČUN CIJENA - CALCULATE THE PRICE
    const priceNoTax = offer.OfferItems.reduce(
      (sum, item) => sum + (parseFloat(item.PriceNoTax) || 0),
      0
    );
    const priceTax = offer.OfferItems.reduce(
      (sum, item) => sum + (parseFloat(item.PriceTax) || 0),
      0
    );
    const tax = priceTax - priceNoTax;

    // 6.4. GENERIRAJ BROJ RAČUNA - GANERATE RECEIPT NUMBER
    const latestReceipt = await Receipt.findOne({
      where: db.sequelize.where(
        db.sequelize.fn('YEAR', db.sequelize.col('DateCreate')),
        currentYear
      ),
      order: [['ID_receipt', 'DESC']],
    });

    let nextNumber = 1;
    if (latestReceipt && latestReceipt.ReceiptNumber) {
      const parts = latestReceipt.ReceiptNumber.split('-');
      const lastNumber = parseInt(parts[2], 10);
      if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
    }

    const receiptNumber = `R-${currentYear}-${String(nextNumber).padStart(5, '0')}`;

    // 6.5. PRIPREMI STAVKE RAČUNA
    const receiptItems = offer.OfferItems.map(item => ({
      TypeItem: item.TypeItem,
      ID_material: item.ID_material || null,
      ID_service: item.ID_service || null,
      Amount: item.Amount || 0,
      PriceNoTax: item.PriceNoTax || 0,
      Tax: item.Tax || 0,
      PriceTax: item.PriceTax || 0,
    }));

    // 6.6. KREIRAJ RAČUN - PREPARE RECEIPT
    const receipt = await Receipt.create({
      ReceiptNumber: receiptNumber,
      ID_client: offer.ID_client,
      DateCreate: new Date(),
      PriceNoTax: priceNoTax,
      Tax: tax,
      PriceTax: priceTax,
      ID_offer,
      ID_user,
      PaymentMethod
    });

    // PODACI ZA SPREMANJE U WAREHOUSECHANGE - INFORMATION FOR WAREHOUSECHANGE
    await logChange({
      userId: ID_user,
      actionType: 'Kreiran račun iz ponude',
      objectType: 'Racun',
      objectId: receipt.ID_receipt,
      receiptNumber: receipt.ReceiptNumber,
      note: `Račun "${receipt.ReceiptNumber}" je kreiran iz ponude #${ID_offer}`
    });

    // 6.7. OZNAČI PONUDU KAO ISKORIŠTENU - MARK THE OFFER AS USED
    await Offer.update({ HasReceipt: true }, { where: { ID_offer } });

    // 6.8. DODAJ STAVKE I AŽURIRAJ SKLADIŠTE - ADD ITEMS AND UPDATE WAREHOUSE
    for (const item of receiptItems) {
      await ReceiptItems.create({
        ID_receipt: receipt.ID_receipt,
        TypeItem: item.TypeItem,
        ID_material: item.ID_material,
        ID_service: item.ID_service,
        Amount: item.Amount,
        PriceNoTax: item.PriceNoTax,
        Tax: item.Tax,
        PriceTax: item.PriceTax,
      });

      if (item.TypeItem === 'Materijal' && item.ID_material) {
        const material = await Materials.findByPk(item.ID_material);
        if (material) {
          material.Amount -= item.Amount;
          await material.save();
        }
      }
    }

    res.status(201).json(receipt);

  } catch (error) {
    console.error('Greška prilikom kreiranja računa iz ponude:', error.message);
    console.error(error); // prikazuje full stack trace
    res.status(500).json({ error: 'Greška na serveru' });
  }
};


// 7. UZMI ENUM VRIJEDNOSTI ZA TYPE - GET ENUM VALUES FOR TYPE
const getPaymentEnum = (req, res) => {
  const paymentEnum = Receipt.rawAttributes.PaymentMethod.values;
  res.status(200).json(paymentEnum);
};

// 8. ZA MODAL PREGLED RAČUNA U APLIKACIJI - FOR RECEIPT PREVIEW MODAL IN THE APPLICATION
const getReceiptWithDetails = async (req, res) => {
  const ID_receipt = req.params.ID_receipt;

  try {
    const receipt = await Receipt.findOne({
      where: { ID_receipt },
      include: [
        { model: ReceiptItems, as: 'ReceiptItems' },
        { model: Client, as: 'Client' },
        { model: User, as: 'User' },
      ],
    });

    if (!receipt) return res.status(404).send('Račun nije pronađen');
    res.status(200).json(receipt);
  } catch (error) {
    console.error(error);
    res.status(500).send('Greška na serveru');
  }
};

// 9. GENERIRANJE I IZGLED PDF-a - GENERATE AND PREVIEW PDF
const PDFDocument = require('pdfkit');
const path = require('path');
const QRCode = require('qrcode');
const formatCurrency = (value) => `${parseFloat(value || 0).toFixed(2)} €`;

const generateReceiptPDF = async (req, res) => {
  const { ID_receipt } = req.params;

  try {
    const receipt = await Receipt.findOne({
      where: { ID_receipt },
      include: [
        { model: ReceiptItems, as: 'ReceiptItems' },
        { model: Client, as: 'Client' },
        { model: User, as: 'User' },
      ],
    });

    if (!receipt) return res.status(404).send('Račun nije pronađen');

    const doc = new PDFDocument({ margin: 50 });
    const fontPath = path.join(__dirname, '..', 'fonts', 'DejaVuSans.ttf');
    doc.registerFont('DejaVu', fontPath);
    doc.font('DejaVu');

    const filename = `Racun_${receipt.ID_receipt}.pdf`;
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    const formatDate = (date) => new Date(date).toLocaleDateString('hr-HR');

    // === Zaglavlje ===
    doc
      .fontSize(20)
      .text('LOGO', 50, 50)
      .fontSize(14)
      .text(`Račun broj: R-${new Date(receipt.DateCreate).getFullYear()}-${String(receipt.ID_receipt).padStart(5, '0')}`, {
        align: 'right',
        width: 530,
      })
      .fontSize(12)
      .text(`Datum izdavanja: ${formatDate(receipt.DateCreate)}`, { align: 'right' })
      .text(`Način plaćanja: ${receipt.PaymentMethod || 'N/A'}`, { align: 'right' });

    doc.moveDown(2);

    // === Podaci o klijentu i tvrtki ===
    let klijentInfo = '';

    if (receipt.Client.TypeClient === 'Tvrtka') {
      klijentInfo = `Klijent:\n${receipt.Client.Name || ''}\n${receipt.Client.Address || ''}\n${receipt.Client.PostalCode || ''} ${receipt.Client.City || ''}\nOIB: ${receipt.Client.PersonalNumber || ''}\nEmail: ${receipt.Client.Email || ''}`;
    } else {
      klijentInfo = `Klijent:\n${receipt.Client.ContactName || ''}\n${receipt.Client.Address || ''}\n${receipt.Client.PostalCode || ''} ${receipt.Client.City || ''}\nOIB: ${receipt.Client.PersonalNumber || ''}\nEmail: ${receipt.Client.Email || ''}`;
    }

    doc
      .fontSize(12)
      .text(klijentInfo, 50, 150);

    const userFullName = receipt.User ? `${receipt.User.Name || ''} ${receipt.User.Lastname || ''}`.trim() : 'Nepoznat';
    doc
      .fontSize(12)
      .text(`Tvrtka:\nPrimjer d.o.o.\nUlica 123 \n10000 Zagreb\nOIB: 12345678901\nTelefon: +385 1 2345 678\nIzdao: ${userFullName}`, 415, 150);

    doc.moveDown(6);

    // === Tablica stavki ===
    const tableTop = 300;
    const itemSpacing = 15;
    const rowSpacing = 15;

    const headers = [
      'Naziv artikla', 'Vrsta', 'Jedinica', 'Količina', 'Jed. cijena bez PDV', 'PDV (%)', 'PDV iznos', 'Cijena s PDV'
    ];
    const startX = 50;
    const colWidths = [100, 60, 60, 60, 60, 60, 70, 60];

    headers.forEach((header, i) => {
      doc.font('DejaVu').fontSize(10).text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
        width: colWidths[i],
        align: 'left',
        lineGap: 2,
      });
    });

    doc.moveTo(startX, tableTop + 40)
      .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), tableTop + 40)
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .stroke();

    let rowY = tableTop + 45;

    for (const item of receipt.ReceiptItems) {
      let naziv = '';
      if (item.TypeItem === 'Materijal' && item.ID_material) {
        const mat = await Materials.findByPk(item.ID_material);
        naziv = mat?.NameMaterial || 'Unknown material';
      } else if (item.TypeItem === 'Usluga' && item.ID_service) {
        const serv = await Service.findByPk(item.ID_service);
        naziv = serv?.Name || 'Unknown service';
      }

      const unit = item.TypeItem === 'Materijal' ? 'M' : 'Svc';
      const pdvAmount = item.PriceTax - item.PriceNoTax;

      const row = [
        naziv,
        item.TypeItem,
        item.TypeItem === 'Materijal' ? 'M' : 'Svc',
        item.Amount,
        formatCurrency(item.PriceNoTax),
        `${item.Tax} %`,
        formatCurrency(pdvAmount),
        formatCurrency(item.PriceTax),
      ];

      let maxRowHeight = 0;

      row.forEach((text, i) => {
        const cellX = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        const cellWidth = colWidths[i];

        // izračun stvarne visine teksta u toj koloni
        const textHeight = doc.heightOfString(String(text), {
          width: cellWidth,
          align: 'left'
        });
        if (textHeight > maxRowHeight) {
          maxRowHeight = textHeight;
        }

        doc
          .font('DejaVu')
          .fontSize(10)
          .text(String(text), cellX, rowY, {
            width: cellWidth,
            align: 'left'
          });
      });

      // dodaj malo razmaka nakon reda
      rowY += maxRowHeight + 5;
    }

    // === Sažetak ===
    doc.moveDown(3);

    const rightAlignX = 350;
    doc
      .fontSize(12)
      .text(`Ukupno bez PDV-a:     ${formatCurrency(receipt.PriceNoTax)}`, rightAlignX)
      .moveDown(0.2)
      .text(`Iznos PDV-a:                  ${parseFloat(receipt.Tax).toFixed(2)} €`, rightAlignX)
      .moveDown(0.2)
      .text(`Ukupno s PDV-om:      ${formatCurrency(receipt.PriceTax)}`, rightAlignX);

    // === Simulirani QR kod za testiranje (nije fiskalizacija) ===
    const simulatedEOR = 'TEST-EOR-123456';
    const simulatedZOI = 'TEST-ZOI-654321';
    const qrData = `https://tvoj-projekt.hr/provjera-racuna?jir=${simulatedEOR}&zki=${simulatedZOI}`;

    // Generiranje QR koda
    const qrImage = await QRCode.toDataURL(qrData);
    const base64Data = qrImage.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(base64Data, 'base64');

    // Tekst iznad QR koda
    doc
      .font('DejaVu')
      .fontSize(10)
      .text(`EOR: ${simulatedEOR}`, 50, doc.y + 10)
      .text(`ZOI: ${simulatedZOI}`, 50)
      .text('Račun možete provjeriti i preko QR koda (simulacija)', 50, doc.y + 10);

    // Ubacivanje QR koda u PDF
    doc.image(qrBuffer, 50, doc.y + 5, { width: 100 });

    // === Potpis ===
    doc.moveDown(12);
    doc
      .text('______________________', 50)
      .text(`${receipt.User?.Name || ''} ${receipt.User?.Lastname || ''}`, 50)
      .text(`${formatDate(new Date())}`, 50);

    doc.end();
  } catch (error) {
    console.error('Greška prilikom generiranja PDF računa:', error);
    res.status(500).send('Greška na serveru pri generiranju PDF-a.');
  }
};

// 10. ZA HOMEPAGE PRIKAZ MJESEČNE PRODAJE - FOR HOMEPAGE, MONHTLY SALES
const getMonthlySales = async (req, res) => {
  try {
    const results = await Receipt.findAll({
      attributes: [
        [sequelize.fn("YEAR", sequelize.col("DateCreate")), "year"],
        [sequelize.fn("MONTH", sequelize.col("DateCreate")), "month"],
        [sequelize.fn("SUM", sequelize.col("PriceNoTax")), "total"] 
      ],
      group: [
        sequelize.fn("YEAR", sequelize.col("DateCreate")),
        sequelize.fn("MONTH", sequelize.col("DateCreate"))
      ],
      order: [
        [sequelize.fn("YEAR", sequelize.col("DateCreate")), "ASC"],
        [sequelize.fn("MONTH", sequelize.col("DateCreate")), "ASC"]
      ]
    });

    res.json(results);
  } catch (err) {
    console.error("Greška kod dohvaćanja mjesečne prodaje:", err);
    res.status(500).json({ error: "Greška na serveru" });
  }
};

// 11. HOMEPAGE, PRIKAZ TOP 5 MATERIJALA SA NAJVIŠOM KOLIČINOM - HOMEPAGE, CHECK 5 MATERIALS WITH HIGHEST AMOUNT
const getTopMaterials = async (req, res) => {
  try {
    const topMaterials = await Materials.findAll({
      attributes: ['NameMaterial', 'Amount', 'MinAmount'],
      order: [['Amount', 'DESC']],
      limit: 5
    });
    res.json(topMaterials);
  } catch (err) {
    console.error('Greška kod dohvaćanja top materijala:', err);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};


module.exports = {
  addReceipt,
  getAllReceipt,
  getOneReceipt,
  updateReceipt,
  deleteReceipt,
  createReceiptFromOffer,
  getPaymentEnum,
  getReceiptWithDetails,
  generateReceiptPDF,
  getMonthlySales,
  getTopMaterials
}