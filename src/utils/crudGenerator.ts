import { Request, Response, Router, NextFunction } from 'express';
import { Repository, ObjectLiteral, FindOptionsWhere } from 'typeorm';
import { authMiddleware } from '../middleware/authMiddleware';

interface CrudOptions<T extends ObjectLiteral> {
  repository: Repository<T>;
  protected?: boolean;
}

export function generateCrudRoutes<T extends ObjectLiteral>({ repository, protected: isProtected }: CrudOptions<T>): Router {
  const router = Router();

  const applyAuthMiddleware = isProtected ? authMiddleware : (_req: Request, _res: Response, next: NextFunction) => next();

  // Crear (POST)
  router.post('/', applyAuthMiddleware, async (req: Request, res: Response) => {
    try {
      const newEntity = repository.create(req.body);
      const result = await repository.save(newEntity);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Leer todos (GET)
  router.get('/', applyAuthMiddleware, async (_req: Request, res: Response) => {
    try {
      const entities = await repository.find();
      res.json(entities);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Leer uno por ID (GET)
  router.get('/:id', applyAuthMiddleware, async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const entityFound = await repository.findOne({
        where: { id } as unknown as FindOptionsWhere<T> // Conversión de tipo adicional
      });
      if (!entityFound) {
        res.status(404).json({ message: 'Entity not found' });
        return;
      }
      res.json(entityFound);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Actualizar (PUT)
  router.put('/:id', applyAuthMiddleware, async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const entityToUpdate = await repository.findOne({
        where: { id } as unknown as FindOptionsWhere<T>
      });

      if (!entityToUpdate) {
        res.status(404).json({ message: 'Entity not found' });
        return;
      }

      repository.merge(entityToUpdate, req.body);
      const result = await repository.save(entityToUpdate);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Eliminar (DELETE)
  router.delete('/:id', applyAuthMiddleware, async (req: Request, res: Response) => {
    try {
      const result = await repository.delete(req.params.id as string);
      if (result.affected === 0) {
        res.status(404).json({ message: 'Entity not found' });
        return;
      }
      res.json({ message: 'Entity deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  return router;
}
