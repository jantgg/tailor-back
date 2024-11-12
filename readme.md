# Para arrancar el proyecto

## Requisitos
- Node.js (v14 o superior)
- npm (v6 o superior)

## Creamos .env en la raiz

```
PORT=3000
JWT_SECRET=la_clave_secreta_123
TEST_USER_USERNAME=test-user
TEST_USER_PASSWORD=test-password
```

## Usamos los siguientes comandos

```bash
npm install
npx tsc
npm run start
```

## Estructura del Proyecto

```plaintext
# Estructura de Carpetas del Proyecto Backend

```plaintext
backend/
├── __tests__/
│   ├── authController.test.ts       # Pruebas unitarias para los controladores de autenticación.
│   ├── endToEnd.test.ts             # Pruebas end-to-end para verificar el flujo completo de la aplicación.
│   ├── restaurantsRoutes.test.ts    # Pruebas para las rutas de restaurantes.
│   └── reviewsRoutes.test.ts        # Pruebas para las rutas de reseñas.
├── dist/                            # Código transpilado listo para producción (TypeScript -> JavaScript).
├── node_modules/                    # Dependencias del proyecto.
├── src/
│   ├── @types/                      # Tipos personalizados de TypeScript.
│   ├── data/
│   │   ├── AppDataSource.ts         # Configuración de la fuente de datos con TypeORM.
│   │   ├── db.ts                    # Configuración de la base de datos SQLite sin TypeORM.
│   │   └── restaurants.json         # Datos iniciales de restaurantes para poblar la base de datos.
│   ├── middleware/
│   │   └── authMiddleware.ts        # Middleware de autenticación para proteger rutas.
│   ├── migrations/
│   │   └── 1730983152941-MigracionInicial.ts # Archivo de migración inicial para la base de datos.
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── authController.ts     # Controlador de autenticación, que incluye registro e inicio de sesión de usuarios.
│   │   │   ├── authRoutes.ts         # Definición de rutas para la autenticación de usuarios.
│   │   │   ├── User.ts               # Entidad de usuario definida con TypeORM.
│   │   │   └── userTypes.ts          # Tipos personalizados para la entidad de usuario.
│   │   ├── favorites/
│   │   │   ├── Favorite.ts           # Entidad de favoritos, que representa los favoritos de los usuarios.
│   │   │   ├── favoriteController.ts # Controlador para manejar la lógica de favoritos.
│   │   │   ├── favoriteRepository.ts # Repositorio para operaciones de favoritos.
│   │   │   ├── favoritesRoutes.ts    # Rutas relacionadas con la funcionalidad de favoritos.
│   │   │   └── favoritesTypes.ts     # Tipos personalizados para la entidad de favoritos.
│   │   ├── restaurants/
│   │   │   ├── Restaurant.ts         # Entidad de restaurantes, definida con TypeORM.
│   │   │   ├── restaurantController.ts # Controlador para manejar la lógica de restaurantes.
│   │   │   ├── restaurantRepository.ts # Repositorio para operaciones de restaurantes.
│   │   │   ├── restaurantsRoutes.ts  # Rutas relacionadas con la funcionalidad de restaurantes.
│   │   │   └── restaurantsTypes.ts   # Tipos personalizados para la entidad de restaurantes.
│   │   ├── reviews/
│   │   │   ├── Review.ts             # Entidad de reseñas, definida con TypeORM.
│   │   │   ├── reviewController.ts   # Controlador para manejar la lógica de reseñas.
│   │   │   ├── reviewRepository.ts   # Repositorio para operaciones de reseñas.
│   │   │   ├── reviewsRoutes.ts      # Rutas relacionadas con la funcionalidad de reseñas.
│   │   │   └── reviewTypes.ts        # Tipos personalizados para la entidad de reseñas.
│   ├── scripts/
│   │   └── populateDatabase.ts       # Script para poblar la base de datos con datos iniciales.
│   ├── utils/
│   │   ├── calculateRating.ts        # Función de utilidad para calcular la calificación promedio de un restaurante.
│   │   ├── app.ts                    # Configuración principal de la aplicación Express.
│   │   └── server.ts                 # Configuración del servidor e inicialización.
├── .env                              # Archivo de configuración de variables de entorno (e.g., claves secretas).
├── .gitignore                        # Archivo para ignorar archivos y carpetas en Git.
├── commands.md                       # Archivo de comandos útiles para desarrollo o despliegue.
├── database.sqlite                   # Archivo de la base de datos SQLite.
├── package.json                      # Archivo de configuración de dependencias del proyecto.
├── package-lock.json                 # Archivo que bloquea las versiones de las dependencias.
├── readme.md                         # Archivo README para documentar el proyecto.
├── tsconfig.json                     # Configuración de TypeScript.

```

## Descripción de Archivos Principales:

- **__tests__/**: Carpeta que contiene las pruebas de la aplicación, incluyendo pruebas unitarias y end-to-end para verificar la funcionalidad de diferentes módulos.
- **dist/**: Carpeta que contiene el código transpilado de TypeScript a JavaScript para la versión de producción.
- **src/**: Carpeta principal del código fuente del proyecto.
  - **@types/**: Carpeta para tipos personalizados de TypeScript utilizados en diferentes módulos.
  - **data/**: Contiene la configuración de la base de datos (`AppDataSource.ts` y `db.ts`) y los datos iniciales (`restaurants.json`).
  - **middleware/**: Contiene los middlewares, como el `authMiddleware.ts` para autenticación.
  - **migrations/**: Contiene archivos de migración para la base de datos.
  - **modules/**: Contiene los diferentes módulos de la aplicación organizados por funcionalidad:
    - **auth/**: Módulo de autenticación de usuarios. Incluye controladores, rutas y la entidad `User`.
    - **favorites/**: Módulo para manejar los favoritos de los usuarios, con controladores, rutas y la entidad `Favorite`.
    - **restaurants/**: Módulo para la gestión de restaurantes.
    - **reviews/**: Módulo para la gestión de reseñas de los restaurantes.
  - **scripts/**: Scripts de utilidad, como `populateDatabase.ts` para poblar la base de datos con datos iniciales.
  - **utils/**: Funciones de utilidad para la aplicación, como `calculateRating.ts` para calcular la calificación de los restaurantes.
- **.env**: Archivo para configurar las variables de entorno, como claves secretas o la configuración del puerto.
- **database.sqlite**: Archivo de base de datos SQLite que almacena la información del proyecto.

## Insertar datos de prueba (solo si no existen, o la db se ha corrompido)
```
npx ts-node src/scripts/populateDatabase.ts
```
Este script (`populateDatabase.ts`) se utiliza para poblar una base de datos con información inicial de restaurantes, usuarios y reseñas a partir de un archivo JSON. Facilita el desarrollo al proporcionar datos de prueba realistas. Los usuarios tienen contraseñas encriptadas con `bcrypt` y el script asegura la correcta creación de relaciones entre entidades.

# Pruebas

El testing se realiza utilizando Jest y Supertest para asegurar la estabilidad de las funcionalidades CRUD. Cada prueba se ejecuta dentro de transacciones, que se revierten para evitar que los datos permanezcan en la base de datos, manteniéndola limpia y garantizando la independencia entre pruebas. Esto incluye pruebas para creación, lectura, actualización, y eliminación de entidades como favoritos, reseñas, y restaurantes, verificando tanto el comportamiento exitoso como los posibles errores.

## Testing
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

