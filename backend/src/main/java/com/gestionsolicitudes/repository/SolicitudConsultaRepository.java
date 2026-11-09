package com.gestionsolicitudes.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Sort;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.relational.core.query.Query;
import org.springframework.stereotype.Repository;

import com.gestionsolicitudes.model.Solicitud;

import reactor.core.publisher.Flux;

@Repository
public class SolicitudConsultaRepository {

    private final R2dbcEntityTemplate template;

    public SolicitudConsultaRepository(R2dbcEntityTemplate template) {
        this.template = template;
    }

    public Flux<Solicitud> listar(
            LocalDate fecha,
            String tipoSolicitud,
            Sort orden) {

        Criteria criterios = Criteria.empty();

        // Solo aplicamos los filtros que llegaron en la consulta
        if (fecha != null) {
            criterios = criterios.and("fechaEnvio").is(fecha);
        }

        if (tipoSolicitud != null && !tipoSolicitud.isBlank()) {
            criterios = criterios.and("tipoSolicitud")
                    .is(tipoSolicitud.trim());
        }

        Query consulta = Query.query(criterios).sort(orden);

        return template.select(consulta, Solicitud.class);
    }
}