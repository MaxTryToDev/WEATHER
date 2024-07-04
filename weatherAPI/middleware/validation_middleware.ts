import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export default function validationMiddleware(schema: ZodSchema) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse(req.body);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).send(err.errors);
        return;
      }
      next(err);
    }
    next();
  };
}