// createAdmin.js
const db = require('./backend/models'); // putanja do tvojih modela
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    const passwordHash = await bcrypt.hash('21Prosinac1990@123', 10); // lozinka za login

    const adminUser = await db.User.create({
      Name: 'Emina',
      Lastname: 'Begić',
      Contact: '00000000',
      Email: 'begicema@gmail.com',
      Password: passwordHash,
      Role: 'admin' // ako imaš role
    });

    console.log('Admin korisnik kreiran:', adminUser.toJSON());
    process.exit();
  } catch (err) {
    console.error('Greška kod kreiranja admina:', err);
    process.exit(1);
  }
}

createAdmin();
