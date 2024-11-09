// /backend/src/@types/express.d.ts
declare namespace Express {
    export interface Request {
      user?: {
        id: number;
      };
    }
  }
  
/**
 * Este archivo extiende la interfaz `Request` de Express para incluir una propiedad `user`.
 * Esta extensión permite que TypeScript reconozca `req.user` como un objeto opcional 
 * con una propiedad `id` de tipo `number`. Esto es necesario en nuestro proyecto 
 * debido a la autenticación basada en usuarios, donde `req.user` se asigna 
 * después de la validación del token.
 *
 * Ubicamos este archivo en `@types` para centralizar y gestionar las extensiones
 * de tipos y personalizaciones de TypeScript. Esta estructura sigue la convención 
 * de usar una carpeta `@types` para definiciones globales o extensiones de terceros.
 *
 * En `tsconfig.json`, hemos incluido esta carpeta para que TypeScript considere 
 * estas definiciones durante la compilación.
 */
