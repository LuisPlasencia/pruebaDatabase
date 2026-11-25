const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const resultado = await db.query('SELECT id, titulo FROM tareas ORDER BY id DESC');
    res.render('tareas', { tareas: resultado.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const titulo = typeof req.body?.titulo === 'string' ? req.body.titulo.trim() : '';

  if (titulo.length === 0 || titulo.length > 120) {
    return res.status(400).render('error', {
      mensaje: 'Escribe un título de entre 1 y 120 caracteres.'
    });
  }

  try {
    await db.query('INSERT INTO tareas (titulo) VALUES ($1)', [titulo]);
    res.redirect(303, '/tareas');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
