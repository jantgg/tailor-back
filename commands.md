Eejcutar migraciones: npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data/AppDataSource.ts
Crear migraciones: npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./src/migrations/MigracionInicial -d ./src/data/AppDataSource.ts
Insertar DAtos Demo: npx ts-node src/scripts/populateDatabase.ts