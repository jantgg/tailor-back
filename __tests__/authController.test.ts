// /backend/__tests__/authController.test.ts

// Este archivo contiene un conjunto de pruebas para validar los endpoints de autenticación del controlador de Auth.
// Las pruebas incluyen el registro de nuevos usuarios y el inicio de sesión, asegurando que los flujos básicos de autenticación
// funcionen correctamente. Cada prueba utiliza un entorno controlado con usuarios de prueba creados dinámicamente si es necesario,
// para garantizar que las pruebas sean consistentes e independientes.

import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data/AppDataSource';
import { User } from '../src/modules/auth/User';

// Configuración de usuarios de prueba
const testUsername = process.env.TEST_USER_USERNAME || 'test-user';
const testPassword = process.env.TEST_USER_PASSWORD || 'test-password';

// Configurar las pruebas
let token: string;

beforeAll(async () => {
  // Inicializar la conexión a la base de datos antes de todas las pruebas
  await AppDataSource.initialize();

  // Verificar si el usuario de prueba ya existe en la base de datos
  const userRepository = AppDataSource.getRepository(User);
  let user = await userRepository.findOneBy({ username: testUsername });

  let usernameToUse = testUsername;
  let passwordToUse = testPassword;

  if (user) {
    // Crear un nuevo usuario de prueba con un nombre de usuario aleatorio
    usernameToUse = `test-user-${Date.now()}`;
    passwordToUse = 'random-password';

    // Registrar al nuevo usuario
    const registrationResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: usernameToUse,
        password: passwordToUse,
      });

    if (registrationResponse.statusCode !== 201) {
      throw new Error('No se pudo crear el usuario de prueba');
    }
  }

  // Autenticar al usuario de prueba para obtener el token de acceso
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      username: usernameToUse,
      password: passwordToUse,
    });

  if (loginResponse.statusCode !== 200) {
    throw new Error('No se pudo iniciar sesión con el usuario de prueba');
  }

  token = loginResponse.body.token;
});

afterAll(async () => {
  // Cerrar la conexión a la base de datos después de todas las pruebas
  await AppDataSource.destroy();
});

describe('AuthController - Registro e Inicio de Sesión', () => {
  it('debería registrar un nuevo usuario exitosamente', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: `another-user-${Date.now()}`,
        password: 'another-password',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Usuario registrado exitosamente');
  });

  it('debería permitir a un usuario iniciar sesión exitosamente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUsername,
        password: testPassword,
      });

    if (res.statusCode !== 200) {
      console.error(`Error en inicio de sesión: Código de estado: ${res.statusCode}, Respuesta: ${JSON.stringify(res.body)}`);
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('debería devolver un error si el usuario no existe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'nonexistentuser',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Credenciales inválidas');
  });

  it('debería devolver un error si la contraseña es incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUsername,
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Credenciales inválidas');
  });
});
