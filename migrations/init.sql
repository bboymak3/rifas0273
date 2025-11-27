CREATE TABLE IF NOT EXISTS rifas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio_ticket REAL NOT NULL,
    total_tickets INTEGER NOT NULL,
    fecha_sorteo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero INTEGER UNIQUE NOT NULL,
    rifa_id INTEGER NOT NULL,
    vendido INTEGER DEFAULT 0,
    orden_id INTEGER
);

CREATE TABLE IF NOT EXISTS ordenes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT,
    metodo_pago TEXT NOT NULL,
    comprobante TEXT NOT NULL,
    tickets TEXT NOT NULL,
    total REAL NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    fecha TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO rifas (id, nombre, precio_ticket, total_tickets, fecha_sorteo)
VALUES (140, 'Rifa Moto 0KM', 499.00, 10000, '2025-12-31');

INSERT INTO tickets (numero, rifa_id)
WITH RECURSIVE nums(n) AS (
    SELECT 1
    UNION ALL
    SELECT n + 1 FROM nums WHERE n < 10000
)
SELECT n, 140 FROM nums;