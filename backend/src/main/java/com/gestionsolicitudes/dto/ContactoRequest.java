package com.gestionsolicitudes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ContactoRequest {

    @NotBlank(message = "El nombre del contacto es obligatorio")
    @Size(max = 150, message = "El nombre no debe superar los 150 caracteres")
    private String nombreContacto;

    @NotBlank(message = "El numero del contacto es obligatorio")
    @Size(max = 20, message = "El numero no debe superar los 20 digitos")
    @Pattern(
        regexp = "^[0-9]+$",
        message = "El numero del contacto solo debe contener digitos"
    )
    private String numeroContacto;

    public String getNombreContacto() {
        return nombreContacto;
    }

    public void setNombreContacto(String nombreContacto) {
        this.nombreContacto = nombreContacto;
    }

    public String getNumeroContacto() {
        return numeroContacto;
    }

    public void setNumeroContacto(String numeroContacto) {
        this.numeroContacto = numeroContacto;
    }
}