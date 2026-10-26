/**
 * Lógica del nodo Code "Validar y normalizar lead".
 * Se mantiene en un archivo aparte para poder probarla con Node
 * y luego inyectarla en el workflow con `npm run build`.
 */

const SERVICIOS = ['sitio-web', 'sistema-a-medida', 'soporte', 'otro'];

function limpiarTexto(valor, max = 500) {
  return String(valor ?? '')
    .replace(/<[^>]*>/g, '')      // quita etiquetas HTML
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function normalizarTelefono(valor) {
  let digitos = String(valor ?? '').replace(/\D/g, '');
  if (digitos.startsWith('57') && digitos.length === 12) digitos = digitos.slice(2);
  // Celular colombiano: 10 dígitos y empieza por 3
  if (/^3\d{9}$/.test(digitos)) return `+57${digitos}`;
  return null;
}

function validarLead(body = {}) {
  const errores = [];

  // Honeypot: campo oculto del formulario que solo llenan los bots
  if (limpiarTexto(body.website)) {
    return { valido: false, errores: ['spam'], lead: null };
  }

  const nombre = limpiarTexto(body.nombre, 80);
  const email = limpiarTexto(body.email, 120).toLowerCase();
  const telefono = normalizarTelefono(body.telefono);
  const servicio = SERVICIOS.includes(body.servicio) ? body.servicio : 'otro';
  const mensaje = limpiarTexto(body.mensaje, 1000);

  if (nombre.length < 2) errores.push('nombre');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errores.push('email');
  if (body.telefono && !telefono) errores.push('telefono');
  if (mensaje.length < 10) errores.push('mensaje');

  return {
    valido: errores.length === 0,
    errores,
    lead: errores.length ? null : {
      fecha: new Date().toISOString(),
      nombre,
      email,
      telefono: telefono ?? '',
      servicio,
      mensaje,
      origen: limpiarTexto(body.origen, 60) || 'landing',
      estado: 'nuevo',
    },
  };
}

if (typeof module !== 'undefined') module.exports = { validarLead, normalizarTelefono };
