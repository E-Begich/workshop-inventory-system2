// seedInitialData.js
const { User, Client, Supplier, Materials, Service, Offer, OfferItems, Receipt, ReceiptItems } = require('./backend/models');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        // ----- HASH LOZINKE -----
        const hashedPassword = await bcrypt.hash('Lozinka123@', 10);

        // ----- KORISNICI -----
        await User.bulkCreate([
            { Name: 'Marko', Lastname: 'Horvat', Email: 'marko.horvat@example.com', Password: hashedPassword, Role: 'admin', Contact: '0123456789' },
            { Name: 'Ivana', Lastname: 'Kovačević', Email: 'ivana.kovacevic@example.com', Password: hashedPassword, Role: 'zaposlenik', Contact: '0987654321' },
            { Name: 'Luka', Lastname: 'Babić', Email: 'luka.babic@example.com', Password: hashedPassword, Role: 'zaposlenik', Contact: '0912345678' },
        ], { ignoreDuplicates: true });

        // ----- KLIJENTI -----
        await Client.bulkCreate([
            { TypeClient: 'Fizička osoba', ContactName: 'Ana Marić', Contact: '0123456781', Email: 'ana.maric@example.com', Address: 'Ulica Kralja Tomislava 12', City: 'Zagreb', PostalCode: '10000', Country: 'Hrvatska' },
            { TypeClient: 'Fizička osoba', ContactName: 'Petar Jurić', Contact: '0123456782', Email: 'petar.juric@example.com', Address: 'Splitska 45', City: 'Split', PostalCode: '21000', Country: 'Hrvatska' },
            { TypeClient: 'Tvrtka', Name: 'TechNova d.o.o.', PersonalNumber: '12345678901', ContactName: 'Marija Novak', Contact: '0123456781', Email: 'marija.novak@example.com', Address: 'Dravska 7', City: 'Osijek', PostalCode: '31000', Country: 'Hrvatska' },
            { TypeClient: 'Tvrtka', Name: 'GreenBuild j.d.o.o.', PersonalNumber: '98765432109', ContactName: 'Ivan Radić', Contact: '0123456785', Email: 'ivan.radic@example.com', Address: 'Riječka 3', City: 'Rijeka', PostalCode: '51000', Country: 'Hrvatska' }
        ], { ignoreDuplicates: true });

        // ----- DOBAVLJAČI -----
        await Supplier.bulkCreate([
            { Type: 'Fizička osoba', ContactName: 'Tomislav Kranjčec', Contact: '789654123', Email: 'tomislav.kranjcec@example.com', Address: 'Savska 22', City: 'Zagreb', PostalCode: '10000', Country: 'Hrvatska' },
            { Type: 'Tvrtka', Name: 'SolarTech d.o.o.', PersonalNumber: '45678912345', ContactName: 'Lea Perić', Contact: '45678963', Email: 'lea.peric@example.com', Address: 'Obala 10', City: 'Split', PostalCode: '21000', Country: 'Hrvatska' },
            { Type: 'Tvrtka', Name: 'AquaSystems j.d.o.o.', PersonalNumber: '32165498701', ContactName: 'Mateo Lončar', Contact: '45632102', Email: 'mateo.loncar@example.com', Address: 'Ulica slobode 5', City: 'Rijeka', PostalCode: '51000', Country: 'Hrvatska' }
        ], { ignoreDuplicates: true });

        // ----- MATERIJALI -----
        await Materials.bulkCreate([
            { NameMaterial: 'Skaj zeleni - chamaleon', CodeMaterial: '123dfr123', Amount: 200.00, Unit: 'M/2', Location: 'Skladište 1', Description: 'cfvg', MinAmount: 20.00, PurchasePrice: 25.00, SellingPrice: 42.00, TypeChange: 'Nabava', ID_supplier: 1 },
            { NameMaterial: 'Koža crna', CodeMaterial: 'koza456', Amount: 200.00, Unit: 'M/2', Location: 'Skladište 2', Description: 'premium koža', MinAmount: 10.00, PurchasePrice: 80.00, SellingPrice: 120.00, TypeChange: 'Nabava', ID_supplier: 2 },
            { NameMaterial: 'Platno plavo', CodeMaterial: 'plat789', Amount: 200.00, Unit: 'Cm', Location: 'Skladište 3', Description: 'premium platno', MinAmount: 10.00, PurchasePrice: 60.00, SellingPrice: 80.00, TypeChange: 'Nabava', ID_supplier: 3 },
            { NameMaterial: 'Koža crvena', CodeMaterial: 'koza601', Amount: 120.00, Unit: 'M/2', Location: 'Skladište 1', Description: 'premium crvena koža', MinAmount: 10.00, PurchasePrice: 85.00, SellingPrice: 130.00, TypeChange: 'Nabava', ID_supplier: 1 },
            { NameMaterial: 'Tkanina lanena', CodeMaterial: 'tkani602', Amount: 300.00, Unit: 'M', Location: 'Skladište 2', Description: 'lanena tkanina visoke kvalitete', MinAmount: 20.00, PurchasePrice: 12.00, SellingPrice: 25.00, TypeChange: 'Nabava', ID_supplier: 2 },
            { NameMaterial: 'Koža plava', CodeMaterial: 'koza603', Amount: 150.00, Unit: 'M/2', Location: 'Skladište 2', Description: 'mekana plava koža', MinAmount: 15.00, PurchasePrice: 80.00, SellingPrice: 120.00, TypeChange: 'Nabava', ID_supplier: 3 },
            { NameMaterial: 'Tkanina pamuk siva', CodeMaterial: 'tkani604', Amount: 400.00, Unit: 'M', Location: 'Skladište 1', Description: 'mekana pamuk tkanina', MinAmount: 30.00, PurchasePrice: 6.00, SellingPrice: 15.00, TypeChange: 'Nabava', ID_supplier: 1 },
            { NameMaterial: 'Koža smeđa glatka', CodeMaterial: 'koza605', Amount: 200.00, Unit: 'M/2', Location: 'Skladište 3', Description: 'premium smeđa glatka koža', MinAmount: 15.00, PurchasePrice: 75.00, SellingPrice: 115.00, TypeChange: 'Nabava', ID_supplier: 2 }
        ], { ignoreDuplicates: true });

        // ----- USLUGE -----
        await Service.bulkCreate([
            { ID_service: 1, Name: 'Tapiciranje stolice - sjedište', Description: 'samo sjedalo', PriceNoTax: 29.95, Tax: 25.00, PriceTax: 37.44 },
            { ID_service: 2, Name: 'Tapiciranje stolice - cijela', Description: 'sjedalo i naslon', PriceNoTax: 50.00, Tax: 25.00, PriceTax: 62.50 },
            { ID_service: 3, Name: 'Popravak naslona', Description: 'manji popravak', PriceNoTax: 15.00, Tax: 25.00, PriceTax: 18.75 },
            { ID_service: 4, Name: 'Presvlačenje stolica', Description: 'zamjena stare tkanine ili kože', PriceNoTax: 50.00, Tax: 25.00, PriceTax: 62.50 },
            { ID_service: 5, Name: 'Popravak sjedala automobila', Description: 'manji popravci i šivanje', PriceNoTax: 40.00, Tax: 25.00, PriceTax: 50.00 },
            { ID_service: 6, Name: 'Tapeciranje sofe', Description: 'zamjena pjene i tkanine', PriceNoTax: 120.00, Tax: 25.00, PriceTax: 150.00 },
            { ID_service: 7, Name: 'Šivanje jastuka', Description: 'izrada i šivanje dekorativnih jastuka', PriceNoTax: 20.00, Tax: 25.00, PriceTax: 25.00 }
        ], { ignoreDuplicates: true });

        // ----- OFFERS -----
        await Offer.bulkCreate([
            { ID_client: 1, DateCreate: "2025-08-15", DateEnd: "2025-08-29", PriceNoTax: 100.00, Tax: 25.00, PriceTax: 125.00, ID_user: 1, HasReceipt: false },
            { ID_client: 2, DateCreate: "2025-08-16", DateEnd: "2025-08-30", PriceNoTax: 200.00, Tax: 50.00, PriceTax: 250.00, ID_user: 1, HasReceipt: false },
            { ID_client: 1, DateCreate: "2025-08-16", DateEnd: "2025-08-30", PriceNoTax: 80.00, Tax: 20.00, PriceTax: 100.00, ID_user: 2, HasReceipt: false },
            { ID_client: 1, DateCreate: "2025-08-16", DateEnd: "2025-08-30", PriceNoTax: 50.00, Tax: 25.00, PriceTax: 62.50, ID_user: 1, HasReceipt: false },
            { ID_client: 2, DateCreate: "2025-08-17", DateEnd: "2025-08-31", PriceNoTax: 120.00, Tax: 25.00, PriceTax: 150.00, ID_user: 2, HasReceipt: false },
            { ID_client: 3, DateCreate: "2025-08-17", DateEnd: "2025-08-31", PriceNoTax: 40.00, Tax: 25.00, PriceTax: 50.00, ID_user: 1, HasReceipt: false },
            { ID_client: 1, DateCreate: "2025-08-21", DateEnd: "2025-09-04", PriceNoTax: 200.00, Tax: 25.00, PriceTax: 250.00, ID_user: 3, HasReceipt: false },
            { ID_client: 2, DateCreate: "2025-08-25", DateEnd: "2025-09-08", PriceNoTax: 80.00, Tax: 25.00, PriceTax: 100.00, ID_user: 2, HasReceipt: false },
            { ID_client: 3, DateCreate: "2025-09-11", DateEnd: "2025-09-26", PriceNoTax: 40.00, Tax: 25.00, PriceTax: 50.00, ID_user: 1, HasReceipt: false },
            { ID_client: 2, DateCreate: "2025-09-11", DateEnd: "2025-09-26", PriceNoTax: 200.00, Tax: 25.00, PriceTax: 250.00, ID_user: 3, HasReceipt: false },
            { ID_client: 1, DateCreate: "2025-09-12", DateEnd: "2025-09-27", PriceNoTax: 80.00, Tax: 25.00, PriceTax: 100.00, ID_user: 2, HasReceipt: false }

        ], {
            ignoreDuplicates: true
        });

        // ----- OFFER ITEMS -----
        // ⚠️ ako koristiš AUTO_INCREMENT za ID_offer, moraš provjeriti koji ID-evi su stvarno dodijeljeni
        // Ako u bazi već imaš ponude, ove vrijednosti za ID_offer zamijeni sa stvarnim ID-evima
        await OfferItems.bulkCreate([
            // Ponuda 1 -> 1 materijal + 1 usluga
            { ID_offer: 1, TypeItem: "Materijal", ID_material: 1, ID_service: null, Amount: 2, PriceNoTax: 50.00, Tax: 12.50, PriceTax: 62.50 },
            { ID_offer: 1, TypeItem: "Usluga", ID_material: null, ID_service: 1, Amount: 1, PriceNoTax: 29.95, Tax: 7.49, PriceTax: 37.44 },

            // Ponuda 2 -> samo usluga
            { ID_offer: 2, TypeItem: "Usluga", ID_material: null, ID_service: 2, Amount: 1, PriceNoTax: 50.00, Tax: 12.50, PriceTax: 62.50 },

            // Ponuda 3 -> samo materijal
            { ID_offer: 3, TypeItem: "Materijal", ID_material: 2, ID_service: null, Amount: 1, PriceNoTax: 80.00, Tax: 20.00, PriceTax: 100.00 },

            // Ponuda 4 -> 1 materijal + 1 usluga
            { ID_offer: 4, TypeItem: "Materijal", ID_material: 3, ID_service: null, Amount: 2, PriceNoTax: 120.00, Tax: 30.00, PriceTax: 150.00 },
            { ID_offer: 4, TypeItem: "Usluga", ID_material: null, ID_service: 3, Amount: 1, PriceNoTax: 15.00, Tax: 3.75, PriceTax: 18.75 },

            // Ponuda 5 -> samo usluga
            { ID_offer: 5, TypeItem: "Usluga", ID_material: null, ID_service: 4, Amount: 1, PriceNoTax: 50.00, Tax: 12.50, PriceTax: 62.50 },

            // Ponuda 6 -> 1 materijal + 1 usluga
            { ID_offer: 6, TypeItem: "Materijal", ID_material: 4, ID_service: null, Amount: 1, PriceNoTax: 130.00, Tax: 32.50, PriceTax: 162.50 },
            { ID_offer: 6, TypeItem: "Usluga", ID_material: null, ID_service: 5, Amount: 1, PriceNoTax: 40.00, Tax: 10.00, PriceTax: 50.00 },

            // Ponuda 7 -> 2 materijala
            { ID_offer: 7, TypeItem: "Materijal", ID_material: 5, ID_service: null, Amount: 3, PriceNoTax: 75.00, Tax: 18.75, PriceTax: 93.75 },
            { ID_offer: 7, TypeItem: "Materijal", ID_material: 6, ID_service: null, Amount: 2, PriceNoTax: 120.00, Tax: 30.00, PriceTax: 150.00 },

            // Ponuda 8 -> 1 materijal + 2 usluge
            { ID_offer: 8, TypeItem: "Materijal", ID_material: 7, ID_service: null, Amount: 4, PriceNoTax: 60.00, Tax: 15.00, PriceTax: 75.00 },
            { ID_offer: 8, TypeItem: "Usluga", ID_material: null, ID_service: 6, Amount: 1, PriceNoTax: 120.00, Tax: 30.00, PriceTax: 150.00 },
            { ID_offer: 8, TypeItem: "Usluga", ID_material: null, ID_service: 7, Amount: 2, PriceNoTax: 40.00, Tax: 10.00, PriceTax: 50.00 },

            // Ponuda 9 (nova)
            { ID_offer: 9, TypeItem: "Materijal", ID_material: 8, ID_service: null, Amount: 1, priceNoTax: 40.00, tax: 10.00, priceTax: 50.00 },

            // Ponuda 10 (nova)
            { ID_offer: 10, TypeItem: "Usluga", ID_material: null, ID_service: 8, Amount: 1, priceNoTax: 200.00, tax: 50.00, priceTax: 250.00 },

            // Ponuda 11 (nova)
            { ID_offer: 11, TypeItem: "Materijal", ID_material: 9, ID_service: null, Amount: 1, priceNoTax: 80.00, tax: 20.00, priceTax: 100.00 }
        ], {
            ignoreDuplicates: true
        });

        // ----- RECEIPTS -----
        await Receipt.bulkCreate([
            { ID_receipt: 1, ReceiptNumber: 'R-2025-00001', ID_client: 1, DateCreate: "2025-06-10", PriceNoTax: 125.00, Tax: 25.00, PriceTax: 150.00, ID_offer: 1, ID_user: 1, PaymentMethod: 'Gotovina' },
            { ID_receipt: 2, ReceiptNumber: 'R-2025-00002', ID_client: 2, DateCreate: "2025-06-12", PriceNoTax: 200.00, Tax: 50.00, PriceTax: 250.00, ID_offer: 2, ID_user: 2, PaymentMethod: 'Kartica' },
            { ID_receipt: 3, ReceiptNumber: 'R-2025-00003', ID_client: 1, DateCreate: "2025-06-15", PriceNoTax: 100.00, Tax: 25.00, PriceTax: 125.00, ID_offer: 3, ID_user: 1, PaymentMethod: 'Gotovina' },
            // SRPANJ
            { ID_receipt: 4, ReceiptNumber: "R-2025-00004", ID_client: 1, DateCreate: "2025-07-05", PriceNoTax: 80.00, Tax: 20.00, PriceTax: 100.00, ID_offer: 3, ID_user: 1, PaymentMethod: "Gotovina" },
            { ID_receipt: 5, ReceiptNumber: "R-2025-00005", ID_client: 2, DateCreate: "2025-07-12", PriceNoTax: 150.00, Tax: 37.50, PriceTax: 187.50, ID_offer: 2, ID_user: 2, PaymentMethod: "Kartica" },

            // KOLOVOZ
            { ID_receipt: 6, ReceiptNumber: "R-2025-00006", ID_client: 1, DateCreate: "2025-08-03", PriceNoTax: 120.00, Tax: 30.00, PriceTax: 150.00, ID_offer: 5, ID_user: 1, PaymentMethod: "Gotovina" },
            { ID_receipt: 7, ReceiptNumber: "R-2025-00007", ID_client: 3, DateCreate: "2025-08-18", PriceNoTax: 200.00, Tax: 50.00, PriceTax: 250.00, ID_offer: 7, ID_user: 3, PaymentMethod: "Kartica" },

            // RUJAN
            { ID_receipt: 8, ReceiptNumber: "R-2025-00008", ID_client: 2, DateCreate: "2025-09-01", PriceNoTax: 100.00, Tax: 25.00, PriceTax: 125.00, ID_offer: 8, ID_user: 2, PaymentMethod: "Gotovina" },
            { ID_receipt: 9, ReceiptNumber: "R-2025-00009", ID_client: 1, DateCreate: "2025-09-03", PriceNoTax: 250.00, Tax: 62.50, PriceTax: 312.50, ID_offer: 1, ID_user: 1, PaymentMethod: "Kartica" }
        ], { ignoreDuplicates: true });

        // ----- RECEIPT ITEMS -----
        await ReceiptItems.bulkCreate([
            // RAČUN 1 -> 1 materijal + 1 usluga
            { ID_recItems: 1, ID_receipt: 1, TypeItem: 'Materijal', ID_material: 1, ID_service: null, Amount: 2, PriceNoTax: 84.00, Tax: 12.50, PriceTax: 105.00 },
            { ID_recItems: 2, ID_receipt: 1, TypeItem: 'Usluga', ID_material: null, ID_service: 1, Amount: 1, PriceNoTax: 29.95, Tax: 7.49, PriceTax: 37.44 },

            // RAČUN 2 -> samo usluga
            { ID_recItems: 3, ID_receipt: 2, TypeItem: 'Usluga', ID_material: null, ID_service: 2, Amount: 1, PriceNoTax: 50.00, Tax: 12.50, PriceTax: 62.50 },

            // RAČUN 3 -> samo materijal
            { ID_recItems: 4, ID_receipt: 3, TypeItem: 'Materijal', ID_material: 2, ID_service: null, Amount: 1, PriceNoTax: 80.00, Tax: 20.00, PriceTax: 100.00 },

            // SRPANJ
            { ID_recItems: 5, ID_receipt: 4, TypeItem: "Materijal", ID_material: 2, ID_service: null, Amount: 1, PriceNoTax: 80.00, Tax: 20.00, PriceTax: 100.00 },
            { ID_recItems: 6, ID_receipt: 5, TypeItem: "Usluga", ID_material: null, ID_service: 2, Amount: 3, PriceNoTax: 150.00, Tax: 37.50, PriceTax: 187.50 },

            // KOLOVOZ
            { ID_recItems: 7, ID_receipt: 6, TypeItem: "Materijal", ID_material: 5, ID_service: null, Amount: 4, PriceNoTax: 120.00, Tax: 30.00, PriceTax: 150.00 },
            { ID_recItems: 8, ID_receipt: 7, TypeItem: "Usluga", ID_material: null, ID_service: 6, Amount: 2, PriceNoTax: 200.00, Tax: 50.00, PriceTax: 250.00 },

            // RUJAN
            { ID_recItems: 9, ID_receipt: 8, TypeItem: "Materijal", ID_material: 1, ID_service: null, Amount: 2, PriceNoTax: 100.00, Tax: 25.00, PriceTax: 125.00 },
            { ID_recItems: 10, ID_receipt: 9, TypeItem: "Usluga", ID_material: null, ID_service: 6, Amount: 2, PriceNoTax: 250.00, Tax: 62.50, PriceTax: 312.50 }
        ], { ignoreDuplicates: true });



        console.log('Seed podaci uspješno uneseni!');
        process.exit(0);
    } catch (err) {
        console.error('Greška kod seeda:', err);
        process.exit(1);
    }
};

seed();
