// createAdmin.js
const db = require('./backend/models'); // putanja do tvojih modela
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10); // lozinka za login

    const adminUser = await db.User.create({
      Name: 'Admin',
      Lastname: 'Test',
      Contact: '00000000',
      Email: 'admin@admin.com',
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
