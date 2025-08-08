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

//1. create user 

const addUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.Password, 10);

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

// 2. Gets all users from table
const getAllUsers = async (req, res) => {
    let user = await User.findAll({})
    res.send(user)
}

//3. Get one user over id
const getOneUser = async (req, res) => {

    let ID_user = req.params.ID_user
    let user = await User.findOne({ where: { ID_user: ID_user}})
    res.status(200).send(user)
}

//4. update user over id
const updateUser = async (req, res) => {
    let ID_user = req.params.ID_user
    const user = await User.update(req.body, {where: { ID_user: ID_user }})
    res.status(200).send(user)
}

//5. delete user by id
const deleteUser = async (req, res) => {

    let ID_user = req.params.ID_user
    await User.destroy({where: { ID_user: ID_user }})
    res.send('Profil zaposlenika je obrisan!')
}

// 6. Get enum values for Role
const getRoleEnum = (req, res) => {
  const roleEnum = User.rawAttributes.Role.values;
  res.status(200).json(roleEnum);
};

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
            'tajni_kljuc', // promijeni na env varijablu
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Prijava uspješna',
            token,
            user: { ID_user: user.ID_user, Name: user.Name, Role: user.Role }
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