export default async function (db) {
  try {
    const vendidos = await db.prepare('SELECT COUNT(*) as count FROM tickets WHERE vendido = 1').first();
    const ticketsVendidos = await db.prepare('SELECT numero FROM tickets WHERE vendido = 1').all();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          vendidos: vendidos.count,
          ticketsVendidos: ticketsVendidos.results.map(t => t.numero)
        }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
};