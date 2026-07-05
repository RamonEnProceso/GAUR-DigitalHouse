import { Request, Response, NextFunction } from 'express';
import { supabase } from '../db/supabase.js';

/**
 * Middleware de autenticación que verifica el JWT de Supabase.
 *
 * Extrae el token del header `Authorization: Bearer <token>`,
 * lo valida contra Supabase Auth y asigna `req.userId`.
 *
 * Las rutas públicas (como /health) deben montarse ANTES de este middleware.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token de autenticación requerido' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ message: 'Token inválido o expirado' });
      return;
    }

    // Asignar userId al request para que los controladores lo usen
    (req as any).userId = data.user.id;

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error de autenticación', error });
  }
}
