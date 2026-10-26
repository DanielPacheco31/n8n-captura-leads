// Genera workflow/captura-leads.json inyectando src/validarLead.js en el nodo Code.
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const plantilla = JSON.parse(fs.readFileSync(path.join(raiz, 'workflow/plantilla.json'), 'utf8'));
const logica = fs
  .readFileSync(path.join(raiz, 'src/validarLead.js'), 'utf8')
  .replace(/\nif \(typeof module[^\n]*\n?/, '\n');

const codigoNodo = `${logica}
// --- Ejecución en n8n ---
return $input.all().map(item => ({
  json: validarLead(item.json.body ?? item.json),
}));
`;

const nodo = plantilla.nodes.find(n => n.name === 'Validar y normalizar');
nodo.parameters.jsCode = codigoNodo;

fs.writeFileSync(path.join(raiz, 'workflow/captura-leads.json'), JSON.stringify(plantilla, null, 2) + '\n');
console.log('workflow/captura-leads.json generado');
