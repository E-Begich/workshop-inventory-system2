const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //za login

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

//1. KREIRANJE KORISNIKA - CREATE USER
const addUser = async (req, res) => {
    try {
        const { Name, Lastname, Email, Contact, Password, Role } = req.body;

        // 1.1. OSNOVNA VALIDACIJA (ZA POPUNJAVANJE POLJA) - PRIMARY VALIDATE
        if (!Name || !Lastname || !Email || !Password) {
            return res.status(400).json({ message: 'Ime, prezime, email i lozinka su obavezni!' });
        }

        // 1.2. FORMAT EMAIL ADRESE - EMAIL FORMAT
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Email)) {
            return res.status(400).json({ message: 'Neispravan format email adrese' });
        }

        // 1.3. PROVJERA DA LI EMAIL VEĆ POSTOJI - CHECK IF EMAIL EXIST IN BASE
        const existingUser = await User.findOne({ where: { Email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Korisnik s ovom email adresom već postoji' });
        }

        // 1.4. VALIDACIJA LOZINKE - VALIDATION PASSWORD
        if (Password.length < 6) {
            return res.status(400).json({ message: 'Lozinka mora imati barem 6 znakova' });
        }

        // 1.5. HASH LOZINKE
        const hashedPassword = await bcrypt.hash(Password, 10);

        let info = {
            Name: req.body.Name,
            Lastname: req.body.Lastname,
            Email: req.body.Email,
            Contact: req.body.Contact,
            Password: hashedPassword,
            Role: req.body.Role || 'zaposlenik'
        };

        const user = await User.create(info);
        res.status(201).json({ message: 'Korisnik uspješno kreiran', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Greška pri kreiranju korisnika' });
    }
};

// 2. PREUZIMA SVE KORISNIKE IZ TABLICE - GETS ALL USERS FROM TABLE
const getAllUsers = async (req, res) => {
    let user = await User.findAll({})
    res.send(user)
}

//3. PREUZIMA JEDNOG KORISNIKA PO ID - GERTS ONE USER OVER ID
const getOneUser = async (req, res) => {

    let ID_user = req.params.ID_user
    let user = await User.findOne({ where: { ID_user: ID_user } })
    res.status(200).send(user)
}

//4. AŽURIRA JEDNOG KORISNIKA PO ID - UPDATE ONE USER OVER ID
const updateUser = async (req, res) => {
    try {
        const ID_user = req.params.ID_user;
        const { Name, Lastname, Email, Contact, Password, Role } = req.body;

        // 4.1. NAĐI KORISNIKA - FIND USER
        const user = await User.findOne({ where: { ID_user } });
        if (!user) {
            return res.status(404).json({ message: 'Korisnik ne postoji' });
        }

        // 4.2. PROVJERA EMILA UKOLIKO SE MIJENJA - CHECK EMAIL IN CHANGE CASE
        if (Email && Email !== user.Email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(Email)) {
                return res.status(400).json({ message: 'Neispravan format email adrese' });
            }
            const existingUser = await User.findOne({ where: { Email } });
            if (existingUser && existingUser.ID_user !== ID_user) {
                return res.status(400).json({ message: 'Email je već zauzet' });
            }
        }

        // 4.3. HASH LOZINKE
        let hashedPassword = user.Password;
        if (Password && Password.trim() !== '') {
            if (Password.length < 6) {
                return res.status(400).json({ message: 'Lozinka mora imati barem 6 znakova' });
            }
            hashedPassword = await bcrypt.hash(Password, 10);
        }

        // 4.4. Ručno postavljanje polja na instanci i spremanje
        user.Name = Name ?? user.Name;
        user.Lastname = Lastname ?? user.Lastname;
        user.Email = Email ?? user.Email;
        user.Contact = Contact ?? user.Contact;
        user.Password = hashedPassword;
        user.Role = Role ?? user.Role;

        await user.save(); // Sequelize save pokreće beforeUpdate hook ako postoji

        res.status(200).json({ message: 'Korisnik uspješno ažuriran' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Greška pri ažuriranju korisnika' });
    }
};


//5. BRISANJE KORISNIKA PO ID - DELETE USER OVER ID
const deleteUser = async (req, res) => {
    try {
        const { ID_user } = req.params;

        // 5.1. PROVJERA UKOLIKO KORISNIK IMA ZAPISA (PONUDE ILI RAČUNI) - CHECK IF USER HAS A OFFERS AND/OR RECEIPTS
        const offers = await Offer.count({ where: { ID_user } });
        const receipts = await Receipt.count({ where: { ID_user } });
        const changes = await WarehouseChange.count({ where: { ID_user } });

        if (offers > 0 || receipts > 0 || changes > 0) {
            return res.status(400).json({
                message: 'Korisnik ima povezane zapise i ne može se obrisati'
            });
        }

        await User.destroy({ where: { ID_user } });
        res.json({ message: 'Profil zaposlenika je obrisan!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri brisanju korisnika', error: err.message });
    }
};

// 6. PREUZIMANJE ENUM VRIJEDNOSTI ZA ULOGU - GETS ENUM VALUES FOR ROLE
const getRoleEnum = (req, res) => {
    const roleEnum = User.rawAttributes.Role.values;
    res.status(200).json(roleEnum);
};

// 7. ZA PRIJAVU - FOR LOGIN
const loginUser = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // Provjera da li korisnik postoji
        const user = await User.findOne({ where: { Email } });
        if (!user) return res.status(404).json({ message: 'Korisnik ne postoji' });

        // Provjera lozinke
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) return res.status(401).json({ message: 'Pogrešna lozinka' });

        // Generiranje JWT tokena
        const token = jwt.sign(
            { ID_user: user.ID_user, Role: user.Role },
            process.env.JWT_SECRET, // promijeni na env varijablu
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Prijava uspješna',
            token,
            user: { ID_user: user.ID_user, Name: user.Name, Lastname: user.Lastname, Role: user.Role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
};

module.exports = {
    addUser,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser,
    getRoleEnum,
    loginUser
}