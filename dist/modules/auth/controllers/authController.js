"use strict";
// /backend/src/modules/auth/controllers/authController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
const AppDataSource_1 = require("../../../data/AppDataSource");
// Obtener el repositorio de usuarios desde TypeORM
const userRepository = AppDataSource_1.AppDataSource.getRepository(User_1.User);
// Método para registrar un usuario
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // Verificar si el usuario ya existe en la base de datos
        const existingUser = yield userRepository.findOneBy({ username });
        if (existingUser) {
            res.status(400).json({ error: 'Usuario ya registrado' });
            return;
        }
        // Crear un nuevo usuario con la contraseña hasheada
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = userRepository.create({
            username,
            password: hashedPassword,
        });
        // Guardar el nuevo usuario en la base de datos
        yield userRepository.save(newUser);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.register = register;
// Método para iniciar sesión
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // Buscar el usuario en la base de datos
        const user = yield userRepository.findOneBy({ username });
        if (!user) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }
        // Verificar la contraseña
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }
        // Generar un token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
        res.json({ message: 'Login exitoso', token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.login = login;
