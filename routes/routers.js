const express = require('express');
const { requireLogin } = require('../middleware/accessControl');
const { setFlash } = require('../middleware/flashMessages');
const routerRepository = require('../services/routerRepository');
const { validateRouter } = require('../services/routerValidation');
const { parsePositiveId } = require('../services/requestParams');

const router = express.Router();

router.use(requireLogin);

async function renderRouterList(req, res, statusCode, errors, values) {
  const routers = await routerRepository.listRoutersByUser(req.currentUser.id);
  res.status(statusCode).render('routers', {
    title: 'Mis routers | Trabajo de TARCE',
    currentPage: 'routers',
    routers,
    errors,
    values
  });
}

/* GET current user's routers. */
router.get('/', async (req, res, next) => {
  try {
    await renderRouterList(req, res, 200, [], {});
  } catch (error) {
    next(error);
  }
});

/* POST new router. */
router.post('/', async (req, res, next) => {
  const { errors, values } = validateRouter(req.body);

  try {
    if (errors.length > 0) {
      return await renderRouterList(req, res, 400, errors, values);
    }

    await routerRepository.createRouter({ userId: req.currentUser.id, nombre: values.nombre, direccionIp: values.direccionIp });
    setFlash(req, 'info', `Router "${values.nombre}" añadido.`);
    res.redirect(303, '/routers');
  } catch (error) {
    next(error);
  }
});

/* POST delete one of the current user's routers. */
router.post('/:routerId/eliminar', async (req, res, next) => {
  const routerId = parsePositiveId(req.params.routerId);

  try {
    const wasDeleted = routerId !== null && await routerRepository.deleteRouterOfUser(routerId, req.currentUser.id);
    setFlash(req, 'info', wasDeleted ? 'Router eliminado.' : 'Ese router no existe.');
    res.redirect(303, '/routers');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
