package com.gestionsolicitudes.service;

import java.time.LocalDate;
import java.util.Set;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.gestionsolicitudes.dto.SolicitudRequest;
import com.gestionsolicitudes.dto.SolicitudResponse;
import com.gestionsolicitudes.model.ContactoSolicitud;
import com.gestionsolicitudes.model.Solicitud;
import com.gestionsolicitudes.repository.ContactoSolicitudRepository;
import com.gestionsolicitudes.repository.SolicitudConsultaRepository;
import com.gestionsolicitudes.repository.SolicitudRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final ContactoSolicitudRepository contactoRepository;
    private final SolicitudConsultaRepository consultaRepository;

    public SolicitudService(
            SolicitudRepository solicitudRepository,
            ContactoSolicitudRepository contactoRepository,
            SolicitudConsultaRepository consultaRepository) {
        this.solicitudRepository = solicitudRepository;
        this.contactoRepository = contactoRepository;
        this.consultaRepository = consultaRepository;
    }

    @Transactional
    public Mono<Solicitud> registrar(SolicitudRequest request) {
        Solicitud solicitud = new Solicitud();
        solicitud.setMarca(request.getMarca());
        solicitud.setTipoSolicitud(request.getTipoSolicitud());
        solicitud.setFechaEnvio(request.getFechaEnvio());
        solicitud.setNumeroContacto(request.getNumeroContacto());
        solicitud.setNombreContacto(request.getNombreContacto());

        return solicitudRepository.save(solicitud)
                .flatMap(guardada ->
                    Flux.fromIterable(request.getContactos())
                            .concatMap(datos -> {
                                ContactoSolicitud contacto =
                                        new ContactoSolicitud();

                                // Se usara el codigo autogenerado de PostgreSQL
                                contacto.setSolicitudId(guardada.getCodigo());
                                contacto.setNombreContacto(
                                        datos.getNombreContacto());
                                contacto.setNumeroContacto(
                                        datos.getNumeroContacto());

                                return contactoRepository.save(contacto);
                            })
                            .then(Mono.just(guardada))
                );
    }

    public Flux<SolicitudResponse> listar(
            LocalDate fecha,
            String tipoSolicitud,
            String ordenarPor,
            String direccion) {

        // Solo permitimos ordenar por campos de la solicitud
        Set<String> camposPermitidos = Set.of(
                "codigo",
                "marca",
                "tipoSolicitud",
                "fechaEnvio",
                "numeroContacto",
                "nombreContacto"
        );

        if (!camposPermitidos.contains(ordenarPor)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El campo de ordenamiento no es valido");
        }

        if (!"asc".equalsIgnoreCase(direccion)
                && !"desc".equalsIgnoreCase(direccion)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La direccion debe ser asc o desc");
        }

        Sort orden = Sort.by(
                Sort.Direction.fromString(direccion),
                ordenarPor
        );

        // Si hay valores iguales los ordenamos tambien por codigo
        if (!"codigo".equals(ordenarPor)) {
            orden = orden.and(Sort.by("codigo"));
        }

        return consultaRepository.listar(fecha, tipoSolicitud, orden)
                // Conservamos el orden al consultar los contactos
                .concatMap(this::crearRespuesta);
    }

    public Mono<SolicitudResponse> consultarPorCodigo(Long codigo) {
        return solicitudRepository.findById(codigo)
                .switchIfEmpty(Mono.error(new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe una solicitud con el codigo " + codigo)))
                .flatMap(this::crearRespuesta);
    }

    // El listado y el detalle comparten la misma respuesta con contactos
    private Mono<SolicitudResponse> crearRespuesta(Solicitud solicitud) {
        return contactoRepository.findBySolicitudId(solicitud.getCodigo())
                .collectList()
                .map(contactos -> new SolicitudResponse(
                        solicitud.getCodigo(),
                        solicitud.getMarca(),
                        solicitud.getTipoSolicitud(),
                        solicitud.getFechaEnvio(),
                        solicitud.getNumeroContacto(),
                        solicitud.getNombreContacto(),
                        contactos
                ));
    }
}