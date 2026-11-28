const express = require('express');
const { validateRegistration, readLoginForm } = require('../services/accountValidation');
const { hashPassword, verifyPassword } = require('../services/passwordHasher');
const userRepository = require('../services/userRepository');
const { startUserSession, endUserSession } = require('../services/userSession');
const { setFlash } = require('../middleware/flashMessages');

const router = express.Router();

function renderRegistration(res, statusCode, errors, values) {
  res.status(statusCode).render('registro', {
    title: 'Crear cuenta | Trabajo de TARCE',
    currentPage: 'registro',
    errors,
    values
  });
}

function renderLogin(res, statusCode, errors, values) {
  res.status(statusCode).render('login', {
    title: 'Iniciar sesión | Trabajo de TARCE',
    currentPage: 'login',
    errors,
    values
  });
}

/* GET registration page. */
router.get('/registro', (req, res) => {
  if (req.currentUser) {
    return res.redirect('/perfil');
  }
  renderRegistration(res, 200, [], {});
});

/* POST new account. */
router.post('/registro', async (req, res, next) => {
  const { errors, values } = validateRegistration(req.body);
  // The password is never sent back to the form
  const formValues = { nombre: values.nombre, email: values.email };

  if (errors.length > 0) {
    return renderRegistration(res, 400, errors, formValues);
  }

  try {
    const passwordHash = await hashPassword(values.password);
    const userId = await userRepository.createUser({ nombre: values.nombre, email: values.email, passwordHash });
    await startUserSession(req, userId);
    setFlash(req, 'info', `Cuenta creada. Bienvenido, ${values.nombre}.`);
    res.redirect(303, '/perfil');
  } catch (error) {
    if (error instanceof userRepository.DuplicateEmailError) {
      return renderRegistration(res, 400, [error.message], formValues);
    }
    next(error);
  }
});

/* GET login page. */
router.get('/login', (req, res) => {
  if (req.currentUser) {
    return res.redirect('/perfil');
  }
  renderLogin(res, 200, [], {});
});

/* POST login credentials. */
router.post('/login', async (req, res, next) => {
  const { email, password } = readLoginForm(req.body);

  try {
    const user = await userRepository.findUserWithPasswordByEmail(email);
    const isPasswordCorrect = user ? await verifyPassword(password, user.password_hash) : false;

    // Same message whether the email or the password is wrong, so the form does not reveal which emails exist
    if (!isPasswordCorrect) {
      return renderLogin(res, 401, ['Email o contraseña incorrectos.'], { email });
    }

    await startUserSession(req, user.id);
    res.redirect(303, '/perfil');
  } catch (error) {
    next(error);
  }
});

/* POST logout. */
router.post('/logout', async (req, res, next) => {
  try {
    await endUserSession(req);
    res.redirect(303, '/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
