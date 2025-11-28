const CONFIG = { 
  precioTicket: 499.00, 
  rifaId: 140 
};

let estadoCompra = { 
  tickets: [], 
  cantidad: 0, 
  total: 0 
};

// Cuando carga la página
document.addEventListener('DOMContentLoaded', function () {
  cargarDatosCompra();
  configurarFormulario();
  configurarMetodoPago();
});

// Cargar datos de la compra desde la URL
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

// Generar números aleatorios (para compra rápida)
function generarNumerosAleatorios(cantidad) {
  const numeros = [];
  for (let i = 0; i < cantidad; i++) {
    numeros.push(Math.floor(Math.random() * 10000) + 1);
  }
  return numeros;
}

// Mostrar resumen de la compra
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

// Configurar cambio de método de pago
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

// Configurar envío del formulario
function configurarFormulario() {
  document.getElementById('formCompra').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validarFormulario()) return;
    await procesarPago();
  });
}

// Validar formulario
function validarFormulario() {
  const telefono = document.getElementById('telefono').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;

  if (!telefono || !nombre) {
    alert('⚠️ Completa todos los campos obligatorios');
    return false;
  }

  if (metodoPago === 'transferencia') {
    const comprobante = document.getElementById('comprobante').value.trim();
    if (!comprobante) {
      alert('⚠️ Ingresa el número de comprobante de transferencia');
      return false;
    }
  }

  if (metodoPago === 'pago_movil') {
    const referencia = document.getElementById('referencia').value.trim();
    if (!referencia) {
      alert('⚠️ Ingresa el número de referencia de pago móvil');
      return false;
    }
  }

  return true;
}

// Procesar el pago
async function procesarPago() {
  const formData = {
    rifaId: CONFIG.rifaId,
    tickets: estadoCompra.tickets,
    nombre: document.getElementById('nombre').value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    email: document.getElementById('email').value.trim() || '',
    metodoPago: document.querySelector('input[name="metodoPago"]:checked').value,
    comprobante: document.getElementById('comprobante').value || document.getElementById('referencia').value,
    total: estadoCompra.total
  };

  try {
    const btn = document.querySelector('#formCompra button[type="submit"]');
    btn.innerHTML = '🔄 PROCESANDO...';
    btn.disabled = true;

    const response = await fetch('/api/procesar-pago', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      // Redirigir a página de éxito
      window.location.href = `/compra-exitosa.html?order=${data.orderId}`;
    } else {
      alert('❌ Error: ' + data.error);
      btn.innerHTML = '✅ CONFIRMAR Y PROCESAR PAGO';
      btn.disabled = false;
    }
  } catch (error) {
    alert('❌ Error de conexión. Por favor, intenta nuevamente.');
    const btn = document.querySelector('#formCompra button[type="submit"]');
    btn.innerHTML = '✅ CONFIRMAR Y PROCESAR PAGO';
    btn.disabled = false;
  }
}