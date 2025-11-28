import estadisticas from './estadisticas.js';
import ticketsAleatorios from './tickets-aleatorios.js';
import procesarPago from './procesar-pago.js';
import adminEstadisticas from './admin/estadisticas.js';
import adminTicketsVendidos from './admin/tickets-vendidos.js';
import adminOrdenes from './admin/ordenes.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
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

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};