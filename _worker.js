// Importar las funciones API
import estadisticas_default from './functions/api/estadisticas.js';
import tickets_aleatorios_default from './functions/api/tickets-aleatorios.js';
import procesar_pago_default from './functions/api/procesar-pago.js';
import estadisticas_default2 from './functions/api/admin/estadisticas.js';
import tickets_vendidos_default from './functions/api/admin/tickets-vendidos.js';
import ordenes_default from './functions/api/admin/ordenes.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    console.log('📨 Request:', path);
    
    // Rutas API
    if (path.startsWith("/api/")) {
      if (path === "/api/estadisticas" && request.method === "GET") {
        return await estadisticas_default(env.DB);
      }
      if (path === "/api/tickets-aleatorios" && request.method === "POST") {
        const body = await request.json();
        return await tickets_aleatorios_default(env.DB, body);
      }
      if (path === "/api/procesar-pago" && request.method === "POST") {
        const body = await request.json();
        return await procesar_pago_default(env.DB, body);
      }
      if (path === "/api/admin/estadisticas" && request.method === "GET") {
        return await estadisticas_default2(env.DB);
      }
      if (path === "/api/admin/tickets-vendidos" && request.method === "GET") {
        return await tickets_vendidos_default(env.DB);
      }
      if (path === "/api/admin/ordenes" && request.method === "GET") {
        return await ordenes_default(env.DB);
      }
      return new Response("API route not found", { status: 404 });
    }
    
    // ARCHIVOS ESTÁTICOS - SERVIR DESDE PUBLIC/
    let filePath = path;
    
    // Si es la raíz, servir index.html
    if (path === '/') {
      filePath = '/index.html';
    }
    
    // Construir la URL correcta para los archivos en public/
    const staticUrl = new URL('/public' + filePath, 'https://example.com');
    
    // Headers para tipos de contenido
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css', 
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    
    const extension = filePath.match(/\.\w+$/)?.[0] || '';
    const contentType = mimeTypes[extension] || 'text/plain';
    
    try {
      // Intentar servir el archivo estático
      const response = await fetch(staticUrl);
      
      if (response.status === 200) {
        return new Response(response.body, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
    } catch (error) {
      console.error('Error serving static file:', error);
    }
    
    // Si no se encuentra, servir 404
    return new Response('Página no encontrada: ' + path, { 
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};