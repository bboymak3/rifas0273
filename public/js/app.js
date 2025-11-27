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

document.addEventListener('DOMContentLoaded', function () {
  cargarEstadisticas();
  configurarBusqueda();
});

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
  }
}

function actualizarUIEstadisticas(data) {
  const porcentaje = (data.vendidos / CONFIG.totalTickets) * 100;
  document.getElementById('progressFill').style.width = `${porcentaje}%`;
  document.getElementById('progressText').textContent = `${porcentaje.toFixed(1)}% VENDIDO`;
  document.getElementById('soldTickets').textContent = data.vendidos.toLocaleString();
  document.getElementById('totalTickets').textContent = CONFIG.totalTickets.toLocaleString();
}

function abrirSelectorNumeros() {
  estado.ticketsSeleccionados.clear();
  actualizarUISeleccion();
  cargarNumerosPagina(1);
  const modal = new bootstrap.Modal(document.getElementById('numerosModal'));
  modal.show();
}

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
      div.title = 'Vendido';
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

function toggleSeleccionNumero(numero) {
  if (estado.ticketsSeleccionados.has(numero)) {
    estado.ticketsSeleccionados.delete(numero);
  } else {
    estado.ticketsSeleccionados.add(numero);
  }
  actualizarUISeleccion();
  cargarNumerosPagina(estado.paginaActual);
}

function actualizarUISeleccion() {
  const selectedCount = estado.ticketsSeleccionados.size;
  const total = selectedCount * CONFIG.precioTicket;

  document.getElementById('selectedCount').textContent = selectedCount;
  document.getElementById('selectedTotal').textContent = total.toFixed(2);

  const selectedList = document.getElementById('selectedNumbersList');
  selectedList.innerHTML = '';

  Array.from(estado.ticketsSeleccionados).sort((a, b) => a - b).forEach(numero => {
    const badge = document.createElement('span');
    badge.className = 'ticket-badge me-2 mb-2';
    badge.textContent = numero;
    selectedList.appendChild(badge);
  });

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

function actualizarPaginacion() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  if (estado.paginaActual > 1) {
    const li = document.createElement('li');
    li.className = 'page-item';
    li.innerHTML = `<a class="page-link" href="#" onclick="cargarNumerosPagina(${estado.paginaActual - 1})">Anterior</a>`;
    pagination.appendChild(li);
  }

  for (let i = 1; i <= estado.totalPaginas; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === estado.paginaActual ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#" onclick="cargarNumerosPagina(${i})">${i}</a>`;
    pagination.appendChild(li);
  }

  if (estado.paginaActual < estado.totalPaginas) {
    const li = document.createElement('li');
    li.className = 'page-item';
    li.innerHTML = `<a class="page-link" href="#" onclick="cargarNumerosPagina(${estado.paginaActual + 1})">Siguiente</a>`;
    pagination.appendChild(li);
  }
}

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

function confirmarSeleccion() {
  if (estado.ticketsSeleccionados.size === 0) {
    alert('Por favor selecciona al menos un número');
    return;
  }
  const modal = bootstrap.Modal.getInstance(document.getElementById('numerosModal'));
  modal.hide();
}

function irAPaginaCompra(event) {
  event.preventDefault();
  if (estado.ticketsSeleccionados.size === 0) {
    alert('Por favor selecciona al menos un número');
    return;
  }
  const tickets = Array.from(estado.ticketsSeleccionados).sort((a, b) => a - b);
  const cantidad = tickets.length;
  const url = `/compra.html?q=${cantidad}&boletos=${tickets.join(',')}&raffle_id=${CONFIG.rifaId}`;
  window.location.href = url;
}