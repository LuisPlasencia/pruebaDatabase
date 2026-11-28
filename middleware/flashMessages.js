// A flash message is shown once on the next page after a redirect, then removed from the session
function setFlash(req, severity, text) {
  req.session.flash = { severity, text };
}

function exposeFlash(req, res, next) {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
}

module.exports = { setFlash, exposeFlash };
