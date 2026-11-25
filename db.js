const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('Falta DATABASE_URL. Para probar en local, crea .env a partir de .env.example.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000
});

pool.on('error', (error) => {
  console.error('Error en una conexión inactiva de PostgreSQL', error);
});

module.exports = pool;
