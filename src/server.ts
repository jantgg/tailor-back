// /backend/src/server.ts
import dotenv from 'dotenv';
import app from './app';
import { AppDataSource } from './data/AppDataSource';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Inicializa la conexión a la base de datos y luego arranca el servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Conexión a la base de datos establecida");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos", error);
  });
