const { findUserById } = require('../services/userRepository');

// Reads the user from the database on every request, so a deleted account or a role change takes effect immediately
async function loadCurrentUser(req, res, next) {
  req.currentUser = null;
  res.locals.currentUser = null;

  if (!req.session.userId) {
    return next();
  }

  try {
    const user = await findUserById(req.session.userId);

    if (!user) {
      delete req.session.userId;
      return next();
    }

    req.currentUser = user;
    res.locals.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { loadCurrentUser };
