const test = require('node:test');
const assert = require('node:assert');
const { validarLead, normalizarTelefono } = require('../src/validarLead');

const base = {
  nombre: '  Laura   Gómez ',
  email: 'Laura@Ejemplo.com',
  telefono: '300 123 4567',
  servicio: 'sitio-web',
  mensaje: 'Quiero una página para mi tienda de productos orgánicos.',
};

test('lead válido se normaliza', () => {
  const r = validarLead(base);
  assert.strictEqual(r.valido, true);
  assert.strictEqual(r.lead.nombre, 'Laura Gómez');
  assert.strictEqual(r.lead.email, 'laura@ejemplo.com');
  assert.strictEqual(r.lead.telefono, '+573001234567');
  assert.strictEqual(r.lead.estado, 'nuevo');
});

test('honeypot marca spam', () => {
  const r = validarLead({ ...base, website: 'http://spam.biz' });
  assert.deepStrictEqual(r.errores, ['spam']);
});

test('email y mensaje inválidos se reportan', () => {
  const r = validarLead({ ...base, email: 'sin-arroba', mensaje: 'hola' });
  assert.strictEqual(r.valido, false);
  assert.deepStrictEqual(r.errores, ['email', 'mensaje']);
});

test('quita HTML del mensaje', () => {
  const r = validarLead({ ...base, mensaje: '<script>x</script>Necesito un sistema de inventario' });
  assert.strictEqual(r.lead.mensaje, 'xNecesito un sistema de inventario');
});

test('servicio desconocido pasa a "otro"', () => {
  assert.strictEqual(validarLead({ ...base, servicio: 'hackeo' }).lead.servicio, 'otro');
});

test('teléfonos colombianos', () => {
  assert.strictEqual(normalizarTelefono('+57 310-555-1234'), '+573105551234');
  assert.strictEqual(normalizarTelefono('6011234567'), null);
});
