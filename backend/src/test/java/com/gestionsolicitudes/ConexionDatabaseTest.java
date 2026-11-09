package com.gestionsolicitudes;

import java.time.Duration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.r2dbc.core.DatabaseClient;

import reactor.test.StepVerifier;

@SpringBootTest
class ConexionDatabaseTest {

    @Autowired
    private DatabaseClient databaseClient;

    @Test
    void conectaConPostgres() {
        // Para probar a que BD estamos conectados
        var consulta = databaseClient.sql("SELECT current_database()")
                .map((fila, metadata) -> fila.get(0, String.class))
                .one();

        StepVerifier.create(consulta)
                .expectNext("gestion_solicitudes")
                .expectComplete()
                .verify(Duration.ofSeconds(10));
    }
}