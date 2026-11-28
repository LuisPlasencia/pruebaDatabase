const express = require('express');
const { requireLogin } = require('../middleware/accessControl');
const { countRoutersByUser } = require('../services/routerRepository');

const router = express.Router();

/* GET profile page. */
router.get('/', requireLogin, async (req, res, next) => {
  try {
    const totalRouters = await countRoutersByUser(req.currentUser.id);
    res.render('perfil', {
      title: 'Mi perfil | Trabajo de TARCE',
      currentPage: 'perfil',
      totalRouters
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
