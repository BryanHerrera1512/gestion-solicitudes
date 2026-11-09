BEGIN;

-- Solicitud de Ana con dos contactos
WITH nueva_solicitud AS (
    INSERT INTO solicitudes (
        marca, tipo_solicitud, fecha_envio,
        numero_contacto, nombre_contacto
    )
    VALUES (
        'Samsung', 'Consulta', '2026-11-01',
        '987654321', 'Ana Torres'
    )
    RETURNING codigo
)
INSERT INTO contactos_solicitud (
    solicitud_id, nombre_contacto, numero_contacto
)
SELECT codigo, 'Luis Perez', '912345678'
FROM nueva_solicitud
UNION ALL
SELECT codigo, 'Maria Lopez', '923456789'
FROM nueva_solicitud;

-- Solicitud de Carlos sin contactos adicionales
INSERT INTO solicitudes (
    marca, tipo_solicitud, fecha_envio,
    numero_contacto, nombre_contacto
)
VALUES (
    'LG', 'Reclamo', '2026-11-02',
    '934567890', 'Carlos Ruiz'
);

COMMIT;