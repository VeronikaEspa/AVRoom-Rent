import { Request, Response } from 'express';
import { logger } from '../config/logger.config';
import { generateToken, JwtPayload } from '../utils/jwt.utils';

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      logger.warn('Login failed: User not found', { email });
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    if (password !== user.password) {
      logger.warn('Login failed: Incorrect password', { email });
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const tokenPayload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(tokenPayload);

    logger.info('Login successful', { userId: user.id, email });

    res.json({
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    logger.error('Error during login', { error: error });
    res.status(500).json({ message: 'Internal server error' });
  }
};

const findUserByEmail = async (email: string) => {
  return {
    id: '123',
    email,
    password: 'test_password',
    role: 'User',
  };
};
