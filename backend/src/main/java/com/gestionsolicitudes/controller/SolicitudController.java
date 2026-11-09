package com.gestionsolicitudes.controller;

import java.net.URI;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestionsolicitudes.dto.SolicitudRequest;
import com.gestionsolicitudes.dto.SolicitudResponse;
import com.gestionsolicitudes.model.Solicitud;
import com.gestionsolicitudes.service.SolicitudCsvService;
import com.gestionsolicitudes.service.SolicitudService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/solicitudes")
@Tag(
        name = "Solicitudes",
        description = "Operaciones disponibles para las solicitudes"
)
public class SolicitudController {

    private final SolicitudService solicitudService;
    private final SolicitudCsvService csvService;

    public SolicitudController(
            SolicitudService solicitudService,
            SolicitudCsvService csvService) {
        this.solicitudService = solicitudService;
        this.csvService = csvService;
    }

    @PostMapping
    @Operation(summary = "Registrar una solicitud")
    public Mono<ResponseEntity<Solicitud>> registrar(
            @Valid @RequestBody SolicitudRequest request) {

        return solicitudService.registrar(request)
                .map(solicitud -> ResponseEntity
                        .created(URI.create(
                                "/api/solicitudes/" + solicitud.getCodigo()))
                        .body(solicitud));
    }

    @GetMapping
    @Operation(summary = "Listar, filtrar y ordenar solicitudes")
    public Flux<SolicitudResponse> listar(
            @RequestParam(name = "fecha", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fecha,

            @RequestParam(name = "tipoSolicitud", required = false)
            String tipoSolicitud,

            @RequestParam(name = "ordenarPor", defaultValue = "codigo")
            String ordenarPor,

            @RequestParam(name = "direccion", defaultValue = "asc")
            String direccion) {

        return solicitudService.listar(
                fecha, tipoSolicitud, ordenarPor, direccion);
    }

    @GetMapping("/exportar")
    @Operation(summary = "Exportar solicitudes en formato CSV")
    public Mono<ResponseEntity<byte[]>> exportar(
            @RequestParam(name = "fecha", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fecha,

            @RequestParam(name = "tipoSolicitud", required = false)
            String tipoSolicitud,

            @RequestParam(name = "ordenarPor", defaultValue = "codigo")
            String ordenarPor,

            @RequestParam(name = "direccion", defaultValue = "asc")
            String direccion) {

        return csvService.exportar(
                        fecha, tipoSolicitud, ordenarPor, direccion)
                .map(archivo -> ResponseEntity.ok()
                        .header(
                                HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=solicitudes.csv")
                        .contentType(MediaType.parseMediaType(
                                "text/csv;charset=UTF-8"))
                        .body(archivo));
    }

    @GetMapping("/{codigo}")
    @Operation(summary = "Consultar una solicitud por su codigo")
    public Mono<SolicitudResponse> consultarPorCodigo(
            @PathVariable("codigo") Long codigo) {

        return solicitudService.consultarPorCodigo(codigo);
    }
}