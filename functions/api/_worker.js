var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
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
    }
    
    // Archivos estáticos - DEJAR QUE [site] MANEJE ESTO
    return env.ASSETS.fetch(request);
  }
};

export { worker_default as default };