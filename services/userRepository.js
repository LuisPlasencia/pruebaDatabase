const db = require('../db');

const UNIQUE_VIOLATION_CODE = '23505';

class DuplicateEmailError extends Error {}

async function findUserById(userId) {
  const result = await db.query(
    'SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

async function findUserWithPasswordByEmail(email) {
  const result = await db.query(
    'SELECT id, nombre, email, rol, password_hash FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

async function createUser({ nombre, email, passwordHash }) {
  try {
    const result = await db.query(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [nombre, email, passwordHash]
    );
    return result.rows[0].id;
  } catch (error) {
    if (error.code === UNIQUE_VIOLATION_CODE) {
      throw new DuplicateEmailError('Ya existe una cuenta con ese email.');
    }
    throw error;
  }
}

async function listUsersWithRouterCount() {
  const result = await db.query(
    `SELECT u.id, u.nombre, u.email, u.rol, u.creado_en, COUNT(r.id)::int AS total_routers
     FROM usuarios u
     LEFT JOIN routers r ON r.usuario_id = u.id
     GROUP BY u.id
     ORDER BY u.creado_en DESC`
  );
  return result.rows;
}

async function deleteUserById(userId) {
  const result = await db.query('DELETE FROM usuarios WHERE id = $1', [userId]);
  return result.rowCount > 0;
}

module.exports = {
  DuplicateEmailError,
  findUserById,
  findUserWithPasswordByEmail,
  createUser,
  listUsersWithRouterCount,
  deleteUserById
};
