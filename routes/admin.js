const express = require('express');
const { requireAdmin } = require('../middleware/accessControl');
const { setFlash } = require('../middleware/flashMessages');
const userRepository = require('../services/userRepository');
const { parsePositiveId } = require('../services/requestParams');

const router = express.Router();

// Every route in this file is only available to administrators
router.use(requireAdmin);

/* GET list of registered accounts. */
router.get('/usuarios', async (req, res, next) => {
  try {
    const users = await userRepository.listUsersWithRouterCount();
    res.render('admin-usuarios', {
      title: 'Administración | Trabajo de TARCE',
      currentPage: 'admin',
      users
    });
  } catch (error) {
    next(error);
  }
});

/* POST delete a user account (its routers are deleted by ON DELETE CASCADE). */
router.post('/usuarios/:userId/eliminar', async (req, res, next) => {
  const userId = parsePositiveId(req.params.userId);

  if (userId === req.currentUser.id) {
    setFlash(req, 'error', 'No puedes eliminar tu propia cuenta de administrador.');
    return res.redirect(303, '/admin/usuarios');
  }

  try {
    const wasDeleted = userId !== null && await userRepository.deleteUserById(userId);
    setFlash(req, 'info', wasDeleted ? 'Cuenta eliminada.' : 'Esa cuenta no existe.');
    res.redirect(303, '/admin/usuarios');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
