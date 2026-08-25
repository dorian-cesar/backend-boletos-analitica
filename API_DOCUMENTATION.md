# Documentación de APIs - Backend Boletos Analítica

Este documento contiene la especificación detallada de todas las APIs REST proporcionadas por el proyecto **Backend Boletos Analítica**.

---

## 📌 Información General

- **Tecnologías**: Node.js, Express.js, Sequelize ORM, MySQL.
- **Autenticación**: JSON Web Tokens (JWT) mediante el header `Authorization`.
- **Formato de datos**: JSON (`application/json`).
- **Puerto por defecto**: `3000` (configurable mediante la variable de entorno `PORT`).

---

## 🔒 Autenticación y Encabezados

Para interactuar con las rutas protegidas, se debe enviar el token de autenticación en la cabecera HTTP:

```http
Authorization: Bearer <TU_JWT_TOKEN>
Content-Type: application/json
```

---

## 🌐 Endpoints

### 1. Estado del Servidor

#### `GET /`
Verifica si el servidor backend se encuentra arriba y en ejecución.

- **Autenticación**: No requerida.
- **Respuesta de Éxito (`200 OK`)**:
  ```json
  {
    "mensaje": "¡Backend funcionando con Node y Express!"
  }
  ```

---

### 🔑 2. Autenticación (`/api/auth`)

#### `POST /api/auth/login`
Autentica al usuario administrador y genera un token JWT válido por 1 hora.

- **Autenticación**: No requerida.
- **Body (`application/json`)**:
  ```json
  {
    "email": "admin@ejemplo.com",
    "password": "tu_password"
  }
  ```
- **Respuestas**:
  - `200 OK`: Credenciales válidas.
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - `401 Unauthorized`: Credenciales inválidas.
    ```json
    {
      "error": "Credenciales inválidas"
    }
    ```

---

#### `GET /api/auth/validate`
Valida si un Token JWT es auténtico y no ha expirado.

- **Autenticación**: Requerida (`Bearer Token`).
- **Respuestas**:
  - `200 OK`: Token válido.
    ```json
    {
      "valid": true,
      "user": {
        "email": "admin@ejemplo.com",
        "iat": 1770477000,
        "exp": 1770480600
      }
    }
    ```
  - `401 Unauthorized`: Token no proporcionado, expirado o inválido.
    ```json
    {
      "error": "Token inválido o expirado."
    }
    ```

---

### 🎫 3. Gestión de Tickets (`/api/tickets`)

*Todas las rutas de este módulo requieren token JWT (`Bearer Token`).*

#### `GET /api/tickets`
Obtiene la lista completa de todos los eventos de boleto almacenados.

- **Autenticación**: Requerida (`Bearer Token`).
- **Respuesta de Éxito (`200 OK`)**:
  ```json
  [
    {
      "id": "1",
      "ticket_number": "TCK-1001",
      "connection_id": "CONN-01",
      "id_pos": "POS-01",
      "first_name": "Juan",
      "last_name": "Pérez",
      "document_number": "1234567",
      "document_type_code": "CI",
      "document_type_name": "Cédula de Identidad",
      "email": "juan.perez@example.com",
      "phone": "+595981000000",
      "occupation": "Ingeniero",
      "birth_date": "1990-05-15",
      "gender": "M",
      "nationality": "PRY",
      "country": "PRY",
      "seat_number": "12A",
      "seat_type": "Ejecutivo",
      "seat_status": "Ocupado",
      "quality_code": "STD",
      "trip_id": "TRIP-500",
      "origin_id": "ASU",
      "destination_id": "AGT",
      "origin_title": "Asunción",
      "destination_title": "Ciudad del Este",
      "departure_date": "2026-08-10",
      "departure_time": "08:00:00",
      "arrival_time": "13:00:00",
      "duration": "05:00",
      "bus_type": "Semicama",
      "company": "Empresa X",
      "empresa_transporte": "Transporte NSA",
      "agencia_delta": "AG-001",
      "seat_price": 150000,
      "total_booking_price": 150000,
      "descuento": 20000,
      "monto_final": 130000,
      "cargo_por_servicio": 5000,
      "empresa_convenio": "Itaú",
      "convenio": "Convenio Empleados Itaú",
      "payment_status": "completed",
      "payment_amount": "150000.00",
      "payment_paid": true,
      "payment_token": "TOK-ABC12345",
      "payment_hash": "HASH998877",
      "origen_transaccion": "WEB",
      "tipo_pago": "TARJETA",
      "codigoAutorizacion": "AUTH9876",
      "numero_factura": "001-001-0001234",
      "cdc": "0180000000123456789",
      "timbrado": "12345678",
      "created_at": "2026-08-07T15:00:00.000Z"
    }
  ]
  ```

---

#### `GET /api/tickets/number/:ticket_number`
Obtiene los datos de un boleto específico buscando por su número único de ticket.

- **Autenticación**: Requerida (`Bearer Token`).
- **Parámetro de Ruta**:
  - `ticket_number` (string): Número único del ticket (ej. `TCK-1001`).
- **Respuestas**:
  - `200 OK`: Ticket encontrado.
  - `404 Not Found`: Ticket no encontrado.
    ```json
    {
      "error": "Ticket no encontrado"
    }
    ```

---

#### `GET /api/tickets/:id`
Obtiene un ticket por su identificador numérico interno (`id`).

- **Autenticación**: Requerida (`Bearer Token`).
- **Parámetro de Ruta**:
  - `id` (integer): ID del registro en la base de datos.
- **Respuestas**:
  - `200 OK`: Ticket encontrado.
  - `404 Not Found`:
    ```json
    {
      "error": "No encontrado"
    }
    ```

---

#### `POST /api/tickets`
Crea/registra un nuevo evento de boleto.

- **Autenticación**: Requerida (`Bearer Token`).
- **Body (`application/json`)**: Objeto con los datos del boleto.
  ```json
  {
    "ticket_number": "TCK-1002",
    "connection_id": "CONN-01",
    "id_pos": "POS-01",
    "first_name": "Maria",
    "last_name": "Gómez",
    "document_number": "7654321",
    "seat_number": "14B",
    "trip_id": "TRIP-500",
    "origin_id": "ASU",
    "destination_id": "AGT",
    "company": "Empresa X",
    "empresa_transporte": "Transporte NSA",
    "agencia_delta": "AG-001",
    "seat_price": 150000,
    "descuento": 20000,
    "monto_final": 130000,
    "cargo_por_servicio": 5000,
    "empresa_convenio": "Itaú",
    "convenio": "Convenio Empleados Itaú",
    "payment_status": "completed",
    "payment_paid": true
  }
  ```
- **Respuestas**:
  - `201 Created`: Objeto ticket creado.
  - `400 Bad Request`: Error de validación o clave duplicada.
    ```json
    {
      "error": "Validation error",
      "details": [
        {
          "field": "ticket_number",
          "message": "ticket_number must be unique"
        }
      ]
    }
    ```

---

#### `PUT /api/tickets/:id`
Actualiza un ticket existente.

- **Autenticación**: Requerida (`Bearer Token`).
- **Parámetro de Ruta**:
  - `id` (integer): ID del ticket a actualizar.
- **Body (`application/json`)**: Campos a modificar.
  ```json
  {
    "payment_status": "completed",
    "payment_paid": true
  }
  ```
- **Respuestas**:
  - `200 OK`: Actualización exitosa.
    ```json
    {
      "msg": "Actualizado"
    }
    ```
  - `404 Not Found`: Ticket no encontrado para actualizar.
    ```json
    {
      "error": "No encontrado"
    }
    ```

---

#### `DELETE /api/tickets/:id`
Elimina un ticket de la base de datos.

- **Autenticación**: Requerida (`Bearer Token`).
- **Parámetro de Ruta**:
  - `id` (integer): ID del ticket a eliminar.
- **Respuestas**:
  - `200 OK`: Eliminación exitosa.
    ```json
    {
      "msg": "Eliminado"
    }
    ```
  - `404 Not Found`: Ticket no encontrado.
    ```json
    {
      "error": "No encontrado"
    }
    ```
