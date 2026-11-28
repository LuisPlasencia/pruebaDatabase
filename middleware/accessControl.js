const createError = require('http-errors');

function requireLogin(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login');
  }
  if (req.currentUser.rol !== 'admin') {
    return next(createError(403, 'No tienes permiso para ver esta página.'));
  }
  next();
}

module.exports = { requireLogin, requireAdmin };
