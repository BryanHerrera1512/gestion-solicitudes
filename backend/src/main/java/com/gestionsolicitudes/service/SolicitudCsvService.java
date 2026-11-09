package com.gestionsolicitudes.service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.gestionsolicitudes.dto.SolicitudResponse;
import com.gestionsolicitudes.model.ContactoSolicitud;

import reactor.core.publisher.Mono;

@Service
public class SolicitudCsvService {

    private final SolicitudService solicitudService;

    public SolicitudCsvService(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    public Mono<byte[]> exportar(
            LocalDate fecha,
            String tipoSolicitud,
            String ordenarPor,
            String direccion) {

        return solicitudService
                .listar(fecha, tipoSolicitud, ordenarPor, direccion)
                .collectList()
                .map(solicitudes -> {
                    StringBuilder csv = new StringBuilder();

                    csv.append(
                            "codigo,marca,tipo_solicitud,fecha_envio,"
                            + "numero_contacto,nombre_contacto,"
                            + "identificador_contacto,nombre_contacto_adicional,"
                            + "numero_contacto_adicional\r\n");

                    for (SolicitudResponse solicitud : solicitudes) {
                        if (solicitud.contactos().isEmpty()) {
                            agregarFila(csv, solicitud, null);
                        } else {
                            // Cada contacto ocupa una fila de la solicitud
                            for (ContactoSolicitud contacto : solicitud.contactos()) {
                                agregarFila(csv, solicitud, contacto);
                            }
                        }
                    }

                    return csv.toString().getBytes(StandardCharsets.UTF_8);
                });
    }

    private void agregarFila(
            StringBuilder csv,
            SolicitudResponse solicitud,
            ContactoSolicitud contacto) {

        csv.append(String.join(",",
                escapar(solicitud.codigo()),
                escapar(solicitud.marca()),
                escapar(solicitud.tipoSolicitud()),
                escapar(solicitud.fechaEnvio()),
                escapar(solicitud.numeroContacto()),
                escapar(solicitud.nombreContacto()),
                escapar(contacto == null ? null : contacto.getIdentificador()),
                escapar(contacto == null ? null : contacto.getNombreContacto()),
                escapar(contacto == null ? null : contacto.getNumeroContacto())
        ));

        csv.append("\r\n");
    }

    private String escapar(Object valor) {
        if (valor == null) {
            return "\"\"";
        }

        String texto = valor.toString();

        // Evitamos que una hoja de calculo interprete texto como una formula
        if (texto.startsWith("=") || texto.startsWith("+")
                || texto.startsWith("-") || texto.startsWith("@")
                || texto.startsWith("\t") || texto.startsWith("\r")
                || texto.startsWith("\n")) {
            texto = "'" + texto;
        }

        // Las comillas internas se duplican para mantener el formato CSV
        return "\"" + texto.replace("\"", "\"\"") + "\"";
    }
}