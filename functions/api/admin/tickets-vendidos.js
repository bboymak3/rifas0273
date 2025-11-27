export default async function (db) {
  const tickets = await db.prepare(`
    SELECT t.numero, o.nombre, o.telefono, o.fecha
    FROM tickets t
    JOIN ordenes o ON t.orden_id = o.id
    WHERE t.vendido = 1
  `).all();

  return new Response(JSON.stringify({
    success: true,
    data: { tickets: tickets.results }
  }), { headers: { 'Content-Type': 'application/json' } });
}