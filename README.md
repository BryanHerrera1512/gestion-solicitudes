# Gestión de solicitudes

Este proyecto permite registrar solicitudes junto con sus contactos adicionales. También permite consultar los registros, aplicar filtros, ordenar la información y exportarla en formato CSV.

El proyecto está dividido en dos partes:

- `backend`: contiene la API y la conexión con PostgreSQL
- `frontend`: contiene la aplicación desarrollada con React

## Tecnologías

Para el backend se utilizaron:

- Java 21
- Spring Boot
- Spring WebFlux
- Spring Data R2DBC
- PostgreSQL
- Gradle
- Swagger/OpenAPI

Para el frontend se utilizaron:

- React
- Vite
- React Router
- React DatePicker

## Base de datos

Primero se debe crear una base de datos en PostgreSQL con el siguiente nombre:

```text
gestion_solicitudes
```

Después se deben ejecutar estos archivos en el orden indicado:

```text
backend/sql/01_tablas.sql
backend/sql/02_datos.sql
```

El primer archivo crea las tablas y el segundo agrega algunos datos para probar la aplicación.

## Configuración del backend

La conexión utiliza variables de entorno para no guardar la contraseña de PostgreSQL dentro del proyecto.

Se deben configurar estas dos variables:

```text
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
```

La aplicación utiliza la siguiente conexión:

```text
r2dbc:postgresql://localhost:5432/gestion_solicitudes
```

## Cómo iniciar el backend

Abrir una terminal dentro de la carpeta `backend`:

```bash
cd backend
```

Ejecutar el proyecto en Windows:

```bash
gradlew.bat bootRun
```

El backend estará disponible en:

```text
http://localhost:8080
```

## Cómo iniciar el frontend

Abrir otra terminal dentro de la carpeta `frontend`:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Después iniciar la aplicación:

```bash
npm run dev
```

El frontend estará disponible en:

```text
http://localhost:5173
```

## Funcionalidades

La aplicación permite:

- Registrar una solicitud
- Agregar varios contactos a una solicitud
- Consultar la lista de solicitudes registradas
- Filtrar por fecha y tipo de solicitud
- Ordenar los resultados
- Consultar el detalle de una solicitud
- Exportar los registros en formato CSV

## Endpoints

| Método | Endpoint | Función |
|---|---|---|
| POST | `/api/solicitudes` | Registra una solicitud |
| GET | `/api/solicitudes` | Lista, filtra y ordena las solicitudes |
| GET | `/api/solicitudes/{codigo}` | Busca una solicitud por su código |
| GET | `/api/solicitudes/exportar` | Descarga las solicitudes en formato CSV |

## Swagger

La documentación de los endpoints se puede consultar con el backend encendido:

```text
http://localhost:8080/swagger-ui/index.html
```

El contrato OpenAPI también se encuentra en:

```text
backend/docs/openapi.yaml
```