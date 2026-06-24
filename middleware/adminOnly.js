// middleware/adminOnly.js
// Pasang SETELAH authGuard — butuh req.user yang sudah terisi

module.exports = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({
      error: 'Hanya admin yang bisa akses.'
    });
  next(); // role = admin, lanjut
};