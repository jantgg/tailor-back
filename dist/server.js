"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// /backend/src/server.ts
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const AppDataSource_1 = require("./data/AppDataSource");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// Inicializa la conexión a la base de datos y luego arranca el servidor
AppDataSource_1.AppDataSource.initialize()
    .then(() => {
    console.log("Conexión a la base de datos establecida");
    app_1.default.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Error al conectar a la base de datos", error);
});
