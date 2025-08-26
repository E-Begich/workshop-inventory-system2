// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ message: 'Nema tokena, pristup odbijen' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded; // dodaj korisnika u request za dalje
    next();
  } catch (err) {
    res.status(401).json({ message: 'Neispravan token' });
  }
};

module.exports = authMiddleware;
