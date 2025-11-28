const CONFIG = {
  precioTicket: 499.00,
  totalTickets: 10000,
  ticketsPorPagina: 100,
  rifaId: 140
};

let estado = {
  ticketsSeleccionados: new Set(),
  ticketsVendidos: new Set(),
  paginaActual: 1,
  totalPaginas: Math.ceil(CONFIG.totalTickets / CONFIG.ticketsPorPagina)
};

// Cuando carga la página
document.addEventListener('DOMContentLoaded', function () {
  cargarEstadisticas();
  configurarBusqueda();
});

// Cargar estadísticas desde la API
async function cargarEstadisticas() {
  try {
    const response = await fetch('/api/estadisticas');
    const data = await response.json();
    
    if (data.success) {
      actualizarUIEstadisticas(data.data);
      estado.ticketsVendidos = new Set(data.data.ticketsVendidos);
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
    // Si falla la API, usar datos por defecto
    actualizarUIEstadisticas({ vendidos: 0, ticketsVendidos: [] });
  }
}

// Actualizar la barra de progreso
function actualizarUIEstadisticas(data) {
  const porcentaje = (data.vendidos / CONFIG.totalTickets) * 100;
  document.getElementById('progressFill').style.width = `${porcentaje}%`;
  document.getElementById('progressText').textContent = `${porcentaje.toFixed(1)}% VENDIDO`;
  document.getElementById('soldTickets').textContent = data.vendidos.toLocaleString();
  document.getElementById('totalTickets').textContent = CONFIG.totalTickets.toLocaleString();
}

// Abrir el modal de selección de números
function abrirSelectorNumeros() {
  estado.ticketsSeleccionados.clear();
  actualizarUISeleccion();
  cargarNumerosPagina(1);
  const modal = new bootstrap.Modal(document.getElementById('numerosModal'));
  modal.show();
}

// Cargar números por página
function cargarNumerosPagina(pagina) {
  estado.paginaActual = pagina;
  const grid = document.getElementById('numerosGrid');
  grid.innerHTML = '';
  
  const inicio = (pagina - 1) * CONFIG.ticketsPorPagina + 1;
  const fin = Math.min(pagina * CONFIG.ticketsPorPagina, CONFIG.totalTickets);

  for (let i = inicio; i <= fin; i++) {
    const div = document.createElement('div');
    div.className = 'numero-item';
    div.textContent = i;
    div.dataset.numero = i;

    if (estado.ticketsVendidos.has(i)) {
      div.classList.add('vendido');
      div.title = '❌ Vendido';
    } else {
      div.addEventListener('click', () => toggleSeleccionNumero(i));
    }

    if (estado.ticketsSeleccionados.has(i)) {
      div.classList.add('selected');
    }

    grid.appendChild(div);
  }

  actualizarPaginacion();
}

// Alternar selección de número
function toggleSeleccionNumero(numero) {
  if (estado.ticketsSeleccionados.has(numero)) {
    estado.ticketsSeleccionados.delete(numero);
  } else {
    estado.ticketsSeleccionados.add(numero);
  }
  actualizarUISeleccion();
  cargarNumerosPagina(estado.paginaActual);
}

// Actualizar la UI de selección
function actualizarUISeleccion() {
  const selectedCount = estado.ticketsSeleccionados.size;
  const total = selectedCount * CONFIG.precioTicket;

  // Actualizar resumen en modal
  document.getElementById('selectedCount').textContent = selectedCount;
  document.getElementById('selectedTotal').textContent = total.toFixed(2);

  const selectedList = document.getElementById('selectedNumbersList');
  selectedList.innerHTML = '';

  Array.from(estado.ticketsSeleccionados).sort((a, b) => a - b).forEach(numero => {
    const badge = document.createElement('span');
    badge.className = 'ticket-badge';
    badge.textContent = numero;
    selectedList.appendChild(badge);
  });

  // Actualizar contenedor principal
  const container = document.getElementById('selectedTicketsContainer');
  const ticketsDisplay = document.getElementById('selectedTickets');

  if (selectedCount > 0) {
    container.style.display = 'block';
    ticketsDisplay.innerHTML = '';
    
    Array.from(estado.ticketsSeleccionados).sort((a, b) => a - b).forEach(numero => {
      const badge = document.createElement('span');
      badge.className = 'ticket-badge';
      badge.textContent = numero;
      ticketsDisplay.appendChild(badge);
    });
    
    document.getElementById('totalTicketsCount').textContent = selectedCount;
    document.getElementById('totalPrice').textContent = total.toFixed(2);
  } else {
    container.style.display = 'none';
  }
}

// Actualizar paginación
function actualizarPaginacion() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  // Botón anterior
  if (estado.paginaActual > 1) {
    const li = document.createElement('li');
    li.className = 'page-item';
    li.innerHTML = `<a class="page-link" href="#" onclick="cargarNumerosPagina(${estado.paginaActual - 1})">← Anterior</a>`;
    pagination.appendChild(li);
  }

  // Números de página
  const paginasAMostrar = 5;
  let inicioPagina = Math.max(1, estado.paginaActual - Math.floor(paginasAMostrar / 2));
  let finPagina = Math.min(estado.totalPaginas, inicioPagina + paginasAMostrar - 1);

  for (let i = inicioPagina; i <= finPagina; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === estado.paginaActual ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#" onclick="cargarNumerosPagina(${i})">${i}</a>`;
    pagination.appendChild(li);
  }

  // Botón siguiente
  if (estado.paginaActual < estado.totalPaginas) {
    const li = document.createElement('li');
    li.className = 'page-item';
    li.innerHTML = `<a class="page-link" href="#" onclick="cargarNumerosPagina(${estado.paginaActual + 1})">Siguiente →</a>`;
    pagination.appendChild(li);
  }
}

// Configurar búsqueda
function configurarBusqueda() {
  const input = document.getElementById('buscarNumero');
  input.addEventListener('input', function () {
    const numero = parseInt(this.value);
    if (numero >= 1 && numero <= CONFIG.totalTickets) {
      const pagina = Math.ceil(numero / CONFIG.ticketsPorPagina);
      cargarNumerosPagina(pagina);
    }
  });
}

// Confirmar selección
function confirmarSeleccion() {
  if (estado.ticketsSeleccionados.size === 0) {
    alert('⚠️ Por favor selecciona al menos un número');
    return;
  }
  const modal = bootstrap.Modal.getInstance(document.getElementById('numerosModal'));
  modal.hide();
}

// Limpiar selección
function limpiarSeleccion() {
  estado.ticketsSeleccionados.clear();
  actualizarUISeleccion();
  cargarNumerosPagina(estado.paginaActual);
}

// Ir a página de compra
function irAPaginaCompra(event) {
  event.preventDefault();
  if (estado.ticketsSeleccionados.size === 0) {
    alert('⚠️ Por favor selecciona al menos un número');
    return;
  }
  const tickets = Array.from(estado.ticketsSeleccionados).sort((a, b) => a - b);
  const cantidad = tickets.length;
  const url = `/compra.html?q=${cantidad}&boletos=${tickets.join(',')}&raffle_id=${CONFIG.rifaId}`;
  window.location.href = url;
}