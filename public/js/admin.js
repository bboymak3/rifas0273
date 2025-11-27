async function cargarPanelAdmin() {
  await cargarEstadisticas();
  await cargarTicketsVendidos();
  await cargarOrdenes();
}

async function cargarEstadisticas() {
  try {
    const response = await fetch('/api/admin/estadisticas');
    const data = await response.json();
    if (data.success) {
      document.getElementById('ticketsVendidos').textContent = data.data.vendidos.toLocaleString();
      document.getElementById('ticketsDisponibles').textContent = data.data.disponibles.toLocaleString();
      document.getElementById('totalRecaudado').textContent = `Bs. ${data.data.recaudado.toFixed(2)}`;
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
}

async function cargarTicketsVendidos() {
  try {
    const response = await fetch('/api/admin/tickets-vendidos');
    const data = await response.json();
    const tabla = document.getElementById('tablaTickets');
    tabla.innerHTML = '';
    if (data.success) {
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
  }
}

async function cargarOrdenes() {
  try {
    const response = await fetch('/api/admin/ordenes');
    const data = await response.json();
    const tabla = document.getElementById('tablaOrdenes');
    tabla.innerHTML = '';
    if (data.success) {
      data.data.ordenes.forEach(orden => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${orden.id}</td>
          <td>${orden.nombre}<br><small>${orden.telefono}</small></td>
          <td>${orden.tickets}</td>
          <td>Bs. ${orden.total}</td>
          <td><span class="badge bg-warning">${orden.estado}</span></td>
          <td>${new Date(orden.fecha).toLocaleString()}</td>
        `;
        tabla.appendChild(fila);
      });
    }
  } catch (error) {
    console.error('Error cargando órdenes:', error);
  }
}

document.addEventListener('DOMContentLoaded', cargarPanelAdmin);