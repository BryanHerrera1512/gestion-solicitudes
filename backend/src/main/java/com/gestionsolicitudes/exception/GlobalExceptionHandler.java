package com.gestionsolicitudes.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(WebExchangeBindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> manejarValidaciones(
            WebExchangeBindException exception) {

        Map<String, String> errores = new LinkedHashMap<>();

        // Devolvemos el campo y el mensaje definido en el DTO
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errores.putIfAbsent(
                        error.getField(),
                        error.getDefaultMessage()));

        return errores;
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> manejarErrorDeSolicitud(
            ResponseStatusException exception) {

        String mensaje = exception.getReason();

        if (mensaje == null || mensaje.isBlank()) {
            mensaje = "No se pudo procesar la solicitud";
        }

        return ResponseEntity
                .status(exception.getStatusCode())
                .body(Map.of("mensaje", mensaje));
    }
}