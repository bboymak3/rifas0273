// Cargar estadísticas
async function cargarEstadisticas() {
  try {
    const response = await fetch('/admin/estadisticas');  // ← CORREGIDO
    const data = await response.json();
    
    if (data.success) {
      document.getElementById('ticketsVendidos').textContent = data.data.vendidos.toLocaleString();
      document.getElementById('ticketsDisponibles').textContent = data.data.disponibles.toLocaleString();
      document.getElementById('totalRecaudado').textContent = `Bs. ${(data.data.recaudado || 0).toFixed(2)}`;
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
    alert('Error cargando estadísticas');
  }
}

// Cargar tickets vendidos
async function cargarTicketsVendidos() {
  try {
    const response = await fetch('/admin/tickets-vendidos');  // ← CORREGIDO
    const data = await response.json();
    const tabla = document.getElementById('tablaTickets');
    
    if (data.success) {
      // ... resto del código igual
    }
  } catch (error) {
    // ... resto del código igual
  }
}

// Cargar órdenes
async function cargarOrdenes() {
  try {
    const response = await fetch('/admin/ordenes');  // ← CORREGIDO
    const data = await response.json();
    const tabla = document.getElementById('tablaOrdenes');
    
    if (data.success) {
      // ... resto del código igual
    }
  } catch (error) {
    // ... resto del código igual
  }
}