# Proyecto de Gestión de Restaurantes

Este es un proyecto de gestión de restaurantes que permite a los usuarios registrarse, iniciar sesión, y gestionar sus restaurantes favoritos. Utiliza Node.js, Express y LowDB para almacenar datos en formato JSON.

## Estructura del Proyecto

```plaintext
/backend
│
├── /node_modules         # Módulos de Node.js
│
├── /src                  # Código fuente
│   ├── /data             # Archivos JSON para almacenamiento
│   ├── /middleware        # Middleware de autenticación
│   ├── /modules          # Módulos de la aplicación
│   │   ├── /auth         # Autenticación de usuarios
│   │   │   ├── /controllers  # Controladores de autenticación
│   │   │   ├── /routes       # Rutas de autenticación
│   │   │   └── /types        # Tipos de datos
│   │   ├── /favorites     # Gestión de favoritos
│   │   ├── /restaurants   # Gestión de restaurantes
│   │   └── /reviews       # Gestión de reseñas
│   ├── /utils            # Archivos utilitarios
│   ├── app.ts            # Configuración de la aplicación
│   └── server.ts         # Archivo de inicio del servidor
│
├── .env                  # Variables de entorno
├── .gitignore            # Archivos y directorios a ignorar por Git
├── package-lock.json     # Lock file de dependencias
├── package.json          # Archivo de configuración de npm
└── tsconfig.json         # Configuración de TypeScript
```

# Requisitos
- Node.js (v14 o superior)
- npm (v6 o superior)

# Instalación
## Clonar el repositorio:
```bash
git clone https://github.com/tu_usuario/proyecto-restaurantes.git
cd proyecto-restaurantes
```

## Instalar las dependencias:
```bash
npm install
```

## Configurar las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto y define tu clave secreta para JWT.
```plaintext
JWT_SECRET=la_clave_secreta_123
TEST_USER_USERNAME=test-user
TEST_USER_PASSWORD=test-password
```

## Insertar datos de prueba (solo si no existen)
```
npx ts-node src/scripts/populateDatabase.ts
```
Este script (`populateDatabase.ts`) se utiliza para poblar una base de datos con información inicial de restaurantes, usuarios y reseñas a partir de un archivo JSON. Facilita el desarrollo al proporcionar datos de prueba realistas. Los usuarios tienen contraseñas encriptadas con `bcrypt` y el script asegura la correcta creación de relaciones entre entidades.

# Uso
## Iniciar el servidor:
```bash
npm run start
```

# Testing
```
npm test
```
En la carpeta __test__ se encuentran todos los test que comprueban el correcto funconamiento de la API.

El servidor se iniciará en `http://localhost:3000`.
# Rutas de la API

- **Registro:** `POST /auth/register`
  - **Body:** `{ "username": "tu_usuario", "password": "tu_contraseña" }`
  - **Respuesta:** `{ "message": "Usuario registrado exitosamente" }`

- **Inicio de sesión:** `POST /auth/login`
  - **Body:** `{ "username": "tu_usuario", "password": "tu_contraseña" }`
  - **Respuesta:** `{ "message": "Login exitoso", "token": "tu_token" }`

- **Obtener favoritos:** `GET /favorites`
  - **Headers:** `Authorization: Bearer tu_token`
  - **Respuesta:** `[{ ...restaurante }, {...}]`

- **Añadir favorito:** `POST /favorites/`
  - **Headers:** `Authorization: Bearer tu_token`
  - **Respuesta:** `{ "message": "Restaurante añadido a favoritos" }`

- **Eliminar favorito:** `DELETE /favorites/`
  - **Headers:** `Authorization: Bearer tu_token`
  - **Respuesta:** `{ "message": "Restaurante eliminado de favoritos" }`

- **Obtener restaurantes:** `GET /restaurants`
  - **Respuesta:** `[{ ...restaurante }, {...}]`

- **Crear restaurante:** `POST /restaurants`
  - **Body:** `{ ...datos_restaurante }`
  - **Respuesta:** `{ "id": "nuevo_id", ... }`

- **Actualizar restaurante:** `PUT /restaurants/`
  - **Body:** `{ ...nuevos_datos }`
  - **Respuesta:** `{ ...restaurante_actualizado }`

- **Eliminar restaurante:** `DELETE /restaurants/`
  - **Respuesta:** `204 No Content`

- **Obtener reseña:** `GET /reviews/`
  - **Headers:** `Authorization: Bearer tu_token`
  - **Respuesta:** `{ ...reseña }`

- **Crear reseña:** `POST /reviews`
  - **Body:** `{ "restaurantId": "id_del_restaurante", "name": "tu_nombre", "rating": 5, "comments": "tu_comentario" }`
  - **Respuesta:** `{ "message": "Reseña creada exitosamente" }`

- **Actualizar reseña:** `PUT /reviews/`
  - **Body:** `{ "rating": 4, "comments": "comentario actualizado" }`
  - **Respuesta:** `{ "message": "Reseña actualizada exitosamente" }`

- **Eliminar reseña:** `DELETE /reviews/`
  - **Respuesta:** `204 No Content`

# Problemas con la Gestión de Permisos

Es importante mencionar que la implementación actual del sistema de permisos y autenticación puede no ser lo suficientemente robusta para aplicaciones de producción. El middleware de autenticación se aplica a las rutas CRUD, pero no se implementa una gestión de permisos más granular. Esto significa que cualquier usuario autenticado puede acceder y modificar los recursos sin restricciones basadas en roles.

# Posibles Mejoras Futuras

- **Gestión de Roles:** Implementar roles para usuarios (ejemplo: admin, usuario) que determinen los permisos para acceder y modificar recursos.
- **Validaciones de Permisos:** Añadir middleware para validar si el usuario tiene permiso para realizar una acción específica sobre un recurso.
- **Registro de Actividades:** Implementar un sistema de logging para rastrear acciones realizadas por usuarios, lo que puede ser útil para auditorías y detección de fraudes.

# Pruebas

El testing se realiza utilizando Jest y Supertest para asegurar la estabilidad de las funcionalidades CRUD. Cada prueba se ejecuta dentro de transacciones, que se revierten para evitar que los datos permanezcan en la base de datos, manteniéndola limpia y garantizando la independencia entre pruebas. Esto incluye pruebas para creación, lectura, actualización, y eliminación de entidades como favoritos, reseñas, y restaurantes, verificando tanto el comportamiento exitoso como los posibles errores.