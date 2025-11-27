// functions/api/_worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // SOLO manejar APIs, TODO LO DEMÁS dejarlo pasar
    if (path.startsWith("/api/")) {
      // Aquí pones solo tus APIs
      if (path === "/api/estadisticas" && request.method === "GET") {
        // ... tu código de estadísticas
      }
      // ... otras APIs
    }
    
    // PARA TODO LO DEMÁS, no hacer nada
    return fetch(request);
  }
};