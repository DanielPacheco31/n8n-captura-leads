# Respuesta: workflow de n8n que desarrollé

> Ajusta los datos del resultado con lo que observes al probarlo en tu instancia.

**Qué proceso automatizaba**
La captura de solicitudes del formulario de contacto de SOMOSBITS_, mi marca de desarrollo web. Antes los mensajes llegaban a un correo y los pasaba a mano a una hoja; algunos se quedaban sin responder, se repetían registros y entraba spam.

**Qué sistemas, APIs o herramientas integraba**
Un formulario HTML que envía JSON a un Webhook de n8n; un nodo Code en JavaScript; Google Sheets como base de leads; Gmail para responder al cliente; la API de bots de Telegram para avisarme; y Respond to Webhook para devolverle el estado al formulario.

**Qué parte desarrollé personalmente**
Todo el flujo: diseñé los nodos y sus conexiones, escribí la validación en JavaScript (limpieza de HTML, normalización de celulares colombianos a +57, validación de email, honeypot contra bots), configuré el `appendOrUpdate` por email para evitar duplicados, el manejo de errores para que una notificación fallida no pierda el lead, y el formulario que lo consume. Dejé la lógica del nodo Code en un archivo aparte con pruebas unitarias y un script que la inyecta en el JSON del workflow, para versionarlo en GitHub.

**Resultado obtenido**
Cada solicitud queda registrada en segundos, sin copiar nada a mano y sin filas duplicadas; el cliente recibe confirmación inmediata y a mí me llega el aviso en Telegram. Los envíos inválidos o de bots se rechazan antes de tocar la hoja.

Repositorio: https://github.com/DanielPacheco31/n8n-captura-leads
