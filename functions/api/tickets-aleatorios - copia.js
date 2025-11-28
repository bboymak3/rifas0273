export default async function (db, body) {
  const { rifaId, cantidad } = body;

  try {
    const disponibles = await db.prepare(
      'SELECT numero FROM tickets WHERE rifa_id = ? AND vendido = 0 LIMIT ?'
    ).bind(rifaId, cantidad).all();

    if (disponibles.results.length < cantidad) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No hay suficientes tickets disponibles' 
      }), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const tickets = disponibles.results.map(t => t.numero);

    return new Response(JSON.stringify({
      success: true,
      tickets
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