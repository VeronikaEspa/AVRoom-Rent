import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.config';
import { verifyToken } from '../utils/jwt.utils';

export const expressAuthentication = (
  securityName: string,
  roles?: string[],
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (securityName !== 'jwt') {
        logger.warn('Unsupported security scheme', { securityName });
        res
          .status(401)
          .json({ message: 'Unauthorized: Unsupported security scheme' });
        return;
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        logger.warn('Authorization header missing', { url: req.url });
        res
          .status(401)
          .json({ message: 'Unauthorized: Authorization header missing' });
        return;
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        logger.warn('Token missing in authorization header', { url: req.url });
        res.status(401).json({ message: 'Unauthorized: Token missing' });
        return;
      }

      const decoded = verifyToken(token);
      logger.info('Authenticated request', { url: req.url, decoded });

      if (roles && roles.length > 0) {
        if (!roles.includes(decoded.role)) {
          logger.warn('Forbidden: User role not authorized', {
            userRole: decoded.role,
            requiredRoles: roles,
          });
          res.status(403).json({ message: 'Forbidden: Insufficient role' });
          return;
        }
      }

      (req as any).user = decoded;
      next();
    } catch (error) {
      logger.error('Invalid or expired token', { error });
      res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
  };
};