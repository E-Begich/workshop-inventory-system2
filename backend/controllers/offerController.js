const { TABLOCKX } = require('sequelize/lib/table-hints')
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

//1. create offer
const addOffer = async (req, res) => {
    try {
        const {
            ID_client,
            ID_user,
            DateCreate,
            DateEnd,
            PriceNoTax,
            Tax,
            PriceTax
        } = req.body;

        // Parsiramo vrijednosti u odgovarajuće tipove
        const newOffer = await Offer.create({
            ID_client: parseInt(ID_client),
            ID_user: parseInt(ID_user),
            DateCreate, // očekuje format 'YYYY-MM-DD'
            DateEnd,    // očekuje format 'YYYY-MM-DD'
            PriceNoTax: parseFloat(PriceNoTax),
            Tax: parseFloat(Tax),
            PriceTax: parseFloat(PriceTax),
            HasReceipt: false
        });

        // Logiranje kreiranja ponude
        await logChange({
            userId: ID_user,
            actionType: 'kreirana_ponuda',
            objectType: 'Ponuda',
            objectId: newOffer.ID_offer,
            note: 'Ponuda kreirana u sustavu'
        });

        res.status(201).json(newOffer);

    } catch (error) {
        console.error('Error creating offer:', error);
        res.status(500).json({ message: 'Nešto je pošlo po zlu prilikom kreiranja ponude', error: error.message });
    }
};

// 2. Gets all users from table
const getAllOffer = async (req, res) => {
    let offer = await Offer.findAll({})
    res.send(offer)
}

//3. Get one user over id
const getOneOffer = async (req, res) => {

    let ID_offer = req.params.ID_offer
    let offer = await Offer.findOne({ where: { ID_offer: ID_offer } })
    res.status(200).send(offer)
}

//4. update user over id
const updateOffer = async (req, res) => {
    let ID_offer = req.params.ID_offer
    const offer = await Offer.update(req.body, { where: { ID_offer: ID_offer } })

    // Logiranje izmjene ponude
    await logChange({
        userId: req.body.ID_user, // ili tko je trenutno prijavljen
        actionType: 'izmjena_ponude',
        objectType: 'Ponuda',
        objectId: ID_offer,
        note: 'Ponuda ažurirana'
    });

    res.status(200).send(offer)
}

//5. delete user by id
const deleteOffer = async (req, res) => {

    let ID_offer = req.params.ID_offer
    await Offer.destroy({ where: { ID_offer: ID_offer } })

    // Logiranje brisanja ponude
    await logChange({
        userId: req.body.ID_user || 0, // stavi ID trenutno prijavljenog
        actionType: 'brisanje_ponude',
        objectType: 'Ponuda',
        objectId: ID_offer,
        note: 'Ponuda obrisana'
    });

    res.send('Ponuda je obrisana!')
}

const getOfferWithDetails = async (req, res) => {
    let ID_offer = req.params.ID_offer;

    try {
        const offer = await Offer.findOne({
            where: { ID_offer },
            include: [
                { model: OfferItems, as: 'OfferItems' },
                { model: Client, as: 'Client' },
                { model: User, as: 'User' },
            ],
        });

        if (!offer) return res.status(404).send('Ponuda nije pronađena');
        res.status(200).json(offer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Greška na serveru');
    }
};

const createOfferWithItems = async (req, res) => {
    const {
        ID_client,
        DateCreate,
        DateEnd,
        PriceNoTax,
        Tax,
        PriceTax,
        ID_user,
        OfferItems: items // array stavki
    } = req.body;

    const t = await sequelize.transaction(); // pokrećemo transakciju

    try {
        // 1. Kreiraj ponudu
        const offer = await Offer.create({
            ID_client,
            DateCreate,
            DateEnd,
            PriceNoTax,
            Tax,
            PriceTax,
            ID_user,
            HasReceipt: false
        }, { transaction: t });

        // 2. Dodaj stavke, povezujući ih s kreiranom ponudom
        for (let item of items) {
            await OfferItems.create({
                ID_offer: offer.ID_offer,
                Description: item.Description,
                Quantity: item.Quantity,
                Price: item.Price
            }, { transaction: t });
        }

        // 3. Commit transakcije
        await t.commit();

        // Logiranje kreiranja ponude s artiklima
        await logChange({
            userId: ID_user,
            actionType: 'kreirana_ponuda_s_artiklima',
            objectType: 'Ponuda',
            objectId: offer.ID_offer,
            note: `Ponuda kreirana s ${items.length} stavki`
        });

        res.status(201).json({ message: 'Ponuda i stavke su uspješno kreirani', offer });
    } catch (error) {
        await t.rollback(); // rollback ako nešto ne radi
        console.error(error);
        res.status(500).json({ message: 'Greška pri kreiranju ponude', error: error.message });
    }
};

function generateHUB3QR({ amount, recipientName, recipientAddress, recipientCity, iban, description, reference }) {
    function formatAmount(amount) {
        return parseFloat(amount).toFixed(2).padStart(15, '0'); // npr. 00000000123.45
    }

    const hub3Data = [
        'HRVHUB30',                // Format
        'HRK',                     // Valuta
        formatAmount(amount),      // Iznos
        recipientName || '',       // Primatelj
        recipientAddress || '',    // Adresa primatelja
        recipientCity || '',       // Grad primatelja
        '',                        // Platitelj
        '',                        // Adresa platitelja
        '',                        // Grad platitelja
        iban || '',                // IBAN
        description || '',         // Opis
        reference || '',           // Poziv na broj
        '',                        // Datum valute
    ];

    return hub3Data.join('\n');
}

//forma za kreiranje i izgled PDF dokumenta
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const formatCurrency = (value) => `${parseFloat(value || 0).toFixed(2)} €`;

// Kreiraj dokument
const doc = new PDFDocument();

const generateOfferPDF = async (req, res) => {
    const { ID_offer } = req.params;

    try {
        const offer = await Offer.findOne({
            where: { ID_offer },
            include: [
                { model: OfferItems, as: 'OfferItems' },
                { model: Client, as: 'Client' },
                { model: User, as: 'User' },
            ],
        });

        if (!offer) return res.status(404).send('Ponuda nije pronađena');



        // Kreiraj novi PDF dokument
        const doc = new PDFDocument({ margin: 50 });

        const fontPath = path.join(__dirname, '..', 'fonts', 'DejaVuSans.ttf');
        doc.registerFont('DejaVu', fontPath);
        doc.font('DejaVu');

        const filename = `Ponuda_${offer.ID_offer}.pdf`;

        // Setuj response
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        const formatDate = (date) => new Date(date).toLocaleDateString('hr-HR');

        // === Zaglavlje ===
        doc
            .fontSize(20)
            .text('LOGO', 50, 50)

            .fontSize(14)
            .text(`Ponuda broj: R-${new Date(offer.DateCreate).getFullYear()}-${String(offer.ID_offer).padStart(5, '0')}`, {
                align: 'right',
                width: 530,
            }).fontSize(12)
            .text(`Datum izrade: ${formatDate(offer.DateCreate)}`, { align: 'right' })
            .text(`Datum isteka: ${formatDate(offer.DateEnd)}`, { align: 'right' });

        doc.moveDown(2);

        // === Podaci o klijentu i tvrtki ===
        let klijentInfo = '';

        if (offer.Client.TypeClient === 'Tvrtka') {
            klijentInfo = `Klijent:\n${offer.Client.Name || ''}\n${offer.Client.Address || ''}\n${offer.Client.PostalCode || ''} ${offer.Client.City || ''}\nOIB: ${offer.Client.PersonalNumber || ''}\nEmail: ${offer.Client.Email || ''}`;
        } else {
            klijentInfo = `Klijent:\n${offer.Client.ContactName || ''}\n${offer.Client.Address || ''}\n${offer.Client.PostalCode || ''} ${offer.Client.City || ''}\nOIB: ${offer.Client.PersonalNumber || ''}\nEmail: ${offer.Client.Email || ''}`;
        }

        doc
            .fontSize(12)
        doc.text(klijentInfo, 50, 150);

        const userFullName = offer.User ? `${offer.User.Name || ''} ${offer.User.Lastname || ''}`.trim() : 'Nepoznat';
        doc
            .fontSize(12)
            .text(`Tvrtka:\nPrimjer d.o.o.\nUlica 123 \n10000 Zagreb\nOIB: 12345678901\nTelefon: +385 1 2345 678\nKreirao: ${userFullName}`, 415, 150);

        doc.moveDown(6);

        // === Tablica stavki ===

        const tableTop = 300;
        const itemSpacing = 15;
        const rowSpacing = 15;

        const headers = [
            'Naziv artikla',
            'Vrsta',
            'Jedinica',
            'Količina',
            'Jedinična cijena bez PDV',
            'PDV (%)',
            'Iznos PDV-a',
            'Iznos s PDV'
        ];
        const startX = 50;
        const colWidths = [100, 60, 60, 60, 60, 60, 70, 60];

        // Zaglavlje tablice
        headers.forEach((header, i) => {
            doc.font('DejaVu').fontSize(10).text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
                width: colWidths[i],
                align: 'left',
                ellipsis: true,
                // Ako želiš da dugi tekst u zaglavlju bude u dva reda:
                lineGap: 2,
            });
        });

        // Povuci liniju ispod zaglavlja
        doc.moveTo(startX, tableTop + 40) // pomaknuto malo niže
            .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), tableTop + 40)
            .strokeColor('#aaaaaa')
            .lineWidth(1)
            .stroke();

        // Podaci u tablici
        let rowY = tableTop + 45;

        for (const item of offer.OfferItems) {
            let naziv = '';
            if (item.TypeItem === 'Materijal' && item.ID_material) {
                const mat = await Materials.findByPk(item.ID_material);
                naziv = mat?.NameMaterial || 'Unknown material';
            } else if (item.TypeItem === 'Usluga' && item.ID_service) {
                const serv = await Service.findByPk(item.ID_service);
                naziv = serv?.Name || 'Unknown service';
            }

            const unit = item.TypeItem === 'Materijal' ? 'M' : 'Svc';

            const unitPriceNoTax = item.PriceNoTax;
            const unitPriceWithTax = item.PriceTax;
            const pdvPercent = item.Tax; // expected to be something like 25
            const pdvAmount = (unitPriceWithTax - unitPriceNoTax);

            const row = [
                naziv,
                item.TypeItem,
                unit,
                item.Amount,
                formatCurrency(unitPriceNoTax),
                `${pdvPercent} %`,
                formatCurrency(pdvAmount),
                formatCurrency(unitPriceWithTax),
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

        // === Sažetak cijena ===
        doc.moveDown(5);

        const rightAlignX = 350;
        const leftAlignX = 50;

        doc
            .fontSize(12)
            .text(`Ukupno bez PDV-a:     ${formatCurrency(parseFloat(offer.PriceNoTax))}`, rightAlignX)
            .moveDown(0.2)
            .text(`Iznos PDV-a:                  ${parseFloat(offer.Tax).toFixed(2)} €`, rightAlignX)
            .moveDown(0.2)
            .text(`Ukupno s PDV-om:      ${formatCurrency(parseFloat(offer.PriceTax))}`, rightAlignX);

        // === Tekst iznad QR koda ===
        doc.moveDown(1);
        doc.font('DejaVu')
            .fontSize(10)
            .text('Ponudu možete uplatiti i skeniranjem ovog QR koda:', 50);

        // === QR kod (HUB3 format za plaćanje) ===
        const QRCode = require('qrcode');

        const qrData = generateHUB3QR({
            amount: offer.PriceTax,
            recipientName: 'Moja Firma d.o.o.',
            recipientAddress: 'Adresa 1',
            recipientCity: '10000 Zagreb',
            iban: 'HR1234567890123456789',
            description: `Račun ${offer.ID_offer}`,
            reference: `HR00${offer.ID_offer}` // ili tvoj model/poziv na broj
        });

        const qrImage = await QRCode.toDataURL(qrData);
        const base64Data = qrImage.replace(/^data:image\/png;base64,/, "");
        const qrBuffer = Buffer.from(base64Data, 'base64');
        doc.image(qrBuffer, 50, doc.y + 20, { width: 100 });


        // Postavi QR kod i zapamti donji rub QR-a
        const qrY = doc.y + 20;
        doc.image(qrBuffer, leftAlignX, qrY, { width: 100 });

        // --- Potpis ispod QR-a ---
        const signatureY = qrY + 120; // 100 širina QR-a + 20 px razmak
        doc
            .font('DejaVu')
            .text('______________________', leftAlignX, signatureY)
            .text(`${offer.User?.Name || ''} ${offer.User?.Lastname || ''}`, leftAlignX)
            .text(`${formatDate(new Date())}`, leftAlignX);

        doc.end();

    } catch (error) {
        console.error('Greška prilikom generiranja PDF ponude:', error);
        res.status(500).send('Greška na serveru pri generiranju PDF-a.');
    }
};



module.exports = {
    addOffer,
    getAllOffer,
    getOneOffer,
    updateOffer,
    deleteOffer,
    generateOfferPDF,
    getOfferWithDetails,
    createOfferWithItems
}