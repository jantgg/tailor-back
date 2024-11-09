// src/@types/customResponse.d.ts
import { Response } from 'express';

export interface CustomResponse extends Response {
    _getData: () => any; // Reemplaza 'any' con el tipo real que devuelve
}
