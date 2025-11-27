const CONFIG = { precioTicket: 499.00, rifaId: 140 };

let estadoCompra = { tickets: [], cantidad: 0, total: 0 };

document.addEventListener('DOMContentLoaded', function () {
  cargarDatosCompra();
  configurarFormulario();
  configurarMetodoPago();
});

function cargarDatosCompra() {
  const urlParams = new URLSearchParams(window.location.search);
  const cantidad = urlParams.get('q');
  const ticketsParam = urlParams.get('boletos');

  if (ticketsParam) {
    estadoCompra.tickets = ticketsParam.split(',').map(num => parseInt(num));
  } else if (cantidad) {
    estadoCompra.tickets = generarNumerosAleatorios(parseInt(cantidad));
  }

  estadoCompra.cantidad = estadoCompra.tickets.length;
  estadoCompra.total = estadoCompra.cantidad * CONFIG.precioTicket;
  mostrarResumenCompra();
}

function generarNumerosAleatorios(cantidad) {
  const numeros = [];
  for (let i = 0; i < cantidad; i++) {
    numeros.push(Math.floor(Math.random() * 10000) + 1);
  }
  return numeros;
}

function mostrarResumenCompra() {
  document.getElementById('cantidadResumen').textContent = estadoCompra.cantidad;
  document.getElementById('totalResumen').textContent = estadoCompra.total.toFixed(2);

  const ticketsResumen = document.getElementById('ticketsResumen');
  ticketsResumen.innerHTML = '';
  estadoCompra.tickets.forEach(numero => {
    const badge = document.createElement('span');
    badge.className = 'ticket-badge me-2 mb-2';
    badge.textContent = numero;
    ticketsResumen.appendChild(badge);
  });
}

function configurarMetodoPago() {
  const transferencia = document.getElementById('transferencia');
  const pagoMovil = document.getElementById('pagoMovil');
  const infoTransferencia = document.getElementById('infoTransferencia');
  const infoPagoMovil = document.getElementById('infoPagoMovil');

  transferencia.addEventListener('change', () => {
    infoTransferencia.style.display = 'block';
    infoPagoMovil.style.display = 'none';
  });

  pagoMovil.addEventListener('change', () => {
    infoTransferencia.style.display = 'none';
    infoPagoMovil.style.display = 'block';
  });
}

function configurarFormulario() {
  document.getElementById('formCompra').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validarFormulario()) return;
    await procesarPago();
  });
}

function validarFormulario() {
  const telefono = document.getElementById('telefono').value;
  const nombre = document.getElementById('nombre').value;
  const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;

  if (!telefono || !nombre) {
    alert('Completa todos los campos obligatorios');
    return false;
  }

  if (metodoPago === 'transferencia' && !document.getElementById('comprobante').value) {
    alert('Ingresa el número de comprobante');
    return false;
  }

  if (metodoPago === 'pago_movil' && !document.getElementById('referencia').value) {
    alert('Ingresa el número de referencia');
    return false;
  }

  return true;
}

async function procesarPago() {
  const formData = {
    rifaId: CONFIG.rifaId,
    tickets: estadoCompra.tickets,
    nombre: document.getElementById('nombre').value,
    telefono: document.getElementById('telefono').value,
    email: document.getElementById('email').value,
    metodoPago: document.querySelector('input[name="metodoPago"]:checked').value,
    comprobante: document.getElementById('comprobante').value || document.getElementById('referencia').value,
    total: estadoCompra.total
  };

  try {
    const btn = document.querySelector('#formCompra button[type="submit"]');
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> PROCESANDO...';
    btn.disabled = true;

    const response = await fetch('/api/procesar-pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = `/compra-exitosa.html?order=${data.orderId}`;
    } else {
      alert('❌ Error: ' + data.error);
      btn.innerHTML = '<i class="bi bi-check-circle"></i> CONFIRMAR Y PROCESAR PAGO';
      btn.disabled = false;
    }
  } catch (error) {
    alert('❌ Error de conexión');
    const btn = document.querySelector('#formCompra button[type="submit"]');
    btn.innerHTML = '<i class="bi bi-check-circle"></i> CONFIRMAR Y PROCESAR PAGO';
    btn.disabled = false;
  }
}