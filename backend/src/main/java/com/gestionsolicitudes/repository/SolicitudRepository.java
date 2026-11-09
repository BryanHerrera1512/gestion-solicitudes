package com.gestionsolicitudes.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;

import com.gestionsolicitudes.model.Solicitud;

public interface SolicitudRepository
        extends R2dbcRepository<Solicitud, Long> {
}