// Cargar panel admin al iniciar
document.addEventListener('DOMContentLoaded', function() {
  cargarPanelAdmin();
});

// Cargar todo el panel
async function cargarPanelAdmin() {
  await cargarEstadisticas();
  await cargarTicketsVendidos();
  await cargarOrdenes();
}

// Cargar estadísticas
async function cargarEstadisticas() {
  try {
    const response = await fetch('/api/admin/estadisticas');
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
    const response = await fetch('/api/admin/tickets-vendidos');
    const data = await response.json();
    const tabla = document.getElementById('tablaTickets');
    
    if (data.success) {
      tabla.innerHTML = '';
      
      if (data.data.tickets.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" class="text-center">No hay tickets vendidos aún</td></tr>';
        return;
      }
      
      data.data.tickets.forEach(ticket => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td><strong>${ticket.numero}</strong></td>
          <td>${ticket.nombre || 'N/A'}</td>
          <td>${ticket.telefono}</td>
          <td>${new Date(ticket.fecha).toLocaleDateString()}</td>
          <td><span class="badge bg-success">Pagado</span></td>
        `;
        tabla.appendChild(fila);
      });
    }
  } catch (error) {
    console.error('Error cargando tickets:', error);
    document.getElementById('tablaTickets').innerHTML = 
      '<tr><td colspan="5" class="text-center text-danger">Error cargando tickets</td></tr>';
  }
}

// Cargar órdenes
async function cargarOrdenes() {
  try {
    const response = await fetch('/api/admin/ordenes');
    const data = await response.json();
    const tabla = document.getElementById('tablaOrdenes');
    
    if (data.success) {
      tabla.innerHTML = '';
      
      if (data.data.ordenes.length === 0) {
        tabla.innerHTML = '<tr><td colspan="7" class="text-center">No hay órdenes registradas</td></tr>';
        return;
      }
      
      data.data.ordenes.forEach(orden => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${orden.id}</td>
          <td>
            <strong>${orden.nombre}</strong><br>
            <small class="text-muted">${orden.email || 'Sin email'}</small>
          </td>
          <td>${orden.telefono}</td>
          <td>${orden.tickets}</td>
          <td>Bs. ${orden.total}</td>
          <td>
            <span class="badge ${orden.estado === 'pendiente' ? 'bg-warning' : 'bg-success'}">
              ${orden.estado}
            </span>
          </td>
          <td>${new Date(orden.fecha).toLocaleString()}</td>
        `;
        tabla.appendChild(fila);
      });
    }
  } catch (error) {
    console.error('Error cargando órdenes:', error);
    document.getElementById('tablaOrdenes').innerHTML = 
      '<tr><td colspan="7" class="text-center text-danger">Error cargando órdenes</td></tr>';
  }
}