// seedInitialData.js
const { User, Client, Supplier, Materials, Service } = require('./backend/models');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        // ----- HASH LOZINKE -----
        const hashedPassword = await bcrypt.hash('Lozinka123@', 10);

        // ----- KORISNICI -----
        await User.bulkCreate([
            { Name: 'Korisnik1', Lastname: 'Korisnik1', Email: 'admin@example.com', Password: hashedPassword, Role: 'admin', Contact: '0123456789' },
            { Name: 'Emina', Lastname: 'Begić', Email: 'begicema@gmail.com', Password: hashedPassword, Role: 'zaposlenik', Contact: '0987654321' },
            { Name: 'Ivan', Lastname: 'Zaposlenik', Email: 'ivan@example.com', Password: hashedPassword, Role: 'zaposlenik', Contact: '0912345678' },
        ]);

        // ----- KLIJENTI -----
        await Client.bulkCreate([
            { TypeClient: 'Fizička osoba', ContactName: 'Dina Dinić', Contact: '0123456781', Email: 'kontakt@tvrtkaA.hr', Address: 'Ulica 1', City: 'Zagreb', PostalCode: '01234', Country: 'Hrvatska' },
            { TypeClient: 'Fizička osoba', ContactName: 'Vlasta Vlastić', Contact: '0123456782', Email: 'kontakt@tvrtkaB.hr', Address: 'Ulica 2', City: 'Zagreb', PostalCode: '01234', Country: 'Hrvatska' },
            { TypeClient: 'Tvrtka', Name: 'Tvrtka 1', PersonalNumber: '01234567897', ContactName: 'Marta Martić', Contact: '0123456781', Email: 'kontakt@tvrtkaC.hr', Address: 'Ulica 3', City: 'Zagreb', PostalCode: '01234', Country: 'Hrvatska' },
            { TypeClient: 'Tvrtka', Name: 'Tvrtka 2', PersonalNumber: '01234567898', ContactName: 'Pero Perić', Contact: '0123456785', Email: 'kontakt@tvrtkaD.hr', Address: 'Ulica 4', City: 'Zagreb', PostalCode: '01234', Country: 'Hrvatska' }
        ]);

        // ----- DOBAVLJAČI -----
        await Supplier.bulkCreate([
            { Type: 'Fizička osoba', ContactName: 'Maja Majić', Contact: '789654123', Email: 'maja@maja.hr', Address: 'maja ulica 1', City: 'Zagreb', PostalCode: '10000', Country: 'Hrvatska' },
            { Type: 'Tvrtka', Name: 'Tvrtka 123', PersonalNumber: '98765498765', ContactName: 'Ana Anić', Contact: '45678963', Email: 'ana@ana.hr', Address: 'Ana ulica 2', City: 'Rijeka', PostalCode: '51000', Country: 'Hrvatska' },
            { Type: 'Tvrtka', Name: 'Tvrtka 124', PersonalNumber: '98765498764', ContactName: 'Milka Kravić', Contact: '45632102', Email: 'ana@ana.hr', Address: 'Ana ulica 32', City: 'Rijeka', PostalCode: '51000', Country: 'Hrvatska' }
        ]);

        // ----- MATERIJALI -----
        await Materials.bulkCreate([
            { NameMaterial: 'Skaj zeleni - chamaleon', CodeMaterial: '123dfr123', Amount: 200.00, Unit: 'M/2', Location: 'Skladište 1', Description: 'cfvg', MinAmount: 20.00, PurchasePrice: 25.00, SellingPrice: 42.00, TypeChange: 'Nabava', ID_supplier: 1 },
            { NameMaterial: 'Koža crna', CodeMaterial: 'koza456', Amount: 200.00, Unit: 'M/2', Location: 'Skladište 2', Description: 'premium koža', MinAmount: 10.00, PurchasePrice: 80.00, SellingPrice: 120.00, TypeChange: 'Nabava', ID_supplier: 2 },
            { NameMaterial: 'Platno plavo', CodeMaterial: 'plat789', Amount: 200.00, Unit: 'Cm', Location: 'Skladište 3', Description: 'premium platno', MinAmount: 10.00, PurchasePrice: 60.00, SellingPrice: 80.00, TypeChange: 'Nabava', ID_supplier: 2 }
        ]);

        // ----- USLUGE -----
        await Service.bulkCreate([
            { ID_service: 1, Name: 'Tapiciranje stolice - sjedište', Description: 'samo sjedalo', PriceNoTax: 29.95, Tax: 25.00, PriceTax: 37.44 },
            { ID_service: 2, Name: 'Tapiciranje stolice - cijela', Description: 'sjedalo i naslon', PriceNoTax: 50.00, Tax: 25.00, PriceTax: 62.50 },
            { ID_service: 3, Name: 'Popravak naslona', Description: 'manji popravak', PriceNoTax: 15.00, Tax: 25.00, PriceTax: 18.75 }
        ]);

        console.log('Seed podaci uspješno uneseni!');
        process.exit(0);
    } catch (err) {
        console.error('Greška kod seeda:', err);
        process.exit(1);
    }
};

seed();
