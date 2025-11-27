// functions/api/_worker.js
import estadisticas_default from './estadisticas.js';
import tickets_aleatorios_default from './tickets-aleatorios.js';
import procesar_pago_default from './procesar-pago.js';
import estadisticas_default2 from './admin/estadisticas.js';
import tickets_vendidos_default from './admin/tickets-vendidos.js';
import ordenes_default from './admin/ordenes.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    console.log('📨 Request:', path);
    
    // 1. Rutas API - DEJAR ESTAS INTACTAS
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
    
    // 2. ✅ SOLUCIÓN SIMPLE - DEJAR QUE PAGES MANEJE TODO LO DEMÁS
    // NO INTERCEPTAR archivos estáticos, CSS, JS, etc.
    // Pages automáticamente sirve desde /public
    return fetch(request);
  }
};