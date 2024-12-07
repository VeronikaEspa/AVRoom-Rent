import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { logger } from '../config/logger.config';

export const expressAuthentication = (
  securityName: string,
  roles?: string[],
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (securityName === 'jwt') {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        logger.warn('Authorization header missing', {
          url: req.url,
          method: req.method,
          ip: req.ip,
          headers: req.headers,
        });
        res
          .status(401)
          .json({ message: 'Unauthorized: Authorization header missing' });
        return;
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        logger.warn('Token missing in authorization header', {
          url: req.url,
          method: req.method,
          ip: req.ip,
        });
        res.status(401).json({ message: 'Unauthorized: Token missing' });
        return;
      }

      try {
        const decoded = verifyToken(token);
        if (
          typeof decoded !== 'object' ||
          decoded === null ||
          !('role' in decoded)
        ) {
          logger.error('Invalid token payload', {
            url: req.url,
            method: req.method,
            ip: req.ip,
          });
          res
            .status(401)
            .json({ message: 'Unauthorized: Invalid token payload' });
          return;
        }

        logger.info('Authenticated request', {
          url: req.url,
          method: req.method,
          ip: req.ip,
          decoded,
        });

        if (roles && roles.length > 0) {
          logger.debug('Checking roles', {
            decodedRole: decoded.role,
            requiredRoles: roles,
          });

          if (!roles.includes(decoded.role)) {
            logger.warn('Forbidden: User role not authorized', {
              url: req.url,
              method: req.method,
              ip: req.ip,
              userRole: decoded.role,
              requiredRoles: roles,
            });
            res.status(403).json({ message: 'Forbidden: Insufficient role' });
            return;
          }
        }

        (req as any).user = decoded;
        next();
      } catch (error: unknown) {
        logger.error('Invalid or expired token', {
          url: req.url,
          method: req.method,
          ip: req.ip,
          error:
            error instanceof Error ? error.message : 'Invalid or Expired Token',
        });
        res
          .status(401)
          .json({ message: 'Unauthorized: Invalid or expired token' });
        return;
      }
    } else {
      logger.warn(`Unsupported security scheme: ${securityName}`, {
        url: req.url,
        method: req.method,
        ip: req.ip,
      });
      res
        .status(401)
        .json({ message: 'Unauthorized: Unsupported security scheme' });
      return;
    }
  };
};
