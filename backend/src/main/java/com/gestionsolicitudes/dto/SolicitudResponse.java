package com.gestionsolicitudes.dto;

import java.time.LocalDate;
import java.util.List;

import com.gestionsolicitudes.model.ContactoSolicitud;

public record SolicitudResponse(
        Long codigo,
        String marca,
        String tipoSolicitud,
        LocalDate fechaEnvio,
        String numeroContacto,
        String nombreContacto,
        List<ContactoSolicitud> contactos
) {
}