const session = require('express-session');
const PgSessionStore = require('connect-pg-simple')(session);
const db = require('../db');

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

function createSessionMiddleware() {
  if (!process.env.SESSION_SECRET) {
    throw new Error('Falta SESSION_SECRET. Añádela a .env en local y a las variables de entorno del servicio en Render.');
  }

  return session({
    // Sessions live in PostgreSQL so they survive server restarts on Render
    store: new PgSessionStore({ pool: db, tableName: 'session' }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      // 'auto' sends the cookie only over HTTPS when the request arrived over HTTPS (Render), and also allows plain HTTP in local
      secure: 'auto',
      maxAge: ONE_WEEK_IN_MS
    }
  });
}

module.exports = { createSessionMiddleware };
