package com.gestionsolicitudes.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SolicitudRequest {

    @NotBlank(message = "La marca es obligatoria")
    @Size(max = 100, message = "La marca no debe superar los 100 caracteres")
    private String marca;

    @NotBlank(message = "El tipo de solicitud es obligatorio")
    @Size(max = 100, message = "El tipo no debe superar los 100 caracteres")
    private String tipoSolicitud;

    @NotNull(message = "La fecha de envio es obligatoria")
    private LocalDate fechaEnvio;

    @NotBlank(message = "El numero de contacto es obligatorio")
    @Size(max = 20, message = "El numero no debe superar los 20 digitos")
    @Pattern(
        regexp = "^[0-9]+$",
        message = "El numero de contacto solo debe contener digitos"
    )
    private String numeroContacto;

    @NotBlank(message = "El nombre de contacto es obligatorio")
    @Size(max = 150, message = "El nombre no debe superar los 150 caracteres")
    private String nombreContacto;

    // La solicitud puede registrarse sin contactos adicionales.
    @Valid
    @NotNull(message = "La lista de contactos no puede ser null")
    private List<@NotNull ContactoRequest> contactos = new ArrayList<>();

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getTipoSolicitud() {
        return tipoSolicitud;
    }

    public void setTipoSolicitud(String tipoSolicitud) {
        this.tipoSolicitud = tipoSolicitud;
    }

    public LocalDate getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDate fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public String getNumeroContacto() {
        return numeroContacto;
    }

    public void setNumeroContacto(String numeroContacto) {
        this.numeroContacto = numeroContacto;
    }

    public String getNombreContacto() {
        return nombreContacto;
    }

    public void setNombreContacto(String nombreContacto) {
        this.nombreContacto = nombreContacto;
    }

    public List<ContactoRequest> getContactos() {
        return contactos;
    }

    public void setContactos(List<ContactoRequest> contactos) {
        this.contactos = contactos;
    }
}