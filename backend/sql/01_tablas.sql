-- Guarda los datos principales de cada solicitud
CREATE TABLE solicitudes (
    codigo BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    tipo_solicitud VARCHAR(100) NOT NULL,
    fecha_envio DATE NOT NULL,
    numero_contacto VARCHAR(20) NOT NULL,
    nombre_contacto VARCHAR(150) NOT NULL,

    CHECK (numero_contacto ~ '^[0-9]+$')
);

-- Guarda los contactos asociados a cada solicitud
CREATE TABLE contactos_solicitud (
    identificador BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    solicitud_id BIGINT NOT NULL,
    nombre_contacto VARCHAR(150) NOT NULL,
    numero_contacto VARCHAR(20) NOT NULL,

    FOREIGN KEY (solicitud_id) REFERENCES solicitudes(codigo),
    CHECK (numero_contacto ~ '^[0-9]+$')
);