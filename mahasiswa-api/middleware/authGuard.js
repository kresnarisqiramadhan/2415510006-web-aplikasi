// middleware/authGuard.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Cek format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({
      error: 'Akses ditolak. Login terlebih dahulu.'
    });

  const token = authHeader.slice(7); // hapus "Bearer "

  try {
    // Verifikasi & decode token
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next(); // token valid → lanjut ke route handler
  } catch {
    res.status(401).json({
      error: 'Token tidak valid atau sudah expired.'
    });
  }
};