export default async function (db, body) {
  const { rifaId, tickets, nombre, telefono, email, metodoPago, comprobante, total } = body;

  const vendidos = await db.prepare(
    'SELECT COUNT(*) as count FROM tickets WHERE numero IN (' + tickets.map(() => '?').join(',') + ') AND vendido = 1'
  ).bind(...tickets).first();

  if (vendidos.count > 0) {
    return new Response(JSON.stringify({ success: false, error: 'Algunos tickets ya fueron vendidos' }));
  }

  const orden = await db.prepare(
    `INSERT INTO ordenes (nombre, telefono, email, metodo_pago, comprobante, tickets, total)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(nombre, telefono, email, metodoPago, comprobante, tickets.join(','), total).run();

  const ordenId = orden.meta.last_row_id;

  await db.prepare(
    'UPDATE tickets SET vendido = 1, orden_id = ? WHERE numero IN (' + tickets.map(() => '?').join(',') + ')'
  ).bind(ordenId, ...tickets).run();

  return new Response(JSON.stringify({
    success: true,
    orderId: ordenId
  }), { headers: { 'Content-Type': 'application/json' } });
}