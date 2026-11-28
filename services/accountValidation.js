const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
// bcrypt ignores anything after the first 72 bytes of a password
const MAX_PASSWORD_BYTES = 72;

function readText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEmail(value) {
  return readText(value).toLowerCase();
}

function validateRegistration(body) {
  const nombre = readText(body?.nombre);
  const email = normalizeEmail(body?.email);
  const password = typeof body?.password === 'string' ? body.password : '';
  const passwordConfirmation = typeof body?.passwordConfirmation === 'string' ? body.passwordConfirmation : '';
  const errors = [];

  if (nombre.length === 0 || nombre.length > 60) {
    errors.push('Escribe un nombre de entre 1 y 60 caracteres.');
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    errors.push('Escribe un email válido.');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  } else if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) {
    errors.push('La contraseña es demasiado larga.');
  }
  if (password !== passwordConfirmation) {
    errors.push('Las contraseñas no coinciden.');
  }

  return { errors, values: { nombre, email, password } };
}

function readLoginForm(body) {
  return {
    email: normalizeEmail(body?.email),
    password: typeof body?.password === 'string' ? body.password : ''
  };
}

module.exports = { validateRegistration, readLoginForm };
