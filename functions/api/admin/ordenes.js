export default async function (db) {
  try {
    const ordenes = await db.prepare(`
      SELECT id, nombre, telefono, tickets, total, estado, fecha
      FROM ordenes
      ORDER BY fecha DESC
    `).all();

    return new Response(JSON.stringify({
      success: true,
      data: { ordenes: ordenes.results }
    }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}