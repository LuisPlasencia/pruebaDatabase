const db = require('../db');

async function listRoutersByUser(userId) {
  const result = await db.query(
    'SELECT id, nombre, direccion_ip, creado_en FROM routers WHERE usuario_id = $1 ORDER BY creado_en DESC',
    [userId]
  );
  return result.rows;
}

async function countRoutersByUser(userId) {
  const result = await db.query('SELECT COUNT(*)::int AS total FROM routers WHERE usuario_id = $1', [userId]);
  return result.rows[0].total;
}

async function createRouter({ userId, nombre, direccionIp }) {
  await db.query(
    'INSERT INTO routers (usuario_id, nombre, direccion_ip) VALUES ($1, $2, $3)',
    [userId, nombre, direccionIp]
  );
}

// The user id is part of the condition so nobody can delete another user's router
async function deleteRouterOfUser(routerId, userId) {
  const result = await db.query('DELETE FROM routers WHERE id = $1 AND usuario_id = $2', [routerId, userId]);
  return result.rowCount > 0;
}

module.exports = { listRoutersByUser, countRoutersByUser, createRouter, deleteRouterOfUser };
