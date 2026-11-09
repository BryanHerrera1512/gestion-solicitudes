package com.gestionsolicitudes.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import com.gestionsolicitudes.model.ContactoSolicitud;

import reactor.core.publisher.Flux;

public interface ContactoSolicitudRepository
        extends ReactiveCrudRepository<ContactoSolicitud, Long> {

    Flux<ContactoSolicitud> findBySolicitudId(Long solicitudId);
}