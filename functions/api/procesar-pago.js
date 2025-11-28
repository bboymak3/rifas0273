export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const { rifaId, tickets, nombre, telefono, email, metodoPago, comprobante, total } = body;

    // Usar la base de datos desde el environment
    const db = env.DB;

    const placeholders = tickets.map(() => '?').join(',');
    const vendidos = await db.prepare(
      `SELECT COUNT(*) as count FROM tickets WHERE numero IN (${placeholders}) AND vendido = 1`
    ).bind(...tickets).first();

    if (vendidos.count > 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Algunos tickets ya fueron vendidos' 
      }), { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      });
    }

    // INSERT corregido - agregar rifa_id
    const orden = await db.prepare(
      `INSERT INTO ordenes (rifa_id, nombre, telefono, email, metodo_pago, comprobante, tickets, total, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`
    ).bind(rifaId, nombre, telefono, email, metodoPago, comprobante, tickets.join(','), total).run();

    const ordenId = orden.meta.last_row_id;

    await db.prepare(
      `UPDATE tickets SET vendido = 1, orden_id = ? WHERE numero IN (${placeholders})`
    ).bind(ordenId, ...tickets).run();

    return new Response(JSON.stringify({
      success: true,
      orderId: ordenId
    }), { 
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      } 
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      } 
    });
  }
}