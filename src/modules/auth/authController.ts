// /backend/src/modules/auth/authController.ts

import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './User';
import { AppDataSource } from '../../data/AppDataSource';

// Obtener el repositorio de usuarios desde TypeORM
const userRepository = AppDataSource.getRepository(User);

// Método para registrar un usuario
export const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await userRepository.findOneBy({ username });
    if (existingUser) {
      res.status(400).json({ error: 'Usuario ya registrado' });
      return;
    }

    // Crear un nuevo usuario con la contraseña hasheada
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({
      username,
      password: hashedPassword,
    });

    // Guardar el nuevo usuario en la base de datos
    await userRepository.save(newUser);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Método para iniciar sesión
export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const user = await userRepository.findOneBy({ username });
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'la_clave_secreta_123',
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
