const { isIP } = require('net');

function validateRouter(body) {
  const nombre = typeof body?.nombre === 'string' ? body.nombre.trim() : '';
  const direccionIp = typeof body?.direccionIp === 'string' ? body.direccionIp.trim() : '';
  const errors = [];

  if (nombre.length === 0 || nombre.length > 60) {
    errors.push('Escribe un nombre de router de entre 1 y 60 caracteres.');
  }
  if (isIP(direccionIp) === 0) {
    errors.push('Escribe una dirección IPv4 o IPv6 válida, por ejemplo 192.168.1.1.');
  }

  return { errors, values: { nombre, direccionIp } };
}

module.exports = { validateRouter };
