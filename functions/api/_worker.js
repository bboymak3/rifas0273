// ---------- API functions ----------
import estadisticas from './estadisticas.js';
import ticketsAleatorios from './tickets-aleatorios.js';
import procesarPago from './procesar-pago.js';
import adminEstadisticas from './admin/estadisticas.js';
import adminTicketsVendidos from './admin/tickets-vendidos.js';
import adminOrdenes from './admin/ordenes.js';

// ---------- Worker completo (API + archivos estáticos) ----------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1) API routes
    if (path === '/api/estadisticas' && request.method === 'GET') {
      return await estadisticas(env.DB);
    }
    if (path === '/api/tickets-aleatorios' && request.method === 'POST') {
      const body = await request.json();
      return await ticketsAleatorios(env.DB, body);
    }
    if (path === '/api/procesar-pago' && request.method === 'POST') {
      const body = await request.json();
      return await procesarPago(env.DB, body);
    }
    if (path === '/api/admin/estadisticas' && request.method === 'GET') {
      return await adminEstadisticas(env.DB);
    }
    if (path === '/api/admin/tickets-vendidos' && request.method === 'GET') {
      return await adminTicketsVendidos(env.DB);
    }
    if (path === '/api/admin/ordenes' && request.method === 'GET') {
      return await adminOrdenes(env.DB);
    }

    // 2) Archivos estáticos (HTML, CSS, JS, imágenes) desde /public
    let filePath = path === '/' ? '/index.html' : path;
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    const ext = filePath.match(/\.\w+$/) ? filePath.match(/\.\w+$/)[0] : '';
    const contentType = mimeTypes[ext] || 'text/plain';

    // Busca en /public (tu carpeta real)
    try {
      const publicUrl = new URL('/public' + filePath, url);
      const file = await env.ASSETS.fetch(publicUrl);
      if (file.ok) {
        return new Response(file.body, { headers: { 'Content-Type': contentType } });
      }
    } catch (e) {}

    return new Response('Not Found', { status: 404 });
  }
};
