export default async function (db) {
  const ordenes = await db.prepare(`
    SELECT id, nombre, telefono, tickets, total, estado, fecha
    FROM ordenes
    ORDER BY fecha DESC
  `).all();

  return new Response(JSON.stringify({
    success: true,
    data: { ordenes: ordenes.results }
  }), { headers: { 'Content-Type': 'application/json' } });
}